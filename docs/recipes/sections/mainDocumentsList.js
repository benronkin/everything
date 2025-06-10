import { newState } from '../../_assets/js/newState.js'
import { setMessage } from '../../_assets/js/ui.js'
import { createMainDocumentsList } from '../../_partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../_partials/mainDocumentItem.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainDocumentsList() {
  const el = createMainDocumentsList({
    id: 'left-panel-list',
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
    // populate children
    const children = docs.map((doc) => {
      const html = doc.title
      return createMainDocumentItem({ id: doc.id, html })
    })
    el.deleteChildren().addChildren(children)

    // select previously active child
    // const priorDoc = newState.get('active-doc')
    // if (priorDoc) {
    //   const child = el.getChildById(priorDoc.id)
    //   child && (child.selected = true)
    // }
  })

  setMessage()
}
