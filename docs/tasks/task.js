import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createStep as createStepElement } from './sections/step.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { fetchUsers, getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createStep,
  deleteStep,
  deleteTask,
  duplicateTask,
  fetchTask,
  fetchSteps,
  shareTask,
  updateStep,
  updateTask
} from './tasks.api.js'
import {
  attachProjectItem,
  detachProjectItem
} from '../projects/projects.api.js'
import { createModalShare } from '../assets/composites/modalShare.js'
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

    let [{ user }, { users }, { task }, { steps }] = await Promise.all([
      getMe(),
      fetchUsers(),
      fetchTask(id),
      fetchSteps(id)
    ])

    if (!task) {
      setMessage('No task info received from server', { type: 'danger' })
      return
    }

    if (task.starts_at) {
      task.dueInfo = dueInfo(task.starts_at)
    }

    task.steps = steps

    task.assignedProject = task?.assignedProject?.project_id

    state.set('user', user)
    state.set('users', users)
    state.set('main-documents', [task])
    state.set('active-doc', task.id)
    state.set('app-mode', 'main-panel')
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

/**
 *
 */
function build() {
  document.title = 'Tasks | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper'
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createModalDelete({ password: false }))
  wrapperEl.appendChild(createModalShare({}))
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('main-documents', 'note', (docs) => {
    document.title = `${docs[0].title} | Everything App`
  })
  state.on('field-changed', 'task', handleFieldChange)

  state.on('task-deleted', 'task', handleTaskDelete)

  state.on('button-click:modal-delete-btn', 'task', handleTaskDeleteConfirm)

  state.on('step-added', 'task', handleStepCreate)

  state.on('step-deleted', 'task', handleStepDelete)

  state.on('step-updated', 'task', handleStepUpdate)

  state.on('icon-click:cancel-due-date', 'task', handleDueDateCancel)

  state.on('sharer-click', 'task', () => {
    const modalEl = document.querySelector('#modal-share')
    modalEl.showModal()
  })

  state.on('modal-share-updated', 'task', async (data) => {
    await shareTask(data)
    window.location.reload()
  })

  state.on('button-click:duplicate-task', 'task', handleInstanceClick)
}

async function handleStepCreate({ caption, taskId }) {
  const addStepEl = document.querySelector('.add-step')
  addStepEl.value = ''
  addStepEl.placeholder = 'Next step'
  addStepEl.focus()

  const stepEl = createStepElement({ caption })
  document.querySelector('#steps-wrapper').appendChild(stepEl)

  const resp = await createStep(caption, taskId)

  const { data } = resp

  stepEl.id = data.id
}

async function handleStepDelete(data) {
  if (!data.id) {
    throw new Error(
      `handleStepDelete did not receive an id. Received: ${JSON.stringify(data)}`
    )
  }
  const id = data.id
  const step = document.getElementById(id)
  const stepsWrapper = step.closest('#steps-wrapper')

  step.remove()
  if (!stepsWrapper.childElementCount) {
    document.querySelector('.add-step').placeholder = 'Add step'
  }

  const { error } = await deleteStep(id)
  if (error) {
    throw new Error(error)
  }
}

/**
 *
 */
function handleDueDateCancel() {
  const id = state.get('active-doc')
  updateTask({ id, section: 'starts_at', value: '' })
}

/**
 *
 */
async function handleStepUpdate(doc) {
  const { id, section, value } = doc
  const { error } = await updateStep({
    id,
    section,
    value
  })
  if (error) {
    throw new Error(error)
  }

  if (section === 'assignee') {
    // show the sharer that the task is shared with the step assignee
    if (!document.querySelector('.avatar-group').hasUser(value))
      window.location.reload()
  }
}

/**
 *
 */
async function handleFieldChange(el) {
  try {
    let section = el.name
    let value = el.value

    if (!section) {
      console.log('element name was not provided. aborting')
      return
    }

    const id = state.get('active-doc')

    if (section === 'project') {
      if (value) {
        attachProjectItem({ project_id: value, item_id: id, type: 'task' })
      } else {
        detachProjectItem({ item_id: id })
      }
      setMessage('Saved', { type: 'quiet' })
      return
    }

    const { error } = await updateTask({ id, section, value })
    if (error) {
      throw new Error(error)
    }

    if (section === 'assignee') {
      // show the sharer that the task is shared with the step assignee
      if (!document.querySelector('.avatar-group').hasUser(value)) {
        window.location.reload()
      }
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

  const doc = state.get('main-documents')[0]
  const typeString = doc.type === 'TASK' ? 'task' : 'template'

  const modalDelete =
    document.getElementById('modal-delete') ||
    createModalDelete({ password: false })

  modalDelete.querySelector('.modal-header').innerHTML = `Delete ${typeString}`
  modalDelete.querySelector('.modal-body').innerHTML =
    `<div><strong>${document.getElementById('title').value}</strong> contains outstanding steps. Delete ${typeString}?<div>`

  document.getElementById('modal-delete-btn').dataset.taskId = id

  modalDelete.showModal()
}

/**
 *
 */
async function handleTaskDeleteConfirm() {
  setMessage('Deleting task...')
  const id = state.get('active-doc')
  const typeString =
    document.getElementById('task-body').dataset.type === 'TEMPLATE'
      ? 'Template'
      : 'Task'
  const { error } = await deleteTask(id)
  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }
  window.location = `./index.html?message=${typeString}+deleted`
}

/**
 *
 */
async function handleInstanceClick() {
  setMessage('Creating task from template')
  const id = state.get('active-doc')
  const { id: newTaskId } = await duplicateTask(id)
  if (newTaskId) {
    window.location.href = `./task.html?id=${newTaskId}`
  }
}
