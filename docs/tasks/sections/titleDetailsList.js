import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { createTitleDetailsItem } from '../../assets/partials/titleDetailsItem.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'
import { log } from '../../assets/js/logger.js'

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
    const children = docs.map((doc) => {
      const item = createTitleDetailsItem({
        id: doc.id,
        title: doc.title,
        details: doc.details,
      })
      item.querySelectorAll('.field').forEach((field) =>
        field.addEventListener('change', () =>
          state.set('field-change:tasks-list', {
            id: doc.id,
            section: field.name,
            value: field.value,
          })
        )
      )
      return item
    })
    el.deleteChildren().addChildren(children)
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
