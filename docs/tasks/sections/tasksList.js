import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'

export function tasksList() {
  const el = createList({
    id: 'tasks-list',
    className: 'mt-20',
    emptyState: `<i class="fa-solid fa-umbrella-beach"></i> <span>Nothing to do today...</span>`,
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'tasksList', (docs) => {
    el.deleteChildren()
    if (!docs.length) {
      return
    }

    const children = docs.map((doc) => {
      const li = createMainDocumentItem({
        id: doc.id,
        html: doc.title,
      })

      return li
    })
    el.addChildren(children)
    setMessage()
  })

  state.on('icon-click:sort-icon', 'tasksList', () => {
    if (document.querySelector('#sort-icon').classList.contains('primary')) {
      enableDragging(el)
    } else {
      enableClicking(el)
    }
  })

  state.on('drag-end', 'tasksList', ({ id }) => {
    state.set('list-dragged:tasks-list', { id: 'tasks-list', targetId: id })
  })
}
