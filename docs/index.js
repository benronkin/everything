import { createNav } from './sections/nav.js'
import { createFormHorizontal } from './partials/formHorizontal.js'
import { createFooter } from './sections/footer.js'
import { handleTokenQueryParam, getWebApp, postWebAppJson } from './js/io.js'
import { setMessage } from './js/ui.js'
import { state } from './js/state.js'

// ----------------------
// Globals
// ----------------------

const loginContainer = document.querySelector('#login-container')
let loginForm

// ----------------------
// Exports
// ----------------------

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

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  const urlParams = new URLSearchParams(window.location.search)

  let message

  if (urlParams.get('message')) {
    message = urlParams.get('message')
  } else if (urlParams.get('setup')) {
    message = 'Upgrading the app. We need your email again'
  }

  if (message) {
    setMessage(message)
    showLoginForm()
    return
  }

  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    console.log('handleDOMContentLoaded: no token')
    setMessage(
      '<i class="fa-solid fa-circle-exclamation"></i> Authentication failed'
    )
    showLoginForm()
    return
  }

  const { tasks } = await getWebApp(
    `${state.getWebAppUrl()}/tasks/read?token=${token}`
  )
  const defaultPage = state.getDefaultPage()
  const nextPage = await getNextPage(tasks, defaultPage)
  window.location.href = nextPage
}

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
function showLoginForm() {
  loginForm = createFormHorizontal({
    formId: 'login-form',
    inputType: 'email',
    inputName: 'email',
    inputPlaceholder: 'Email',
    iClass: 'fa-envelope',
    inputAutoComplete: false,
    submitText: 'Submit',
    events: { submit: handleLoginFormSubmit },
  })
  loginContainer.appendChild(loginForm)

  loginContainer.classList.remove('hidden')
  const wrapperEl = document.querySelector('.wrapper')
  const navEl = createNav({
    title: 'The Everything App',
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
  setMessage('')

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
