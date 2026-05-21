import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createList } from '../../assets/partials/list.js'
import { createSpan } from '../../assets/partials/span.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { formatDateParts } from '../../assets/js/format.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createList({
    id: 'projects-list'
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    el.deleteChildren()
    if (!docs.length) {
      el.appendChild(
        createSpan({
          className: 'c-gray3',
          html: [
            createIcon({ classes: { primary: 'fa-umbrella-beach' } }),
            createSpan({ html: 'No projects found...', className: 'ml-10' })
          ]
        })
      )
      return
    }

    const children = docs.map(({ id, title, starts_at, className }) => {
      const obj = formatDateParts(starts_at)
      const startDate = `${obj.month}/${obj.day}/${obj.shortYear}`

      const html = [
        createSpan({ html: title }),
        createSpan({ html: `(${startDate})`, className: 'c-gray3' })
      ]
      return createMainDocumentLink({
        id,
        className: `md-item list-item ${className}`.trim(),
        html,
        url: `${state.getBaseUrl()}projects/project.html?id=${id}`
      })
    })

    el.addChildren(children)
  })
}
