import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { toolbar } from './sections/toolbar.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { nav } from './sections/nav.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { setMessage } from '../assets/js/ui.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'
import { getMe } from '../users/users.api.js'
import {
  addItem,
  cartRecurring,
  deleteItem,
  getItems,
  sortItems
} from './shopping.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  build()
  react()

  try {
    setMessage('Loading...')

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    const [{ items }, { user }] = await Promise.all([getItems(), getMe()])

    state.set('main-documents', items)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'shopping')
    window.state = state // avail to browser console

    requestAnimationFrame(() => {
      document.querySelector('[name="new-item"]')?.focus()
    })
    setMessage()
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
  document.title = 'Shopping | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav({}))
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper'
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(createRightDrawer({ active: 'shopping' }))

  wrapperEl.appendChild(createModalDelete({ password: false }))

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('icon-click:recurring', 'shoppingItems', async () => {
    setMessage('Adding recurring items...')
    await cartRecurring()
    // server-side update to shopping list
    // refresh to reflect changes
    window.location.reload()
  })

  state.on('form-submit:shopping-form', 'shoppingItems', handleFormSubmit)

  state.on('item-click:cart-suggestion', 'shoppingItems', handleCartsuggestion)

  state.on('icon-click:delete-item', 'shoppingItems', async (item) => {
    await handleDeleteItem(item)
  })

  state.on('icon-click:sort', 'shoppingItems', updateLocalSortOrder)

  state.on(
    'button-click:modal-delete-btn',
    'shoppingitem',
    handleModalDeleteConfirm
  )

  state.on('list-dragged:shopping-list', 'shoppingItems', handleSortItems)
}

/**
 *
 */
async function handleFormSubmit() {
  const textArea = document.querySelector('[name="new-item"]')
  const value = textArea.value.trim().toLowerCase()
  if (!value) return

  const titles = value
    .split(/\n|,/)
    .map((i) => i.trim())
    .filter(Boolean)
    // process last title first so unshift preserves original order
    .reverse()

  if (!titles.length) return

  const adding = titles.length === 1 ? titles[0] : 'items'
  setMessage(`Adding ${adding}...`)

  const view = document.getElementById('view-select').getSelected().value
  const docs = [...state.get('main-documents')]

  const isTemp =
    view === 'cart' &&
    Number(document.getElementById('temp').classList.contains('primary'))
      ? 1
      : 0

  for (const title of titles) {
    const { data, error } = await addItem({ title, view, isTemp })

    if (error) {
      // Keep any items successfully added earlier in this submission
      state.set('main-documents', docs)
      setMessage(error, { type: 'danger' })
      return
    }
    const index = docs.findIndex((d) => d.id === data.item.id)

    if (index === -1) {
      docs.unshift(data.item)
    } else {
      docs[index] = data.item
    }
  }

  textArea.setValue('')
  textArea.resize()
  setMessage()
  state.set('main-documents', docs)
}

/**
 *
 */
async function handleCartsuggestion({ id, title }) {
  const view = document.getElementById('view-select').getSelected().value

  const { data, error } = await addItem({ title, view, isTemp: 0 })

  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }

  const docs = [...state.get('main-documents')]
  const index = docs.findIndex((d) => d.id === id)

  if (index === -1) {
    docs.unshift(data.item)
  } else {
    docs[index] = data.item
  }
  state.set('main-documents', docs)
  state.set('suggestion-carted', true)
}

/**
 *
 */
async function handleDeleteItem({ id, title }) {
  const view = document.getElementById('view-select').getSelected().value

  if (view === 'all') {
    const modal = document.getElementById('modal-delete')
    modal.setHeader(`Delete ${title}`)
    modal.setBody('Permanently remove this item from the app?')
    modal.showModal()
    state.set('permanent-delete', id)
  } else {
    // setMessage(`Deleting ${title}...`)
    document.getElementById(id).classList.add('hidden')
    const { message, error } = await deleteItem(id, view)
    if (error) {
      setMessage(error, { type: 'danger' })
      document.getElementById(id).classList.remove('hidden')
      return
    } else {
      setMessage()
    }

    state.set('permanent-delete', null)
    const items = state.get('main-documents')
    const i = items.findIndex((i) => i.id === id)
    if (view === 'cart' && items[i].temp) {
      items.splice(i, 1)
    } else {
      if (view === 'cart') items[i].carted = 0
      if (view === 'recurring') items[i].recurring = 0
    }
    state.set('main-documents', items)
    return message
  }
}

/**
 *
 */
async function handleModalDeleteConfirm() {
  const id = state.get('permanent-delete')
  let items = state.get('main-documents')
  const title = items.find((i) => i.id === id).title

  setMessage(`Permanently deleting ${title}...`)

  const { message, error } = await deleteItem(id, 'all')
  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }

  document.getElementById('modal-delete').close()
  setMessage()
  items = items.filter((i) => i.id !== id)
  state.set('main-documents', [...items])
  state.set('permanent-delete', null)
  return message
}

/**
 * Send updated order and view to server. Update
 * main-documents only after sort mode is exited by user
 */
async function handleSortItems() {
  state.set('update-local-sort', true)

  const items = [...document.querySelectorAll('#shopping-list .list-item')]
  const ids = items.map((item) => item.id)
  const view = document.getElementById('view-select').getSelected().value

  const sortColumns = {
    cart: 'cart_order',
    recurring: 'recurring_order'
  }

  const column = sortColumns[view]
  if (!column || !ids.length) return

  const { error } = await sortItems(ids, view)
  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }
}

/**
 * Update main-documents now that sort mode was exited by user
 */
async function updateLocalSortOrder() {
  if (!state.get('update-local-sort')) return

  const items = [...document.querySelectorAll('#shopping-list .list-item')]
  const ids = items.map((item) => item.id)
  const view = document.getElementById('view-select').getSelected().value

  const sortColumns = {
    cart: 'cart_order',
    recurring: 'recurring_order'
  }

  const column = sortColumns[view]
  if (!column || !ids.length) return

  // Create a key/value lookup
  const viewOrderMap = new Map(ids.map((id, index) => [id, index]))
  const idInView = (id) => viewOrderMap.has(id)

  const docs = state.get('main-documents').map((doc) => {
    if (idInView(doc.id)) {
      // update only docs in current view
      doc[column] = viewOrderMap.get(doc.id)
    }
    return doc
  })

  state.set('main-documents', docs)
  state.set('update-local-sort', null)
}
