import { state } from '../../../docs/assets/js/state.js'
import { setMessage } from '../../../docs/assets/js/ui.js'
import { createList } from '../../../docs/assets/partials/list.js'
import { createTask } from './task.js'
import { enableDragging, enableClicking } from '../../../docs/assets/js/drag.js'

export function titleDetailsList() {
  const el = createList({
    id: 'tasks-list',
    className: 'mt-20',
    emptyState: `<i class="fa-solid fa-umbrella-beach"></i> <span>Nothing to do today...</span>`,
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'titleDetailsList', (docs) => {
    el.deleteChildren()
    if (!docs.length) {
      return
    }

    const children = docs.map((doc) =>
      createTask({
        id: doc.id,
        title: doc.title,
        details: doc.details,
      })
    )
    el.addChildren(children)
    setMessage()
  })

  state.on('icon-click:sort-icon', 'titleDetailsList', () => {
    if (document.querySelector('#sort-icon').classList.contains('primary')) {
      enableDragging(el)
    } else {
      enableClicking(el)
    }
  })

  state.on('drag-end', 'titleDetailsList', ({ id }) => {
    state.set('list-dragged:tasks-list', { id: 'tasks-list', targetId: id })
  })
}
