import { state } from '../../assets/js/state.js'
import { createEntryTitle } from '../journal.utils.js'
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
    el.deleteChildren()

    if (!docs || !docs.length) return

    const children = docs.map((doc) => {
      const html = createEntryTitle(doc)
      return createMainDocumentItem({ id: doc.id, html })
    })

    el.addChildren(children)
  })

  setMessage()
}
