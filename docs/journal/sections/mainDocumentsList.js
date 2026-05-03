import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { formatDateParts } from '../../assets/js/format.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createSpan } from '../../assets/partials/span.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
.md-item .title {
  flex: 1 1 auto;           /* take all leftover width */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* … when it runs out */
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-20',
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    addChildren(el, docs)
  })
}

/**
 *
 */
function addChildren(el, docs) {
  el.deleteChildren()

  if (!docs || !docs.length) return

  const children = docs.map((doc) => {
    const obj = formatDateParts(doc.visit_date)
    const visited = `${obj.month}/${obj.day}/${obj.year}`
    const html = [
      createSpan({ html: `${doc.location} (${doc.city})` }),
      createSpan({ html: visited }),
    ]

    return createMainDocumentLink({
      id: doc.id,
      html,
      url: `./journal.html?id=${doc.id}`,
    })
  })
  el.addChildren(children)
}
