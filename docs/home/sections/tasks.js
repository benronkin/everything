import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createButton } from '../../assets/partials/button.js'
import { createHeader } from '../../assets/partials/header.js'
import { titleDetailsList } from '../../tasks/sections/titleDetailsList.js'
import { createTitleDetailsItem } from '../../assets/partials/titleDetailsItem.js'
import { setMessage } from '../../assets/js/ui.js'
import { deleteTask, updateTask } from '../../tasks/tasks.api.js'

import { state } from '../../assets/js/state.js'

const css = `
.tasks-wrapper {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray2);
  border-radius: 0;
}
`

export function tasks() {
  injectStyle(css)

  const el = createDiv({ className: 'tasks-wrapper' })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainPanel', (tasks) => {
    el.innerHTML = ''
    el.appendChild(tasksHeader(tasks.length))
    el.appendChild(tasksBody(tasks))
  })

  state.on('field-changed', 'tasks', handleTaskUpdate)

  state.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)

  state.on(
    'button-click:tasks-header-btn',
    'tasks',
    () => (window.location.href = '../tasks/index.html')
  )
}

function tasksHeader(hasTasks) {
  const div = createDiv({ className: 'flex align-center', id: 'tasks-header' })
  div.appendChild(createHeader({ type: 'h4', html: 'TASKS' }))
  div.appendChild(
    createButton({
      className: 'primary',
      id: 'tasks-header-btn',
      html: hasTasks
        ? `<i class="fa-solid fa-list-check"></i> VIEW ALL`
        : `<i class="fa-solid fa-plus"></i> ADD`,
    })
  )
  return div
}

/**
 * titleDetailsList populates all tasks from state,
 * but here we delete them and load only the first two
 */
function tasksBody(tasks) {
  const list = titleDetailsList()
  const children = tasks.map((doc) =>
    createTitleDetailsItem({
      id: doc.id,
      title: doc.title,
      details: doc.details,
    })
  )
  list.deleteChildren().addChildren(children)
  return list
}

async function handleTaskUpdate(el) {
  try {
    const section = el.name
    const value = el.value
    const parent = el.closest('.td-item')
    const id = parent.id

    const { error } = await updateTask({
      id,
      section,
      value,
    })
    if (error) {
      throw new Error(error)
    }
    setMessage({ message: 'Saved', type: 'quiet' })
  } catch (err) {
    console.log(err)
  }
}

async function handleTaskDelete({ id }) {
  // 1 ▸ optimistic local update
  const tasks = state.get('main-documents')
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return // not found

  const deleted = tasks.splice(idx, 1)[0] // remove 1 item
  state.set('main-documents', [...tasks]) // triggers list re-render

  // 2 ▸ server delete
  const { error } = await deleteTask(id)

  // 3 ▸ rollback if server failed
  if (error) {
    tasks.splice(idx, 0, deleted) // restore
    state.set('main-documents', [...tasks])
    setMessage({ message: error, type: 'warn' })
  }
}
