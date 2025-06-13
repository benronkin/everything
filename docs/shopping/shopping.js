import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { setMessage } from '../assets/js/ui.js'
import { log } from '../assets/js/logger.js'
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

// ------------------------
// Helpers
// ------------------------

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
    const { message, error } = handleAddItem(item)
    if (message) {
      setMessage({ message })
      return
    }
    if (error) {
      setMessage({ message: error, type: 'warn' })
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

// ------------------------
// Handlers
// ------------------------

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

async function handleAddItem(item) {
  if (!item.length) return

  const sItems = state.get('shopping-list')
  if (sItems.includes(item)) {
    return { message: `${item} alerady on the list` }
  }

  sItems.unshift(item)
  state.set('shopping-list', sItems)

  const { error } = await upodateShoppingList(sItems.join(','))
  if (error) {
    // revert operation
    sItems.shift()
    state.set('shopping-list', sItems)
    return { error }
  }
}

function handleAddSuggestionToShoppingList({ item }) {
  const sItems = state.get('shopping-list')
  sItems.unshift(item)
  state.set('shopping-list', sItems)
  state.set('suggestions-list', [...state.get('suggestions-list')])
  upodateShoppingList(sItems.join(','))
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
