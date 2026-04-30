import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { fetchUsers, getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'
import { dueInfo } from './tasks.utils.js'
import { createTask, fetchTasks, update } from './tasks.api.js'

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

    let [{ user }, { users }, { tasks }] = await Promise.all([
      getMe(),
      fetchUsers(),
      fetchTasks(),
    ])

    tasks = tasks.map((task) => {
      if (task.starts_at) {
        task.dueInfo = dueInfo(task.starts_at)
      }
      if (task.assignee && task.assignee !== user.id) {
        const user = users.find((user) => user.id === task.assignee)
        if (!user) {
          console.log('users', users)
          throw new Error(
            `Oops, tasks.js cannot locate user with id "${task.assignee}"`,
          )
        }
        task.assignedPeer = { name: user.first_name }
      }

      return task
    })

    state.set('main-documents', tasks)
    state.set('app-mode', 'left-panel')
    state.set('users', users)
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
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createModalDelete({ password: false }))

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:tasks-form', 'tasks', handleAddTask)

  state.on('list-dragged:tasks-list', 'tasks', handleTaskDragged)
}

/**
 *
 */
async function handleAddTask() {
  const inputEl = document
    .getElementById('tasks-form')
    .querySelector('[name="task"]')

  const title = inputEl.value?.trim()
  if (!title.length) return

  inputEl.value = ''

  // Create a date string that follows the ISO format
  // but uses the local time instead of server time
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  const starts_at = new Date(now - offset).toISOString()

  setMessage('Adding task...')

  const resp = await createTask({ title, starts_at })
  const { id } = resp
  const newDoc = { id, title, starts_at, dueInfo: dueInfo(starts_at) }
  const docs = state.get('main-documents')
  docs.unshift(newDoc)
  state.set('main-documents', docs)

  // window.location.href = `./task.html?id=${id}`
}

async function handleTaskDragged() {
  const tasksListEl = document.querySelector('#tasks-list')
  const tdItems = [...tasksListEl.querySelectorAll('.md-item')]
  const ids = tdItems.map((tdItem, i) => ({ id: tdItem.id, sort_order: i }))
  const { error } = await update(ids)
  if (error) {
    setMessage(error)
    return
  }
}
