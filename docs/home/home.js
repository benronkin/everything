import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { fetchTasks } from '../tasks/tasks.api.js'
import { createDiv } from '../_partials/div.js'
import { nav } from './sections/nav.js'
import { mainPanel } from './sections/mainPanel.js'
import { footer } from './sections/footer.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('handleDOMContentLoaded: no token')
      setMessage({
        type: 'danger',
        message: 'Authentication failed',
        position: 'BOTTOM_RIGHT',
      })
      return
    }

    const urlParams = new URLSearchParams(window.location.search)

    let message

    if (urlParams.get('message')) {
      message = urlParams.get('message')
    } else if (urlParams.get('setup')) {
      message = 'Upgrading the app. We need your email again'
    }

    if (message) {
      setMessage({ message })
      return
    }

    const { tasks } = await fetchTasks(token)
    const defaultPage = newState.get('default-page')
    const nextPage = await getNextPage(tasks, defaultPage)
    window.location.href = nextPage
  } catch (error) {
    console.trace(error)
  }
})

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
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

/**
 * Redirect to Tasks if there
 * are open tasks. Otherwise redirect to last visited
 * page.
 */
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

/**
 *
 */
export function build() {
  document.head.title = 'The Evereything App | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)

  columnsWrapperEl.appendChild(mainPanel())

  wrapperEl.appendChild(footer())
}
