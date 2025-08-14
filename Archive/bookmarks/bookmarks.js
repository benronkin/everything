/*
 Hiding document.querySelector('#main-panel') by default to avoid flicker
 while waiting to get tasks
 */

import { handleTokenQueryParam } from '../assets/js/io.js'
import { setMessage } from '../assets/js/ui.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { state } from '../assets/js/state.js'
import { createDiv } from '../assets/partials/div.js'
import { nav } from './sections/nav.js'
import { mainPanel } from './sections/mainPanel.js'
import { createFooter } from '../assets/composites/footer.js'
import { getMe } from '../users/users.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()

    handleTokenQueryParam()

    const { user } = await getMe()
    state.set('user', user)

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
  document.title = 'Bookmarks | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({
    className: 'wrapper',
  })
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
