import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createStep as createStepElement } from './sections/step.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createStep,
  createTask,
  deleteStep,
  deleteTask,
  fetchTasks,
  fetchStepsOfMultipleTasks,
  update,
  updateStep,
  updateTask,
} from './tasks.api.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'

document.addEventListener('DOMContentLoaded', async () => {
  build()
  react()

  try {
    setMessage('Loading...')

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    let [{ user }, { tasks }] = await Promise.all([getMe(), fetchTasks()])

    tasks = tasks.map((task) => {
      if (task.starts_at) {
        task.dueInfo = dueInfo(task.starts_at)
      }
      return task
    })

    const taskIds = tasks.slice(0, 100).map((t) => t.id)
    const { steps } = await fetchStepsOfMultipleTasks(taskIds)
    // group steps by task_id
    const stepsMap = steps.reduce((acc, step) => {
      const { task_id, ...stepData } = step
      if (!acc[task_id]) acc[task_id] = []
      acc[task_id].push(stepData)
      return acc
    }, {})
    // map steps using the map object
    tasks = tasks.map((t) => {
      t.steps = stepsMap[t.id] || []
      return t
    })

    state.set('main-documents', tasks)
    state.set('app-mode', 'main-panel')
    state.set('user', user)
    state.set('default-page', 'tasks')
    setMessage()
    window.state = state // avail to browser console

    const viewMode = localStorage.getItem('task-list-view')
    if (viewMode === 'calendar')
      document.getElementById('calendar-priority').click()
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
  document.title = 'Tasks | Everything App'
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

  wrapperEl.appendChild(createModalDelete({ password: false }))

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:tasks-form', 'tasks', handleAddTask)

  state.on('field-changed', 'tasks', handleTaskUpdate)

  state.on('task-deleted:tasks-list', 'tasks', handleTaskDelete)

  state.on('button-click:modal-delete-btn', 'tasks', handleTaskDeleteConfirm)

  state.on('list-dragged:tasks-list', 'tasks', handleTaskDragged)

  state.on('step-added', 'tasks', handleAddStep)

  state.on('step-deleted', 'tasks', handleDeleteStep)

  state.on('step-updated', 'tasks', handleStepUpdate)

  state.on('icon-click:cancel-due-date', 'tasks', handleDueDateCancel)
}

async function handleAddStep({ caption, taskId }) {
  const task = document.getElementById(taskId)
  const addStepEl = task.querySelector('.add-step')
  addStepEl.value = ''
  addStepEl.placeholder = 'Next step'
  addStepEl.focus()

  const stepEl = createStepElement({ caption })
  task.querySelector('.steps-wrapper').appendChild(stepEl)

  const { data, message, error } = await createStep(caption, taskId)

  stepEl.setAttribute('id', data.id)
}

async function handleAddTask() {
  const inputEl = document
    .getElementById('tasks-form')
    .querySelector('[name="task"]')

  const title = inputEl.value?.trim()
  if (!title.length) return

  const id = `ev${crypto.randomUUID()}`

  const doc = {
    id,
    title,
    details: null,
    created_at: new Date().toISOString(),
    completed_at: null,
    sort_order: 0,
  }

  const docs = state.get('main-documents')
  docs.unshift(doc)
  state.set('main-documents', docs)

  document.querySelector('input[name="task"]').value = ''

  const { error } = await createTask(title, id)

  if (error) {
    // revert operation
    inputEl.value = title
    docs.shift()
    state.set('main-documents', docs)
    setMessage(error, { type: 'warn' })
  }
}

async function handleDeleteStep(data) {
  if (!data.id) {
    throw new Error(
      `handleDeleteStep did not receive an id. Received: ${JSON.stringify(data)}`,
    )
  }
  const id = data.id
  const step = document.getElementById(id)
  const stepsWrapper = step.closest('.steps-wrapper')
  const task = step.closest('.td-item')

  step.remove()
  if (!stepsWrapper.childElementCount) {
    task.querySelector('.add-step').placeholder = 'Add step'
  }

  const { error } = await deleteStep(id)
  if (error) {
    throw new Error(error)
  }
}

function handleDueDateCancel() {
  const parent = document.getElementById('cancel-due-date').closest('.td-item')
  const id = parent.id
  updateTask({ id, section: 'starts_at', value: '' })
}

async function handleStepUpdate({ id, completed }) {
  const { error } = await updateStep({
    id,
    section: 'completed',
    value: completed,
  })
  if (error) {
    throw new Error(error)
  }
}

async function handleTaskUpdate(el) {
  try {
    let section = el.name
    let value = el.value

    const parent = el.closest('.td-item')
    if (!parent) return
    const id = parent.id

    if (section === 'due-date' || section === 'due-time') {
      const dateString = parent.querySelector('.due-date').value
      const timeString = parent.querySelector('.due-time').value

      if (section === 'due-time' && !dateString) return

      if (timeString) {
        value = new Date(`${dateString}T${timeString}Z`)
      } else {
        value = new Date(`${dateString}T00:00:00Z`)
      }
      value = value.toISOString()
      section = 'starts_at'
    }

    const { error } = await updateTask({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    setMessage('Saved', { type: 'quiet' })
  } catch (err) {
    console.error(err)
  }
}

function handleTaskDelete({ id }) {
  const tasks = state.get('main-documents')
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return

  // get steps from the dom not from state
  // for newly created tasks
  const steps = [
    ...document.getElementById(id).querySelector('.steps-wrapper').children,
  ]
  const hasOpenSteps = steps.filter((s) => s.querySelector('.fa-circle')).length

  if (!hasOpenSteps) {
    // pass id inside object to match the payload that state.on sends
    handleTaskDeleteConfirm({ id })
    return
  }

  const modalDelete =
    document.getElementById('modal-delete') ||
    createModalDelete({ password: false })
  modalDelete.querySelector('.modal-header').innerHTML =
    `Delete ${tasks[idx].title}`
  modalDelete.querySelector('.modal-body').innerHTML =
    'This task contains outstanding steps. Delete task?'

  document.getElementById('modal-delete-btn').dataset.taskId = id

  modalDelete.showModal()
}

// must accept id inside obj to match what state.on sends
function handleTaskDeleteConfirm({ id }) {
  if (id === 'modal-delete-btn') {
    // call came from state.on so get id
    // from the modal delete btn
    id = document.getElementById('modal-delete-btn').dataset.taskId
  }
  const tasks = state.get('main-documents')
  const idx = tasks.findIndex((t) => t.id === id)
  tasks.splice(idx, 1)[0] // remove 1 item
  state.set('main-documents', [...tasks]) // triggers list re-render

  document.getElementById('modal-delete').close()

  deleteTask(id)
}

async function handleTaskDragged() {
  const tasksListEl = document.querySelector('#tasks-list')
  const tdItems = [...tasksListEl.querySelectorAll('.td-item')]
  const ids = tdItems.map((tdItem, i) => ({ id: tdItem.id, sort_order: i }))
  const { error } = await update(ids)
  if (error) {
    setMessage(error)
    return
  }
}

function dueInfo(isoString) {
  if (!isoString) return {}

  // Get the Parts
  const [givenDatePart, givenTimePart] = isoString.split('T')
  const hhMm = givenTimePart.slice(0, 5)
  const [givenYear, givenMonth, givenDay] = givenDatePart.split('-')
  const givenFormattedDate = `${givenMonth}/${givenDay}`

  // Get "Today" and "Tomorrow" as Strings in LOCAL time
  const now = new Date()
  const nowDatePart = now.toLocaleDateString('en-CA') // Returns "YYYY-MM-DD"

  const tomorrow = new Date()
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowDatePart = tomorrow.toLocaleDateString('en-CA')

  let obj = {
    isoString,
    date: givenFormattedDate,
    time: hhMm,
  }

  if (givenDatePart < nowDatePart) {
    obj.label = 'Overdue'
  } else if (givenDatePart === nowDatePart) {
    obj.label = 'Today'
  } else if (givenDatePart === tomorrowDatePart) {
    obj.label = 'Tomorrow'
  } else {
    obj.label = 'Later'
  }

  return obj
}
