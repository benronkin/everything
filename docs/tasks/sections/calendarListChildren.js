import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createTaskHeader } from './taskHeader.js'

const css = `
.category {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0;
}
`

export function calendarListChildren(docs) {
  injectStyle(css)

  const dict = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    Later: [],
    Unscheduled: []
  }

  for (const doc of docs) {
    const k = doc?.dueInfo?.label || 'Unscheduled'
    dict[k].push(doc)
  }

  for (const k of Object.keys(dict)) {
    if (k == 'Unscheduled') continue
    // sort each category
    dict[k] = dict[k].sort((a, b) => {
      const dateA = a.starts_at ? new Date(a.starts_at) : new Date(0)
      const dateB = b.starts_at ? new Date(b.starts_at) : new Date(0)
      return dateA - dateB
    })
  }

  const children = []

  for (const [cat, docs] of Object.entries(dict)) {
    if (docs.length) {
      children.push(createDiv({ html: cat, className: 'category' }))
      for (const doc of docs) {
        children.push(createTaskHeader(doc, 'calendar'))
      }
    }
  }
  return children
}
