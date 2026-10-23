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
  const addEl = document.querySelector('[name="new-item"]')

  state.on('icon-click:recurring', 'shopping', async () => {
    setMessage('Adding recurring items...')
    await cartRecurring()
    // server-side update to shopping list
    // refresh to reflect changes
    window.location.reload()
  })

  state.on('form-submit:shopping-form', 'shopping', () => {
    const value = addEl.value

    const delimiter = value.includes('\n')
      ? '\n'
      : value.includes(',')
        ? ','
        : ''

    const items = delimiter
      ? value
          .split(delimiter)
          .map((i) => i.trim().toLowerCase())
          .filter(Boolean)
      : [value.trim().toLowerCase()]

    let resp

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i]
      resp = handleAddItem(item)
      if (resp.error) {
        setMessage(resp.error, { type: 'warn' })
        return
      }
    }
    if (resp.message) {
      setMessage(resp.message)
    }
    addEl.setValue('')
    addEl.resize()
  })

  state.on('item-click:delete-item', 'shopping', async (item) => {
    await handleDeleteItem(item)
  })

  state.on('button-click:modal-delete-btn', 'task', handleModalDeleteConfirm)

  state.on('list-dragged:shopping-list', 'tasks', handleSortItems)
}

/**
 *
 */
async function handleAddItem(title) {
  title = title.trim().toLowerCase()
  if (!title.length) return

  setMessage(`Adding ${title}...`)

  const view = document.getElementById('view-select').getSelected().value

  const { data } = await addItem(title, view)
  setMessage()
  const items = [...state.get('main-documents')]
  const index = items.findIndex((item) => item.id === data.item.id)

  if (index === -1) {
    items.unshift(data.item)
  } else {
    items[index] = data.item
  }

  state.set('main-documents', items)
}

async function handleDeleteItem({ id, title }) {
  const view = document.getElementById('view-select').getSelected().value

  if (view === 'all') {
    const modal = document.getElementById('modal-delete')
    modal.setHeader(`Delete ${title}`)
    modal.setBody('Permanently remove this item from the app?')
    modal.showModal()
    state.set('permanent-delete', id)
  } else {
    const resp = await deleteItem(id, view)
    state.set('permanent-delete', null)
    const items = state.get('main-documents')
    const item = items.find((i) => i.id === id)
    if (view === 'cart') item.carted = 0
    if (view === 'recurring') item.recurring = 0
    state.set('main-documents', items)
    return resp
  }
}

/**
 *
 */
async function handleModalDeleteConfirm() {
  const id = state.get('permanent-delete')
  state.set('permanent-delete', null)

  let items = state.get('main-documents')
  items = items.filter((i) => i.id !== id)
  state.set('main-documents', [...items])
  document.getElementById('modal-delete').close()

  const resp = await deleteItem(id, 'all')
  return resp
}

/**
 *
 */
async function handleSortItems() {
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
}
