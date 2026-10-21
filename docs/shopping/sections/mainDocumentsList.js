/*
  This custom list controls the the active class of its items and the classes of each item's icons
*/

import { state } from '../../assets/js/state.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { mainDocumentItem } from './mainDocumentItem.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'

export function mainDocumentsList() {
  const el = createMainDocumentsList({
    id: 'shopping-list',
    className: 'outer-wrapper'
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'shoppingList', (docs) => {
    el.deleteChildren()
    if (!docs.length) {
      return
    }

    docs = filterItemsByView(docs)

    const children = docs.map(mainDocumentItem)

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
          .querySelector('.fa-circle-info')
          .classList.toggle('hidden', !child.classList.contains('active'))
      } else {
        child.classList.remove('active')
        child.querySelector('.fa-trash').classList.add('hidden')
        child.querySelector('.fa-circle-info').classList.add('hidden')
      }
    })
  })

  state.on('icon-click:sort', 'shoppingList', () => {
    if (document.querySelector('#sort').classList.contains('primary')) {
      enableDragging(el)
    } else {
      enableClicking(el)
    }
  })

  state.on('drag-end', 'shoppingList', ({ id }) => {
    state.set('list-dragged:shopping-list', {
      id: 'shopping-list',
      targetId: id
    })
  })

  state.on('select-click:view-select', 'shoppingList', () => {
    // force refresh for filtered view
    state.set('main-documents', [...state.get('main-documents')])
  })
}

/**
 *
 */
function filterItemsByView(items) {
  const viewSelect = document.getElementById('view-select')
  const view = viewSelect.getSelected().value

  switch (view) {
    case 'cart':
      items = items.filter((item) => item.carted)
      break
    case 'recurring':
      items = items.filter((item) => item.recurring)
      break
  }

  return items
}
