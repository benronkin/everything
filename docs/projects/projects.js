import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { handlRightDrawerState } from '../assets/js/ui.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { fetchUsers, getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import { getLocalDate } from '../assets/js/format.js'
import { createModalDelete } from '../assets/composites/modalDelete.js'
import { createProject, fetchProjects } from './projects.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.state = state // avail to browser console
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

    let [{ user }, { users }, { projects }] = await Promise.all([
      getMe(),
      fetchUsers(),
      fetchProjects()
    ])

    state.set('main-documents', projects || [])
    state.set('app-mode', 'left-panel')
    state.set('users', users)
    state.set('user', user)
    state.set('default-page', 'projects')

    if (messageParam) {
      const url = new URL(window.location)
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url)
    } else {
      setMessage()
    }
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
  document.title = 'projects | Everything App'
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
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createModalDelete({ password: false }))

  wrapperEl.appendChild(createFooter())
}

/**
 *
 */
function react() {
  state.on('icon-click:add-project', 'projects', handleAddproject)
}

/**
 *
 */
async function handleAddproject() {
  const title = 'New project'
  let starts_at = getLocalDate()

  setMessage('Adding project...')

  const resp = await createProject({ title, starts_at })
  const { data } = resp
  const { id } = data
  window.location.href = `./project.html?id=${id}`
}
