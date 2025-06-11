import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { shoppingItem } from './shoppingItem.js'
// import { setMessage } from '../../assets/js/ui.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function shoppingList() {
  const el = createList({
    id: 'shopping-list',
    emptyState: '<i class="fa-solid fa-comment"></i> Nothing to buy, chef!',
    className: 'outer-wrapper',
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
  state.on('shopping-list', 'shoppingList', (items) => {
    el.deleteChildren()
    if (!items.length) {
      return
    }
    const children = items.map((item) => shoppingItem({ item }))
    el.addChildren(children)
  })

  state.on('item-click', 'list', (id) => {
    el.getChildren().forEach((child) => {
      if (child.id === id) {
        child.classList.toggle('active')
        child.querySelector('.fa-trash').classList.toggle('hidden')
      } else {
        child.classList.remove('active')
        child.querySelector('.fa-trash').classList.add('hidden')
      }
    })
  })
}
