import { state } from '../assets/js/state.js'
import { upodateShoppingList } from './shopping.api.js'

export async function handleAddItem(item) {
  if (!item.length) return

  const sItems = state.get('shopping-list')
  if (sItems.includes(item)) {
    return { message: `${item} already on the list` }
  }

  sItems.unshift(item)
  state.set('shopping-list', sItems)

  const resp = await upodateShoppingList(sItems.join(','))

  const { error } = resp
  if (error) {
    // revert operation
    sItems.shift()
    state.set('shopping-list', sItems)
    return { error }
  }
  return
}
