import { newState } from '../_assets/js/newState.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { setMessage } from '../_assets/js/ui.js'
import {
  fetchCartAndSuggestions,
  upodateShoppingList,
  upodateSuggestionsList,
} from './shopping.api.js'
import { log } from '../_assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()

    react()

    const resp = await fetchCartAndSuggestions()
    const { shoppingList, shoppingSuggestions } = resp
    newState.set(
      'shopping-list',
      shoppingList
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    )
    newState.set(
      'suggestions-list',
      shoppingSuggestions
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    )
    newState.set('app-mode', 'main-panel')
    newState.set('default-page', 'shopping')
    window.newState = newState // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })
  }
})

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
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

/**
 * Subscribe to state.
 */
function react() {
  /* show suggestions list when icon is clicked */
  newState.on('icon-click:suggest-icon', 'shopping', () => {
    resetSuggestionsList()
    document
      .getElementById('suggestions-list')
      .classList.toggle(
        'hidden',
        !document.getElementById('suggest-icon').classList.contains('primary')
      )
  })

  /* show auto-complete when user types */
  newState.on('form-keyup:shopping-form', 'shopping', ({ value }) => {
    if (document.getElementById('suggest-icon').classList.contains('primary'))
      return

    if (!value.trim().length) {
      resetSuggestionsList()
      return
    }

    const suggestionsListEl = document.getElementById('suggestions-list')
    suggestionsListEl.classList.remove('hidden')
    suggestionsListEl.querySelectorAll('.suggestion-item').forEach((item) => {
      const itemText = item.querySelector('span').textContent
      item.classList.toggle('hidden', !itemText.includes(value))
    })
  })

  /* augment shopping list when user submits */
  newState.on('form-submit:shopping-form', 'shopping', () => {
    resetSuggestionsList()
    const item = document.querySelector('[name="new-item').value.trim()
    if (!item.length) return
    const sItems = newState.get('shopping-list')
    sItems.unshift(item)
    newState.set('shopping-list', sItems)

    // await not needed
    upodateShoppingList(sItems.join(','))
  })

  /* augment shopping list when user adds suggestions */
  newState.on('item-click:shop-suggestion', 'shopping', ({ item }) => {
    const sItems = newState.get('shopping-list')
    sItems.unshift(item)
    newState.set('shopping-list', sItems)
    // force re-render of suggestions
    newState.set('suggestions-list', [...newState.get('suggestions-list')])

    // await not needed
    upodateShoppingList(sItems.join(','))
  })

  /* update suggestions list on delete */
  newState.on('item-click:delete-suggestion', 'shopping', ({ item }) => {
    let sItems = newState.get('suggestions-list')
    sItems = sItems.filter((sItem) => sItem !== item)
    newState.set('suggestions-list', sItems)

    // await not needed
    upodateSuggestionsList(sItems.join(','))
  })

  newState.on('item-click:delete-item', 'shopping', ({ item }) => {
    let sItems = newState.get('shopping-list')
    sItems = sItems.filter((sItem) => sItem !== item)
    newState.set('shopping-list', sItems)

    // await not needed
    upodateShoppingList(sItems.join(','))
  })
}

/**
 *
 */
function resetSuggestionsList() {
  const suggestionsListEl = document.getElementById('suggestions-list')
  suggestionsListEl.classList.add('hidden')
  suggestionsListEl.querySelectorAll('.suggestion-item').forEach((el) => {
    el.classList.remove('hidden')
  })
}
