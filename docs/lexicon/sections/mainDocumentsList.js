import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpan } from '../../assets/partials/span.js'
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

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    // populate children
    const children = docs.map((doc) => {
      const html = createItemTitle(doc)
      return createMainDocumentItem({ id: doc.id, html })
    })
    el.deleteChildren().addChildren(children)
  })

  setMessage()
}

function createItemTitle(doc) {
  const div = createDiv({
    className: 'flex justify-between w-100',
    html: [
      createSpan({ html: doc.entry }),
      createSpan({ html: doc.submitterName, className: 'c-gray3' }),
    ],
  })
  return div
}
