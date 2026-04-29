import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createList } from '../../assets/partials/list.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'
import { createDueLabel } from '../tasks.utils.js'
import { createTaskHeader } from './taskHeader.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createList({
    id: 'tasks-list',
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    el.deleteChildren()
    if (!docs.length) {
      return
    }
    const viewMode = localStorage.getItem('task-list-view')
    if (viewMode === 'calendar') {
      el.addChildren(createCalendarList())
    } else {
      el.addChildren(createPriorityList())
    }

    setMessage()
  })

  state.on('icon-click:sort-icon', 'mainDocumentsList', () => {
    if (document.querySelector('#sort-icon').classList.contains('primary')) {
      enableDragging(el)
    } else {
      enableClicking(el)
    }
  })

  state.on('icon-click:calendar-priority', 'toolbar', ({ className }) => {
    el.deleteChildren()
    const docs = state.get('main-documents')
    if (!docs.length) {
      return
    }

    const inCalendarView = className.includes('fa-calendar')
    if (inCalendarView) {
      el.addChildren(createCalendarList())
    } else {
      el.addChildren(createPriorityList())
    }
  })

  state.on('drag-end', 'mainDocumentsList', ({ id }) => {
    state.set('list-dragged:tasks-list', { id: 'tasks-list', targetId: id })
  })
}

// ------------------------------------------
// Helpers
// ------------------------------------------

function createPriorityList() {
  const docs = state.get('main-documents')
  const children = docs.map((doc) => createTaskHeader(doc, 'priority'))
  return children
}

function createCalendarList() {
  const docs = state.get('main-documents')
  const dict = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    Later: [],
    Unscheduled: [],
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
        doc.dueInfo = createDueLabel(doc.dueInfo, 'calendar')
        children.push(createTaskHeader(doc, 'calendar'))
      }
    }
  }
  return children
}
