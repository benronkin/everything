import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createStep as createStepElement } from './sections/step.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createStep,
  deleteStep,
  deleteTask,
  fetchTask,
  fetchSteps,
  updateStep,
  updateTask,
} from './tasks.api.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'
import { dueInfo } from './tasks.utils.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const messageParam = urlParams.get('message')
    const message = messageParam || 'Loading...'
    setMessage(message)

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()
    react()

    const id = urlParams.get('id')

    let [{ user }, { task }, { steps }] = await Promise.all([
      getMe(),
      fetchTask(id),
      fetchSteps(id),
    ])

    if (task.starts_at) {
      task.dueInfo = dueInfo(task.starts_at)
    }

    task.steps = steps

    state.set('main-documents', [task])
    state.set('active-doc', task.id)
    state.set('app-mode', 'main-panel')
    state.set('user', user)
    state.set('default-page', 'tasks')

    if (messageParam) {
      const url = new URL(window.location)
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url)
    } else {
      setMessage()
    }

    window.state = state // avail to browser console
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
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createModalDelete({ password: false }))

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('main-documents', 'note', (docs) => {
    document.title = `${docs[0].title} | Everything App`
  })
  state.on('field-changed', 'tasks', handleFieldChange)

  state.on('task-deleted', 'tasks', handleTaskDelete)

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
  task.querySelector('#steps-wrapper').appendChild(stepEl)

  const { data, message, error } = await createStep(caption, taskId)

  stepEl.setAttribute('id', data.id)
}

async function handleDeleteStep(data) {
  if (!data.id) {
    throw new Error(
      `handleDeleteStep did not receive an id. Received: ${JSON.stringify(data)}`,
    )
  }
  const id = data.id
  const step = document.getElementById(id)
  const stepsWrapper = step.closest('#steps-wrapper')
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

async function handleFieldChange(el) {
  try {
    let section = el.name
    let value = el.value

    if (!section) return

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

function handleTaskDelete() {
  const id = state.get('active-doc')
  // get steps from the dom not from state
  // for newly created tasks
  const steps = [...document.getElementById('steps-wrapper').children]
  const hasOpenSteps = steps.filter((s) => s.querySelector('.fa-circle')).length

  if (!hasOpenSteps) {
    // pass id inside object to match the payload that state.on sends
    handleTaskDeleteConfirm({ id })
    return
  }

  const modalDelete =
    document.getElementById('modal-delete') ||
    createModalDelete({ password: false })

  modalDelete.querySelector('.modal-header').innerHTML = `Delete task`
  modalDelete.querySelector('.modal-body').innerHTML =
    `<div>${document.getElementById('title').value}</div>` +
    '<div>This task contains outstanding steps. Delete task?<div'

  document.getElementById('modal-delete-btn').dataset.taskId = id

  modalDelete.showModal()
}

// must accept id inside obj to match what state.on sends
async function handleTaskDeleteConfirm() {
  const id = state.get('active-doc')
  await deleteTask(id)
  window.location = `./index.html?message=Task Deleted`
}
