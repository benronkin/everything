import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'

export function mainDocumentsList() {
  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-20',
  })

  react(el)

  return el
}

/**
 * Subscribe to state
 */
function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    // populate children
    const children = docs.map((doc) => {
      const html = doc.title
      return createMainDocumentItem({ id: doc.id, html })
    })
    el.deleteChildren().addChildren(children)
  })

  setMessage()
}
