import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
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
    const all = docs.filter((d) => !d.matchType)
    const exact = docs.filter((d) => d.matchType === 'exact')
    const related = docs.filter((d) => d.matchType === 'related')

    const children = []

    if (all.length) {
      children.push(...all.map(createItem))
    }

    if (exact.length) {
      children.push(
        createHeader({
          html: 'Entry matches',
          type: 'h5',
          className: 'list-header',
        })
      )
      children.push(...exact.map(createItem))
    }

    if (related.length) {
      children.push(
        createHeader({
          html: 'Related matches',
          type: 'h5',
          className: 'list-header',
        })
      )
      children.push(...related.map(createItem))
    }

    el.deleteChildren().addChildren(children)
  })

  setMessage()
}

function createItem(doc) {
  const html = createDiv({
    className: 'flex justify-between w-100',
    html: [
      createSpan({ html: doc.entry }),
      createSpan({ html: doc.submitterName, className: 'c-gray3' }),
    ],
  })
  return createMainDocumentItem({ id: doc.id, html })
}
