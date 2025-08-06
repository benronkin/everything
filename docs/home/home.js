/*
 Hiding document.querySelector('#main-panel') by default to avoid flicker
 while waiting to get tasks
 */

import { handleTokenQueryParam } from '../assets/js/io.js'
import { setMessage } from '../assets/js/ui.js'
import { state } from '../assets/js/state.js'
import { getMe } from '../users/users.api.js'
import { fetchTasks } from '../tasks/tasks.api.js'
import { createDiv } from '../assets/partials/div.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createFooter } from '../assets/composites/footer.js'

document.addEventListener('DOMContentLoaded', async () => {
  build()

  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    setMessage({
      type: 'danger',
      message: 'Authentication failed',
      position: 'BOTTOM_RIGHT',
    })
    window.location.href = '../login/index.html?message=Authentication+failed'
    return
  }

  const urlParams = new URLSearchParams(window.location.search)

  let message = ''

  if (urlParams.get('message')) {
    message = urlParams.get('message')
  } else if (urlParams.get('setup')) {
    message = 'Upgrading the app. We need your email again'
  }

  if (message) {
    setMessage(message, { type: 'danger' })
  }

  const [{ tasks, error }, { user }] = await Promise.all([
    fetchTasks(),
    getMe(),
  ])

  if (error) {
    setMessage(error, {
      type: 'danger',
    })
    return
  }

  state.set('main-documents', tasks.slice(0, 2))
  state.set('user', user)
})

export function build() {
  document.head.title = 'Home | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({
    className: 'wrapper',
  })
  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())

  wrapperEl.appendChild(createDiv({ id: 'for-grid-dont-delete' }))

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)

  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}
