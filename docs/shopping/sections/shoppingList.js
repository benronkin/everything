/*
  This custom list controls the the active class of its items and the classes of each item's icons
*/

import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { shoppingItem } from './shoppingItem.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'

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
        child
          .querySelector('.fa-trash')
          .classList.toggle('hidden', !child.classList.contains('active'))
        child
          .querySelector('.fa-lightbulb')
          .classList.toggle('hidden', !child.classList.contains('active'))
      } else {
        child.classList.remove('active')
        child.querySelector('.fa-trash').classList.add('hidden')
        child.querySelector('.fa-lightbulb').classList.add('hidden')
      }
    })
  })

  state.on('icon-click:sort-icon', 'shoppingList', () => {
    if (isDragging()) {
      enableDragging(el)
    } else {
      enableClicking(el)
    }
  })

  state.on('drag-end', 'shoppingList', ({ id }) => {
    state.set('list-dragged:shopping-list', {
      id: 'shopping-list',
      targetId: id,
    })
  })
}

function isDragging() {
  const inDraggingMode = document
    .querySelector('#sort-icon')
    .classList.contains('primary')
  return inDraggingMode
}
