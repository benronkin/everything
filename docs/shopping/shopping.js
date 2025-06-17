import { state } from '../assets/js/state.js'
import { handleAddItem } from './shopping.handlers.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { setMessage } from '../assets/js/ui.js'
import { log } from '../assets/js/logger.js'
import { handleAddToBothLists } from './shopping.handlers.js'
import {
  fetchCartAndSuggestions,
  upodateShoppingList,
  upodateSuggestionsList,
} from './shopping.api.js'

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

    const resp = await fetchCartAndSuggestions()
    const { shoppingList, shoppingSuggestions } = resp
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
    state.set('default-page', 'shopping')
    window.state = state // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })

    window.location.href = `../home/index.html?message=${error.message}`
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
  state.on('icon-click:suggest-icon', 'shopping', handleToggleSuggestionsUI)

  state.on('form-keyup:shopping-form', 'shopping', handleFormKeyup)

  state.on('form-submit:shopping-form', 'shopping', () => {
    resetSuggestionsUI()
    const inputEl = document.querySelector('[name="new-item')
    const item = inputEl.value.trim().toLowerCase()
    inputEl.value = ''
    const resp = handleAddItem(item)
    if (resp.message) {
      setMessage({ message: resp.message })
    } else if (resp.error) {
      setMessage({ message: resp.error, type: 'warn' })
      inputEl.value = item
    }
  })

  state.on(
    'item-click:shop-suggestion',
    'shopping',
    handleAddSuggestionToShoppingList
  )

  state.on('item-click:delete-item', 'shopping', handleDeleteItem)

  state.on(
    'item-click:delete-suggestion',
    'shopping',
    handleDeleteSuggestionClick
  )

  state.on('button-click:add-to-both-lists-button', 'shopping', ({ e }) => {
    e.preventDefault()
    resetSuggestionsUI()
    const inputEl = document.querySelector('[name="new-item')
    const item = inputEl.value.trim().toLowerCase()
    inputEl.value = ''
    handleAddToBothLists(item)
  })

  state.on('list-dragged:shopping-list', 'tasks', handleItemDragged)
}

function resetSuggestionsUI() {
  const suggestEl = document.querySelector('#suggest-icon')
  suggestEl.classList.remove('primary')
  suggestEl.classList.add('bordered')

  const suggestionsListEl = document.getElementById('suggestions-list')
  suggestionsListEl.classList.add('hidden')
  suggestionsListEl.querySelectorAll('.suggestion-item').forEach((el) => {
    el.classList.remove('hidden')
  })
}

function handleToggleSuggestionsUI() {
  document
    .getElementById('suggestions-list')
    .classList.toggle(
      'hidden',
      !document.getElementById('suggest-icon').classList.contains('primary')
    )
}

function handleFormKeyup({ value }) {
  if (document.getElementById('suggest-icon').classList.contains('primary'))
    return

  if (!value.trim().length) {
    resetSuggestionsUI()
    return
  }

  const slEl = document.getElementById('suggestions-list')
  slEl.classList.remove('hidden')
  slEl.querySelectorAll('.suggestion-item').forEach((item) => {
    const itemText = item.querySelector('span').textContent
    item.classList.toggle('hidden', !itemText.includes(value))
  })
  if (!slEl.querySelectorAll('.suggestion-item:not(.hidden)').length) {
    resetSuggestionsUI()
  }
}

function handleAddSuggestionToShoppingList({ item }) {
  const sItems = state.get('shopping-list')
  sItems.unshift(item)
  state.set('shopping-list', sItems)
  state.set('suggestions-list', [...state.get('suggestions-list')])
  upodateShoppingList(sItems.join(','))
  handleToggleSuggestionsUI()
}

function handleDeleteSuggestionClick({ item }) {
  let sItems = state.get('suggestions-list')
  sItems = sItems.filter((sItem) => sItem !== item)
  state.set('suggestions-list', sItems)
  upodateSuggestionsList(sItems.join(','))
}

function handleDeleteItem({ item }) {
  let sItems = state.get('shopping-list')
  sItems = sItems.filter((sItem) => sItem !== item)
  state.set('shopping-list', sItems)
  upodateShoppingList(sItems.join(','))
  // force reactivity update
  state.set('suggestions-list', [...state.get('suggestions-list')])
}

async function handleItemDragged() {
  const shoppingListEl = document.querySelector('#shopping-list')
  const items = [...shoppingListEl.querySelectorAll('.list-item')]
  const values = items.map((item) => item.querySelector('span').textContent)
  upodateShoppingList(values.join(','))
}
