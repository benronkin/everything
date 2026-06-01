import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { formatDateParts } from '../../assets/js/format.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createSpan } from '../../assets/partials/span.js'
import { ratingOptions } from '../../assets/partials/ratingOptions.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
.md-item .title {
 flex: 1;
  min-width: 0; /* Crucial: tells the span it can shrink to 0px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* … when it runs out */
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-20'
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

  const urlParams = new URLSearchParams(window.location.search)
  const around = urlParams.get('around')

  const children = docs.map((doc) => {
    doc.rating = doc.rating || ''
    const option = ratingOptions.find((o) => o.value === doc.rating)
    const ratingLabel = option.label || '🫥'

    const obj = formatDateParts(doc.visit_date)
    const visited = `${obj.month}/${obj.day}/${obj.shortYear}`
    const html = [
      createSpan({ html: `${doc.location} (${doc.city})` }),
      createSpan({
        html: `${visited} ${ratingLabel}`,
        className: 'text-right'
      })
    ]

    let url = `./journal.html?id=${doc.id}`

    if (around) {
      // keep around-that-time context when
      // user clicks the browser's BACK button
      url += `&around=${around}`
    }

    return createMainDocumentLink({
      id: doc.id,
      html,
      url
    })
  })
  el.addChildren(children)
}
