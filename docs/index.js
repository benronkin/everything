import { createNav } from './_sections/nav.js'
import { createFormHorizontal } from './_partials/formHorizontal.js'
import { createFooter } from './_sections/footer.js'
import { handleTokenQueryParam, postWebAppJson } from './js/io.js'
import { setMessage } from './js/ui.js'
import { state } from './js/state.js'
import { getUserTasks } from './tasks/tasks.js'

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
  // force login (temporary for setting token in db)
  const urlParams = new URLSearchParams(window.location.search)
  const setupParam = urlParams.get('setup')
  if (setupParam) {
    showLoginForm('Upgrading the app. We need your email again')
    return
  }

  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    console.log('handleDOMContentLoaded: no token')
    showLoginForm(
      '<i class="fa-solid fa-circle-exclamation"></i> Authentication failed'
    )
    return
  }

  const { tasks } = await getUserTasks()
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
function showLoginForm(message) {
  if (message) {
    setMessage(message)
  }

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
