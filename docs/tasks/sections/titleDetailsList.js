import { state } from '../../js/state.js'
import { setMessage } from '../../js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { createTitleDetailsItem } from '../../assets/partials/titleDetailsItem.js'
// import { log } from '../../js/logger.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function titleDetailsList() {
  const el = createList({
    id: 'tasks-list',
    className: 'mt-20',
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
  state.on('main-documents', 'mainDocumentsList', (docs) => {
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
  })

  setMessage()
}
