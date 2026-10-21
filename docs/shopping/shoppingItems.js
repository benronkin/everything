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
import { addItem, deleteItem, getItems } from './shopping.api.js'
import { log } from '../assets/js/logger.js'

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
  const cartEl = document.getElementById('shopping-list')

  state.on('icon-click:suggest', 'shopping', () => {
    state.set('suggestions-list', [...state.get('suggestions-list')])
  })

  state.on('icon-click:recurring', 'shopping', async () => {
    setMessage('Adding recurring items...')
    await addRecurringItems()
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

  state.on('item-click:shop-suggestion', 'shopping', ({ item }) => {
    handleAddItem(item)
    addEl.value = ''
    document.getElementById('suggestions-list').classList.add('hidden')
  })

  state.on('item-click:delete-item', 'shopping', async (item) => {
    const resp = await handleDeleteItem(item)
  })

  state.on('button-click:modal-delete-btn', 'task', handleModalDeleteConfirm)

  state.on('item-click:delete-suggestion', 'shopping', ({ item }) => {
    let sItems = state.get('suggestions-list')
    sItems = sItems.filter((sItem) => sItem !== item)
    state.set('suggestions-list', sItems)
    updateSuggestionsList(sItems.join(','))
  })

  state.on('button-click:add-to-both-lists-button', 'shopping', ({ e }) => {
    e.preventDefault()
    const inputEl = document.querySelector('[name="new-item')
    const item = inputEl.value.trim().toLowerCase()
    inputEl.value = ''
    handleAddToBothLists(item)
  })

  state.on('list-dragged:shopping-list', 'tasks', async () => {
    const items = [...cartEl.querySelectorAll('.list-item')]
    const values = items.map((item) => item.querySelector('span').textContent)
    updateShoppingList(values.join(','))
  })
}

/**
 *
 */
async function handleAddItem(title) {
  title = title.trim().toLowerCase()
  if (!title.length) return

  setMessage(`Adding ${title}...`)

  const viewSelect = document.getElementById('view-select')
  const view = viewSelect.getSelected().value

  const { data } = await addItem(title, view)
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
  const viewSelect = document.getElementById('view-select')
  const view = viewSelect.getSelected().value

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

export async function handleAddToBothLists(item) {
  if (!item || !item.trim().length) {
    log('a visible addToBothLists was clicked even though input was empty')
    return
  }
  let arr = state.get('main-documents')
  arr.unshift(item)
  state.set('main-documents', [...arr])

  addItem(item)

  arr = state.get('suggestions-list')
  arr.unshift(item)
  arr.sort()
  state.set('suggestions-list', [...arr])

  const resp = await updateSuggestionsList(arr.join(','))

  if (resp?.error) {
    // revert operation
    arr = arr.filter((i) => i !== item)
    state.set('suggestions-list', [...arr])
    return { error: resp.error }
  }
}
