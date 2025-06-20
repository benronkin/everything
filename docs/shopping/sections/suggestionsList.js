import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { suggestionItem } from './suggestionItem.js'
import { log } from '../../assets/js/logger.js'

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

function react(el) {
  state.on('suggestions-list', 'suggestionsList', (suggestionArr) => {
    el.deleteChildren()
    if (!suggestionArr.length) {
      return
    }
    const shoppingItems = state.get('shopping-list')
    suggestionArr = suggestionArr.filter(
      (arrItem) => !shoppingItems.includes(arrItem)
    )
    const children = suggestionArr.map((arrItem) =>
      suggestionItem({ item: arrItem })
    )
    el.addChildren(children)
  })
}
