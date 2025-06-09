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
import { createTask, deleteTask, fetchTasks, searchTasks } from './tasks.api.js'
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
    window.location.href = `../home/index.html?error=${error.message}`
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
 *
 */
function react() {}

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

/**
 * Handle key up
 */
function handleTaskInputKeyUp(e) {
  const tasksFormEl = e.target.closest('.form-horizontal')
  const value = tasksFormEl.value.trim()
  if (value.length) {
    tasksFormEl.disabled = false
  } else {
    tasksFormEl.disabled = true
  }
}

/**
 * When the user focuses on the task form
 */
function handleTaskFormFocus() {
  tasksListEl.reset()
}

/**
 * Handle click/unclick of tasks item
 */
function handleTasksSelectionChange(el) {
  if (el.selected) {
    getEl('tasks-form').value = ''
  }
}

/**
 * handles drag and CRUD
 */
async function handleTasksListChange(e) {
  const payload = {}
  let endpoint

  if (!e.detail?.action) {
    console.warn('No task action specified')
    return { status: 401, message: `No task action specified"` }
  }

  // create, delete, and drag require
  // resorting on the server
  const _setTasks = () => {
    const tasks = tasksListEl.getData()
    payload.tasks = tasks.map((t) => t.targetId)
  }

  switch (e.detail.action) {
    case 'create':
      endpoint = 'create'
      payload.id = e.detail.targetId
      payload.title = e.detail.title
      _setTasks()
      break
    case 'delete':
      endpoint = 'delete'
      payload.id = e.detail.targetId
      _setTasks()
      break
    case 'drag':
      endpoint = 'update'
      _setTasks()
      break
    case 'update-task':
      endpoint = 'update-task'
      payload.id = e.detail.targetId
      if (e.detail.title) {
        payload.title = e.detail.title
      }
      if (e.detail.details) {
        payload.details = e.detail.details
      }
      break
    default:
      return {
        status: 401,
        message: `Unknown task action: "${e.detail.action}"`,
      }
  }

  const { status, message } = await postWebAppJson(
    `${state.getWebAppUrl()}/tasks/${endpoint}`,
    payload
  )

  console.log('status', status)
  console.log('message', message)
}

/**
 *
 */
function handleTaskFormSubmit(e, pos) {
  e.preventDefault()

  const title = getEl('tasks-form').value.trim()

  if (!title.length) {
    return
  }

  const payload = {
    title,
  }

  const listItem = createTaskItem(payload, pos)
  tasksListEl.addChild(listItem)
  getEl('tasks-form').reset()
  listItem.dispatch('click')
}

/**
 * Handle the tasks trash click
 */
function handleTaskTrashClick(e) {
  const el = e.target.closest('.td-item')
  const id = el.dataset.id
  tasksListEl.deleteChild(id)
}

/**
 * Add tasks item to list
 */
function createTaskItem({ id, title, details, selected, expanded }) {
  const taskEl = createTitleDetailsItem({
    id,
    title,
    details,
    draggable: false,
    expanded,
    selected,
    events: { click: handleTasksSelectionChange },
    icons: [
      {
        className: 'fa-trash hidden',
        id,
        events: { click: handleTaskTrashClick },
      },
    ],
  })
  return taskEl
}

/**
 *
 */
function clearSelection() {
  tasksInput.value = ''
  tasksInput.dataset.index = ''
  tasksListEl.reset()
}
