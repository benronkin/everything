import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { fetchUsers, getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createProjectItem,
  deleteProject,
  fetchProject,
  shareProject,
  updateProject
} from './projects.api.js'
import { createModalShare } from '../assets/composites/modalShare.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'

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

    let [{ user }, { users }, { project }] = await Promise.all([
      getMe(),
      fetchUsers(),
      fetchProject(id)
    ])

    if (!project) {
      setMessage('No project info received from server', { type: 'danger' })
      return
    }

    state.set('user', user)
    state.set('users', users)
    state.set('main-documents', [project])
    state.set('active-doc', project.id)
    state.set('app-mode', 'main-panel')
    state.set('default-page', 'projects')

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
    document.title = docs[0].title
  })
  state.on('field-changed', 'project', handleFieldChange)

  state.on('project-deleted', 'project', handleprojectDelete)

  state.on(
    'button-click:modal-delete-btn',
    'project',
    handleprojectDeleteConfirm
  )

  state.on('sharer-click', 'project', () => {
    const modalEl = document.querySelector('#modal-share')
    modalEl.showModal()
  })

  state.on('modal-share-updated', 'project', async (data) => {
    await shareProject(data)
    window.location.reload()
  })

  state.on('icon-click:add-task', 'project', () => {
    handleAddItem('task')
  })

  state.on('icon-click:add-note', 'project', () => {
    handleAddItem('note')
  })
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

    const { error } = await updateProject({ id, section, value })
    if (error) {
      throw new Error(error)
    }

    if (section === 'assignee') {
      // show the sharer that the project is shared with the step assignee
      if (!document.querySelector('.avatar-group').hasUser(value))
        window.location.reload()
    }

    setMessage('Saved', { type: 'quiet' })
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 */
function handleprojectDelete() {
  const id = state.get('active-doc')
  // get steps from the dom not from state
  // for newly created projects
  const steps = [...document.getElementById('steps-wrapper').children]
  const hasOpenSteps = steps.filter((s) => s.querySelector('.fa-circle')).length

  if (!hasOpenSteps) {
    // pass id inside object to match the payload that state.on sends
    handleprojectDeleteConfirm({ id })
    return
  }

  const doc = state.get('main-documents')[0]
  const typeString = doc.type === 'project' ? 'project' : 'template'

  const modalDelete =
    document.getElementById('modal-delete') ||
    createModalDelete({ password: false })

  modalDelete.querySelector('.modal-header').innerHTML = `Delete ${typeString}`
  modalDelete.querySelector('.modal-body').innerHTML =
    `<div><strong>${document.getElementById('title').value}</strong> contains outstanding steps. Delete ${typeString}?<div>`

  document.getElementById('modal-delete-btn').dataset.projectId = id

  modalDelete.showModal()
}

/**
 *
 */
async function handleprojectDeleteConfirm() {
  const id = state.get('active-doc')
  const typeString =
    document.getElementById('project-body').dataset.type === 'TEMPLATE'
      ? 'Template'
      : 'project'
  const { error } = await deleteProject(id)
  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }
  window.location = `./index.html?message=${typeString}+deleted`
}

/**
 *
 */
async function handleAddItem(type) {
  setMessage(`Adding ${type}...`)

  const resp = await createProjectItem({ id: state.get('active-doc'), type })
  const { data } = resp
  const { id } = data

  const redirects = {
    task: '../tasks/task.html',
    note: '../notes/note.html',
    journal: '../journal/index.html'
  }

  window.location.href = `./${redirects[type]}?id=${id}`
}
