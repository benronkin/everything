import { state } from '../js/state.js'
import { handleTokenQueryParam, getWebApp, postWebAppJson } from '../js/io.js'
import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createRightDrawer } from '../partials/rightDrawer.js'
import { createFormHorizontal } from '../partials/formHorizontal.js'
import { createSuperList } from '../partials/superList.js'
import { createSuperListItem } from '../partials/superListItem.js'
import { createIcon } from '../partials/icon.js'
import { createField } from '../partials/formField.js'
import { createSwitch } from '../partials/switch.js'
import { setMessage } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const formWrapper = document.querySelector('#form-wrapper')
const tasksWrapper = document.querySelector('#tasks-wrapper')
let tasksListEl
let sortSwitch
let tasksFormEl
let tasksInput
let token
let retryTimeout = 10

// -------------------------------
// Exported functions
// -------------------------------

// ---------------------------------------
// Event listeners
// ---------------------------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

/* when clearSelection is dispatched */
document.addEventListener('clear-selection', clearSelection)

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  handleTokenQueryParam()

  token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  setMessage('Loading...')

  const { tasks } = await getWebApp(
    `${state.getWebAppUrl()}/tasks/read?token=${token}`
  )

  setMessage('')

  addPageElements()

  initTasks(tasks)

  state.setDefaultPage('tasks')
}

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  if (sortSwitch.isOn()) {
    tasksListEl.enableDragging()
  } else {
    tasksListEl.enableClicking()
  }
}

/**
 * Handle key up
 */
function handleTaskInputKeyUp(e) {
  const tasksFormEl = e.target.closest('.form-horizontal-wrapper')
  const value = tasksFormEl.getValue().trim()
  if (value.length) {
    tasksFormEl.enable()
  } else {
    tasksFormEl.disable()
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
  if (el.isSelected()) {
    tasksFormEl.setValue('')
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
    payload.tasks = tasks.map((t) => t.id)
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

  const title = tasksFormEl.value.trim()

  if (!title.length) {
    return
  }

  const payload = {
    title,
  }

  const superListItem = createTaskItem(payload, pos)
  tasksListEl.addChild(superListItem)
  tasksFormEl.querySelector('form').reset()
  superListItem.select()
}

/**
 * Handle the tasks trash click
 */
function handleTaskTrashClick(e) {
  const el = e.target.closest('.super-list-item')
  const id = el.dataset.id
  tasksListEl.deleteChild(id)
}

// ------------------------
// Helpers
// ------------------------

/**
 * Set up tasks
 */
async function initTasks(tasks) {
  state.set('tasks', tasks)

  const children = tasks.map((task) => createTaskItem(task))
  tasksListEl.silent = true
  tasksListEl.addChildren(children)
  tasksListEl.silent = false
}

/**
 * Set nav, footer and other page elements
 */
function addPageElements() {
  // create nav and footer
  const wrapperEl = document.querySelector('.wrapper')
  const navEl = createNav({ title: 'tasks', active: 'tasks' })
  wrapperEl.prepend(navEl)
  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  const rightDrawerEl = createRightDrawer({ active: 'tasks' })
  document.querySelector('main').prepend(rightDrawerEl)

  // switches
  const switchWrapper = document.querySelector('#top-switches-wrapper')
  sortSwitch = createSwitch({ id: 'sort-switch' })
  sortSwitch.addEventListener('click', handleSortSwitchClick)
  let field = createField({
    element: sortSwitch,
    label: 'Sort',
    labelPosition: 'left',
  })
  switchWrapper.appendChild(field)

  // create tasks form
  tasksFormEl = createFormHorizontal({
    formId: 'tasks-form',
    inputType: 'text',
    inputName: 'task',
    inputPlaceholder: 'Add task',
    inputAutoComplete: 'off',
    iClass: 'fa-thumbtack',
    submitText: 'ADD',
    disabled: true,
  })
  formWrapper.prepend(tasksFormEl)
  tasksInput = tasksFormEl.querySelector('input')
  tasksInput.focus()

  /* when tasks input key is pressed */
  tasksInput.addEventListener('keyup', handleTaskInputKeyUp)

  /* when tasks form is submitted */
  tasksFormEl.addEventListener('submit', (e) =>
    handleTaskFormSubmit(e, 'prepend')
  )

  /* when user focuses on input */
  tasksFormEl
    .querySelector('input')
    .addEventListener('focus', handleTaskFormFocus)

  // tasks-list
  tasksListEl = createSuperList({
    id: 'tasks-list',
    className: 'main-super-list-wrapper',
    emptyState:
      '<i class="fa-solid fa-umbrella-beach"></i>&nbsp;<span>Nothing to do</span>',
    onChange: handleTasksListChange,
  })
  tasksWrapper.appendChild(tasksListEl)
}

/**
 * Add tasks item to list
 */
function createTaskItem({ id, title, details }) {
  const taskEl = createSuperListItem({
    id,
    title,
    details,
    showDetails: true,
    textColor: 'var(--purple3)',
    bgColor: 'var(--purple3)',
    onClick: () => handleTasksSelectionChange(taskEl),
    children: [
      createIcon({
        className: 'fa-trash hidden',
        id,
        onClick: handleTaskTrashClick,
      }),
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
