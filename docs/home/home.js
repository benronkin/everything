/*
 Hiding document.querySelector('#main-panel') by default to avoid flicker
 while waiting to get tasks
 */

import { handleTokenQueryParam } from '../assets/js/io.js'
import { setMessage } from '../assets/js/ui.js'
import { state } from '../assets/js/state.js'
import { fetchTasks } from '../tasks/tasks.api.js'
import { createDiv } from '../assets/partials/div.js'
import { nav } from './sections/nav.js'
import { mainPanel } from './sections/mainPanel.js'
import { createFooter } from '../assets/composites/footer.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage({ message: 'Loading...' })

    const urlParams = new URLSearchParams(window.location.search)

    let message

    if (urlParams.get('message')) {
      message = urlParams.get('message')
    } else if (urlParams.get('setup')) {
      message = 'Upgrading the app. We need your email again'
    }

    if (message) {
      setMessage({ message, type: 'danger' })
      document.querySelector('#main-panel').classList.remove('hidden')
      return
    }

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('handleDOMContentLoaded: no token')
      setMessage({
        type: 'danger',
        message: 'Authentication failed',
        position: 'BOTTOM_RIGHT',
      })
      document.querySelector('#main-panel').classList.remove('hidden')
      return
    }

    const { tasks } = await fetchTasks(token)
    const defaultPage = state.get('default-page')
    const nextPage = await getNextPage(tasks, defaultPage)
    window.location.href = nextPage
  } catch (error) {
    console.trace(error)
  }
})

// ------------------------
// Helpers
// ------------------------

export function getSiteMap() {
  const _dict = {
    admin: '../admin/index.html',
    journal: '../journal/index.html',
    recipes: '../recipes/index.html',
    shopping: '../shopping/index.html',
    tasks: '../tasks/index.html',
  }
  return {
    get() {
      return { ..._dict }
    },
    getPath(section) {
      return _dict[section]
    },
  }
}

export function getNextPage(tasks, defaultPage) {
  const siteMap = getSiteMap()
  if (tasks.length) {
    return siteMap.getPath('tasks')
  }
  if (defaultPage && siteMap.getPath(defaultPage)) {
    return siteMap.getPath(defaultPage)
  }
  return siteMap.getPath('recipes')
}

export function build() {
  document.head.title = 'The Evereything App | Everything App'
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

  wrapperEl.appendChild(createFooter())
}
