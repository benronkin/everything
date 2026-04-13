import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createList } from '../../assets/partials/list.js'
import { enableDragging, enableClicking } from '../../assets/js/drag.js'
import { createTaskHelper } from '../tasks.utils.js'

export function titleDetailsList() {
  const el = createList({
    id: 'tasks-list',

    emptyState: `<i class="fa-solid fa-umbrella-beach"></i> <span>Nothing to do today...</span>`,
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'titleDetailsList', (docs) => {
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

  state.on('icon-click:sort-icon', 'titleDetailsList', () => {
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

  state.on('drag-end', 'titleDetailsList', ({ id }) => {
    state.set('list-dragged:tasks-list', { id: 'tasks-list', targetId: id })
  })
}

// ------------------------------------------
// Helpers
// ------------------------------------------

function createPriorityList() {
  const docs = state.get('main-documents')
  const children = docs.map((doc) => createTaskHelper(doc))
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

  const children = []

  for (const [cat, docs] of Object.entries(dict)) {
    if (docs.length) {
      children.push(createDiv({ html: cat, className: 'category' }))
      for (const doc of docs) {
        children.push(createTaskHelper(doc, 'calendar'))
      }
    }
  }
  return children
}
