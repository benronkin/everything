import { state } from '../assets/js/state.js'
import { upodateShoppingList, upodateSuggestionsList } from './shopping.api.js'
import { log } from '../assets/js/logger.js'

export async function handleAddItem(item) {
  if (!item.length) return

  item = item.toLowerCase().trim()

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

export async function handleAddSuggestionToShoppingList({ item }) {
  handleAddItem(item)
  document
    .getElementById('suggestions-list')
    .classList.toggle(
      'hidden',
      !document.getElementById('suggest-icon').classList.contains('primary')
    )
  document.querySelector('[name="new-item').value = ''
}

export async function handleAddToBothLists(item) {
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
