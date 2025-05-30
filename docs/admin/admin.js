import { createNav } from '../sections/nav.js'
import { createFooter } from '../sections/footer.js'
import { createFormHorizontal } from '../partials/formHorizontal.js'
import { createLeftPanelLink } from '../partials/leftPanelLink.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { setMessage } from '../js/ui.js'
import { state } from '../js/state.js'
import { postWebAppJson } from '../js/io.js'
import { listRecipeCategories } from './recipeCategories.js'
import { listRecipes } from './recipes.js'

// ----------------------
// Globals
// ----------------------

const loginContainer = document.querySelector('#login-container')
const leftPanelList = document.querySelector('#left-panel-list')
let mainIconGroup

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
  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({
    title: '<i class="fa-solid fa-lock"></i> Admin',
    wideNav: true,
  })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'admin' })
  document.querySelector('main').prepend(rightDrawerEl)

  mainIconGroup = createMainIconGroup()
  document.querySelector('#main-icon-group-wrapper').appendChild(mainIconGroup)

  // set the login form
  const loginFormEl = createFormHorizontal({
    id: 'login-form',
    inputType: 'password',
    inputName: 'key',
    inputPlaceholder: 'Enter admin key',
    iconClass: 'fa-key',
    submitText: 'Submit',
    events: {
      submit: handleLoginFormSubmit,
    },
  })
  document.querySelector('#login-container').appendChild(loginFormEl)

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)
}

/**
 * Handle login form submit
 */
async function handleLoginFormSubmit(e) {
  e.preventDefault()
  const form = e.target.closest('.form-horizontal')
  const btn = form.querySelector('button')

  btn.disabled = true
  setMessage({ message: 'Validating key. Please wait...' })

  const formData = new FormData(form)
  const key = formData.get('key')
  try {
    const { error, message, data } = await postWebAppJson(
      `${state.getWebAppUrl()}/admin/key-submit`,
      {
        key,
      }
    )
    if (error) {
      console.error(error)
      setMessage({ message: error.message })
      return
    }
    if (message) {
      setMessage(message)
      return
    }
    if (!data) {
      setMessage({ message: "Didn't recieve data" })
      return
    }
    setMessage()
    showAdminRoutes(data)
  } catch (error) {
    console.error(error)
    setMessage({ message: error.message })
  }
  btn.disabled = false
}

// ------------------------
// Helpers
// ------------------------

/**
 * Populate the admin sidebar's link list
 */
function showAdminRoutes(data) {
  const c = document.querySelector('#columns-container').closest('.container')
  c.classList.remove('hidden')
  loginContainer.classList.add('hidden')
  for (const { label, endpoint } of data) {
    const li = createLeftPanelLink({
      id: endpoint,
      title: label,
      cb: handleLeftPanelLinkClick,
    })
    leftPanelList.appendChild(li)
  }
}

/**
 * Hanlde an admin sidebar's link click
 */
function handleLeftPanelLinkClick(el) {
  switch (el.dataset.id) {
    case 'admin-recipe-cateogries':
      listRecipeCategories()
      break
    case 'admin-recipes':
      listRecipes()
      break
  }
}
