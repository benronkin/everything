import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
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

    const dict = {
      Active: [],
      Archive: []
    }

    const today = new Date()

    for (const doc of docs) {
      if (!doc.ends_at || new Date(doc.ends_at) > today) {
        dict.Active.push(doc)
      } else {
        dict.Archive.push(doc)
      }
    }

    if (dict.Archive.length > 1) {
      dict.Archive.sort((a, b) => {
        const dateA = a.starts_at ? new Date(a.starts_at) : new Date(0)
        const dateB = b.starts_at ? new Date(b.starts_at) : new Date(0)
        return dateB - dateA
      })
    }

    const children = []

    for (const [cat, docs] of Object.entries(dict)) {
      if (docs.length) {
        children.push(createDiv({ html: cat, className: 'category' }))
        for (const { id, title, starts_at, className } of docs) {
          const obj = formatDateParts(starts_at)
          const startDate = `${obj.month}/${obj.day}/${obj.shortYear}`

          const html = [
            createSpan({ html: title }),
            createSpan({
              html: `(${startDate})`,
              className: 'c-gray3 text-right'
            })
          ]
          children.push(
            createMainDocumentLink({
              id,
              className: `md-item list-item ${className}`.trim(),
              html,
              url: `${state.getBaseUrl()}projects/project.html?id=${id}`
            })
          )
        }
      }
    }

    el.addChildren(children)
  })
}
