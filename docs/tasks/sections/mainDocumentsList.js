import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'
import { createTaskHeader } from './taskHeader.js'
import { calendarListChildren } from './calendarListChildren.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createList({
    id: 'tasks-list'
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
      el.addChildren(calendarListChildren(docs))
    } else {
      el.addChildren(createPriorityList())
    }
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
      el.addChildren(calendarListChildren(docs))
    } else {
      el.addChildren(createPriorityList())
    }
  })

  state.on('drag-end', 'mainDocumentsList', ({ id }) => {
    state.set('list-dragged:tasks-list', { id: 'tasks-list', targetId: id })
  })
}

function createPriorityList() {
  const docs = state.get('main-documents')
  const children = docs.map((doc) => createTaskHeader(doc, 'priority'))
  return children
}
