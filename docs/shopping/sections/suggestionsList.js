import { newState } from '../../_assets/js/newState.js'
import { setMessage } from '../../_assets/js/ui.js'
import { createList } from '../../_partials/list.js'
import { suggestionItem } from './suggestionItem.js'
import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function suggestionsList() {
  const el = createList({
    id: 'suggestions-list',
    className: 'outer-wrapper-teal hidden',
  })

  react(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Subscribe to state
 */
function react(el) {
  newState.on('suggestions-list', 'suggestionsList', (suggestionArr) => {
    el.deleteChildren()
    if (!suggestionArr.length) {
      return
    }
    const shoppingItems = newState.get('shopping-list')
    suggestionArr = suggestionArr.filter(
      (arrItem) => !shoppingItems.includes(arrItem)
    )
    const children = suggestionArr.map((arrItem) =>
      suggestionItem({ item: arrItem })
    )
    el.addChildren(children)
  })
}
