import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { setMessage } from '../assets/js/ui.js'
import { getMe } from '../users/users.api.js'
import {
  fetchCartAndSuggestions,
  upodateShoppingList,
  upodateSuggestionsList,
} from './shopping.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  build()
  react()

  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    const [{ shoppingList, shoppingSuggestions }, { user }] = await Promise.all(
      [fetchCartAndSuggestions(), getMe()]
    )

    state.set(
      'shopping-list',
      shoppingList
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    )
    state.set(
      'suggestions-list',
      shoppingSuggestions
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    )
    state.set('app-mode', 'main-panel')
    state.set('user', user)
    state.set('default-page', 'shopping')
    window.state = state // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })
  }
})

function build() {
  document.head.title = 'Shopping | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

function react() {
  const addInput = document.querySelector('[name="new-item"]')
  const cartEl = document.getElementById('shopping-list')

  state.on('form-keyup:shopping-form', 'suggestionsList', () =>
    state.set('suggestions-list', [...state.get('suggestions-list')])
  )

  state.on('icon-click:suggest-icon', 'shopping', () => {
    state.set('suggestions-list', [...state.get('suggestions-list')])
  })

  state.on('form-submit:shopping-form', 'shopping', () => {
    const item = addInput.value
    addInput.value = ''

    const resp = addShoppingItem(item)

    if (resp.message) {
      setMessage({ message: resp.message })
    } else if (resp.error) {
      setMessage({ message: resp.error, type: 'warn' })
      addInput.value = item
    }
  })

  state.on('item-click:shop-suggestion', 'shopping', ({ item }) => {
    addShoppingItem(item)
    addInput.value = ''
  })

  state.on('item-click:delete-item', 'shopping', ({ item }) => {
    let sItems = state.get('shopping-list')
    sItems = sItems.filter((sItem) => sItem !== item)
    state.set('shopping-list', sItems)
    upodateShoppingList(sItems.join(','))
  })

  state.on('item-click:delete-suggestion', 'shopping', ({ item }) => {
    let sItems = state.get('suggestions-list')
    sItems = sItems.filter((sItem) => sItem !== item)
    state.set('suggestions-list', sItems)
    upodateSuggestionsList(sItems.join(','))
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
    upodateShoppingList(values.join(','))
  })
}

async function addShoppingItem(item) {
  item = item.trim().toLowerCase()
  if (!item.length) return

  const sItems = state.get('shopping-list')
  if (sItems.includes(item)) {
    return { message: `${item} already on the list` }
  }

  sItems.unshift(item)
  state.set('shopping-list', sItems)

  const resp = await upodateShoppingList(sItems.join(','))

  if (resp?.error) {
    // revert operation
    sItems.shift()
    state.set('shopping-list', sItems)
    return { error: resp.error }
  }
  return
}

async function handleAddToBothLists(item) {
  if (!item || !item.trim().length) {
    log('a visible addToBothLists was clicked even though input was empty')
    return
  }
  let arr = state.get('shopping-list')
  arr.unshift(item)
  state.set('shopping-list', [...arr])

  arr = state.get('suggestions-list')
  arr.unshift(item)
  arr.sort()
  state.set('suggestions-list', [...arr])

  const resp = await upodateSuggestionsList(arr.join(','))

  if (resp?.error) {
    // revert operation
    arr = arr.filter((i) => i !== item)
    state.set('suggestions-list', [...arr])
    return { error: resp.error }
  }
}
