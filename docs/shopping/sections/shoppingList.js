import { newState } from '../../_assets/js/newState.js'
import { createList } from '../../_partials/list.js'
import { shoppingItem } from './shoppingItem.js'
// import { setMessage } from '../../_assets/js/ui.js'
import { log } from '../../_assets/js/logger.js'

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
  newState.on('shopping-list', 'shoppingList', (items) => {
    el.deleteChildren()
    if (!items.length) {
      return
    }
    const children = items.map((item) => shoppingItem({ item }))
    el.addChildren(children)
  })

  newState.on('item-click', 'list', (id) => {
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
