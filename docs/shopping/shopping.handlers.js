import { state } from '../assets/js/state.js'
import { upodateShoppingList } from './shopping.api.js'
import { log } from '../assets/js/logger.js'

export async function handleAddItem(item) {
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

export function handleAddToBothLists(item) {
  let arr = state.get('shopping-list')
  arr.unshift(item)
  state.set('shopping-list', [...arr])

  arr = state.get('suggestions-list')
  arr.unshift(item)
  state.set('suggestions-list', [...arr])
}
