import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createLeftPanelLink } from '../partials/leftPanelLink.js'
import { createMainIconGroup } from '../partials/mainIconGroup.js'
import { createRightDrawer } from '../partials/rightDrawer.js'
import { setMessage } from '../js/ui.js'
import { state } from '../js/state.js'
import { postWebAppJson } from '../js/io.js'
import { listRecipeCategories } from './categories.js'

// ----------------------
// Globals
// ----------------------

const columnsContainer = document.querySelector('#columns-container')
const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const loginBtn = document.querySelector('#login-btn')
const leftPanelList = document.querySelector('#left-panel-list')
let mainIconGroup

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

/* When login form is submitted */
loginForm.addEventListener('submit', handleLoginFormSubmit)

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({ title: 'Recipes: Admin', wideNav: true })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'recipes' })
  document.querySelector('main').prepend(rightDrawerEl)

  mainIconGroup = createMainIconGroup()
  document.querySelector('#main-icon-group-wrapper').appendChild(mainIconGroup)

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)
}

/**
 * Handle login form submit
 */
async function handleLoginFormSubmit(e) {
  e.preventDefault()
  loginBtn.disabled = true
  setMessage('Validating key. Please wait...')

  const formData = new FormData(loginForm)
  const key = formData.get('key')
  try {
    const { error, message, data } = await postWebAppJson(`${state.getWebAppUrl()}/admin/key-submit`, {
      key,
    })
    if (error) {
      console.error(error)
      setMessage(error.message)
      return
    }
    if (message) {
      setMessage(message)
      return
    }
    if (!data) {
      setMessage("Didn't recieve data")
      return
    }
    setMessage('')
    showAdminRoutes(data)
  } catch (error) {
    console.error(error)
    setMessage(error.message)
  }
  loginBtn.disabled = false
}

// ------------------------
// Helpers
// ------------------------

/**
 * Populate the admin sidebar's link list
 */
function showAdminRoutes(data) {
  const c = document.querySelector('#columns-container').closest('.container-wide')
  c.classList.remove('hidden')
  loginContainer.classList.add('hidden')
  for (const { label, endpoint } of data) {
    const li = createLeftPanelLink({ id: endpoint, title: label, cb: handleLeftPanelLinkClick })
    leftPanelList.appendChild(li)
  }
}

/**
 * Hanlde an admin sidebar's link click
 */
function handleLeftPanelLinkClick(el) {
  switch (el.dataset.id) {
    case 'admin-recipe-cateogires':
      listRecipeCategories()
      break
  }
}
