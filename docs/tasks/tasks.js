import { newState } from '../_assets/js/newState.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { createTitleDetailsItem } from '../_partials/titleDetailsItem.js'
import { setMessage } from '../_assets/js/ui.js'
import { createTask, deleteTask, fetchTasks, updateTask } from './tasks.api.js'
import { log } from '../_assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()

    react()

    const resp = await fetchTasks()
    const { tasks } = resp
    newState.set('main-documents', tasks)
    newState.set('app-mode', 'main-panel')
    newState.set('default-page', 'tasks')
    window.newState = newState // avail to browser console
  } catch (error) {
    console.trace(error)
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
  newState.on('form-submit:tasks-form', 'tasks', handleTaskCreate)
  newState.on('field-change:tasks-list', 'tasks', handleTaskUpdate)
  newState.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)
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
}

/**
 * Handle the tasks trash click
 */
async function handleTaskDelete({ id }) {
  const { error } = await deleteTask(id)
  if (error) {
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
