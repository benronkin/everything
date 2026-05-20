import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { createSpan } from '../../assets/partials/span.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { formatDateParts } from '../../assets/js/format.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function projectJournalList(doc) {
  injectStyle(css)

  const el = createList({
    id: 'journal-list'
  })

  build(el, doc)

  return el
}

function build(el, doc) {
  el.deleteChildren()

  const docs = doc.items.filter((i) => i.type === 'journal')

  if (!docs.length) {
    el.appendChild(
      createSpan({
        className: 'c-gray3',
        html: `No journal entries for this project`
      })
    )
    return
  }

  const children = docs.map(({ id, title, starts_at, className }) => {
    const obj = formatDateParts(starts_at)
    const startDate = `${obj.month}/${obj.day}/${obj.shortYear}`

    const html = [
      createSpan({ html: title }),
      createSpan({ html: `Due ${startDate}`, className: 'c-gray3' })
    ]
    return createMainDocumentLink({
      id,
      className: `md-item list-item ${className}`.trim(),
      html,
      url: `${state.getBaseUrl()}journal/index.html?id=${id}`
    })
  })

  el.addChildren(children)
}
