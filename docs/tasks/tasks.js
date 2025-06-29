import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { createTitleDetailsItem } from '../assets/partials/titleDetailsItem.js'
import { setMessage } from '../assets/js/ui.js'
import { getMe } from '../users/users.api.js'
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

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
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

/**
 * Subscribe to state.
 */
function react() {
  state.on('form-submit:tasks-form', 'tasks', handleAddTask)

  state.on('field-change:tasks-list', 'tasks', handleTaskUpdate)

  state.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)

  state.on('list-dragged:tasks-list', 'tasks', handleTaskDragged)
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

async function handleAddTask() {
  const inputEl = document
    .getElementById('tasks-form')
    .querySelector('[name="task"]')

  const title = inputEl.value?.trim()
  if (!title.length) return

  const newChild = createTitleDetailsItem({ id: new Date().getTime(), title })
  document.getElementById('tasks-list').addChild(newChild)
  document.querySelector('input[name="task"]').value = ''

  const { id, error } = await createTask(title)

  if (error) {
    // revert operation
    inputEl.value = title
    newChild.remove()
    setMessage({ message: error, type: 'warn' })
    return
  }
}

async function handleTaskDelete({ id }) {
  const taskToDelete = document.getElementById(id)
  taskToDelete.classList.add('hidden')

  const { error } = await deleteTask(id)
  if (error) {
    taskToDelete.classList.remove('hidden')
    setMessage({ message: error, type: 'warn' })
    return
  }
  document.getElementById('tasks-list').deleteChild(id)
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
