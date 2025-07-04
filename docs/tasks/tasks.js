import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { createTitleDetailsItem } from '../assets/partials/titleDetailsItem.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createTask,
  deleteTask,
  fetchTasks,
  update,
  updateTask,
} from './tasks.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  build()
  react()

  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    const [{ user }, { tasks }] = await Promise.all([getMe(), fetchTasks()])

    state.set('main-documents', tasks)
    state.set('app-mode', 'main-panel')
    state.set('user', user)
    state.set('default-page', 'tasks')
    setMessage()
    window.state = state // avail to browser console
  } catch (error) {
    console.trace(error)
    window.location.href = `../home/index.html?message=${error.message}`
    setMessage({ message: error.message, type: 'danger' })
  }
})

function build() {
  document.head.title = 'Tasks | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:tasks-form', 'tasks', handleAddTask)

  state.on('field-change:tasks-list', 'tasks', handleTaskUpdate)

  state.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)

  state.on('list-dragged:tasks-list', 'tasks', handleTaskDragged)
}

async function handleAddTask() {
  const inputEl = document
    .getElementById('tasks-form')
    .querySelector('[name="task"]')

  const title = inputEl.value?.trim()
  if (!title.length) return

  const id = `ev${crypto.randomUUID()}`
  const newChild = createTitleDetailsItem({ id, title })

  newChild.querySelectorAll('.field').forEach((field) =>
    field.addEventListener('change', () =>
      state.set('field-change:tasks-list', {
        id,
        section: field.name,
        value: field.value,
      })
    )
  )
  document.getElementById('tasks-list').addChild(newChild, 'bottom')
  document.querySelector('input[name="task"]').value = ''

  const { error } = await createTask(title, id)

  if (error) {
    // revert operation
    inputEl.value = title
    newChild.remove()
    setMessage({ message: error, type: 'warn' })
    return
  }
}

async function handleTaskUpdate({ id, section, value }) {
  try {
    const { error } = await updateTask({ id, section, value })
    if (error) {
      throw new Error(error)
    }
  } catch (err) {
    log(err)
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

async function handleTaskDragged() {
  const tasksListEl = document.querySelector('#tasks-list')
  const tdItems = [...tasksListEl.querySelectorAll('.td-item')]
  const ids = tdItems.map((tdItem, i) => ({ id: tdItem.id, sort_order: i }))
  const { error } = await update(ids)
  if (error) {
    setMessage({ message: error })
    return
  }
}
