import { state } from '../../assets/js/state.js'
import { createEntryTitle } from '../journal.utils.js'
import { setMessage } from '../../assets/js/ui.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'

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
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    // populate children
    const children = docs.map((doc) => {
      const html = createEntryTitle(doc)
      return createMainDocumentItem({ id: doc.id, html })
    })
    el.deleteChildren().addChildren(children)

    // select previously active child
    // const priorDoc = state.get('active-doc')
    // if (priorDoc) {
    //   const child = el.getChildById(priorDoc.id)
    //   child && (child.selected = true)
    // }
  })

  setMessage()
}
