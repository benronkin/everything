import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { createSpan } from '../../assets/partials/span.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function projectNotesList(doc) {
  injectStyle(css)

  const el = createList({
    id: 'notes-list'
  })

  build(el, doc)

  return el
}

function build(el, doc) {
  el.deleteChildren()

  const docs = doc.items.filter((i) => i.type === 'note')

  if (!docs.length) {
    el.appendChild(
      createSpan({
        className: 'c-gray3',
        html: `No notes for this project`
      })
    )
    return
  }

  const children = docs.map(({ id, title, className }) => {
    const html = [createSpan({ html: title })]
    return createMainDocumentLink({
      id,
      className: `md-item list-item ${className}`.trim(),
      html,
      url: `${state.getBaseUrl()}notes/note.html?id=${id}`
    })
  })

  el.addChildren(children)
}
