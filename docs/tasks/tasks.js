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
import { createTask, deleteTask, fetchTasks, updateTask } from './tasks.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    const resp = await fetchTasks()
    const { tasks } = resp
    state.set('main-documents', tasks)
    state.set('app-mode', 'main-panel')
    state.set('default-page', 'tasks')
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
  state.on('form-submit:tasks-form', 'tasks', handleTaskCreate)
  state.on('field-change:tasks-list', 'tasks', handleTaskUpdate)
  state.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)
}

/**
 * Handle task textarea loses focus
 */
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

/**
 *
 */
async function handleTaskCreate() {
  const title = document
    .getElementById('tasks-form')
    .querySelector('[name="task"]')
    .value?.trim()

  if (!title.length) {
    return
  }

  const { id, error } = await createTask(title)

  if (error) {
    setMessage({ message: error, type: 'warn' })
    return
  }

  document
    .getElementById('tasks-list')
    .addChild(createTitleDetailsItem({ id, title }))

  document.querySelector('input[name="task"]').value = ''
}

/**
 * Handle the tasks trash click
 */
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

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  if (sortSwitch.value) {
    tasksListEl.enableDragging()
  } else {
    tasksListEl.enableClicking()
  }
}
