import { nav } from './sections/nav.js'
import { mainPanel } from './sections/mainPanel.js'
import { createFormHorizontal } from '../_partials/formHorizontal.js'
import { createFooter } from '../_composites/footer.js'
import { createDiv } from '../_partials/div.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('handleDOMContentLoaded: no token')
      setMessage({
        type: 'danger',
        message: 'Authentication failed',
      })
      build()
      return
    }

    handleTokenQueryParam

    const urlParams = new URLSearchParams(window.location.search)

    let message

    if (urlParams.get('message')) {
      message = urlParams.get('message')
    } else if (urlParams.get('setup')) {
      message = 'Upgrading the app. We need your email again'
    }

    if (message) {
      setMessage(message)
      build()
      return
    }

    const { tasks } = await getWebApp(
      `${newState.const('APP_URL')}/tasks/read?token=${token}`
    )
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
    admin: './admin/index.html',
    journal: './journal/index.html',
    recipes: './recipes/index.html',
    shopping: './shopping/index.html',
    tasks: './tasks/index.html',
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
function build() {
  document.head.title = 'Journal | Ben'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })

  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(columnsWrapperEl)
  wrapperEl.appendChild(createFooter())

  columnsWrapperEl.appendChild(mainPanel())

  {
    /* <div class="wrapper">
      <main>
        <div class="container">
          <div
            id="login-container"
            class="card translucent hidden"
            style="margin-top: 30px; align-items: flex-start"
          >
            <h4>Enter your email address to gain access</h4>
          </div>
        </div>
      </main>
    </div> */
  }

  loginForm = createFormHorizontal({
    id: 'login-form',
    inputType: 'email',
    inputName: 'email',
    inputPlaceholder: 'Email',
    iconClass: 'fa-envelope',
    inputAutoComplete: false,
    submitText: 'Submit',
    events: { submit: handleLoginFormSubmit },
  })
  loginContainer.appendChild(loginForm)

  loginContainer.classList.remove('hidden')
  const navEl = createNav({
    title: '<i class="fa-solid fa-house"></i> The Everything App',
    disableRightDrawer: true,
  })
  wrapperEl.prepend(navEl)
  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)
}

/**
 * Handle login form submit
 */
async function handleLoginFormSubmit(e) {
  e.preventDefault()
  loginForm.disable()
  loginForm.message = 'Checking. Please wait...'
  setMessage()

  const email = loginForm.value
  try {
    const { error, message } = await postWebAppJson(
      `${state.getWebAppUrl()}/email-submit`,
      {
        email,
      }
    )
    if (error) {
      throw new Error(error)
    }
    loginForm.message = ''
    setMessage(message)
  } catch (err) {
    loginForm.message = err.message
    console.log(err)
  }
  loginForm.enable()
}
