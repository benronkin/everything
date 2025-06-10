import { newState } from '../../_assets/js/newState.js'
import { setMessage } from '../../_assets/js/ui.js'
import { createList } from '../../_partials/list.js'
import { createTitleDetailsItem } from '../../_partials/titleDetailsItem.js'
// import { log } from '../../_assets/js/logger.js'

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
  newState.on('main-documents', 'mainDocumentsList', (docs) => {
    const children = docs.map((doc) => {
      const item = createTitleDetailsItem({
        id: doc.id,
        title: doc.title,
        details: doc.details,
      })
      item.querySelectorAll('.field').forEach((field) =>
        field.addEventListener('change', () =>
          newState.set('field-change:tasks-list', {
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
