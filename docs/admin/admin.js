import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createRightDrawer } from '../partials/right-drawer.js'
import { createSelect } from '../partials/select.js'
import { createSwitch } from '../partials/switch.js'

import { setMessage } from '../js/ui.js'
import { state } from '../js/state.js'
import { postWebAppJson } from '../js/io.js'
import { listRecipeCategories } from './categories.js'

// ----------------------
// Globals
// ----------------------

const leftSidebar = document.querySelector('.left-sidebar')
const leftPanelToggle = document.querySelector('#left-panel-toggle')
const adminActionButtonGroup = document.querySelector('#admin-action-buttons-group')
const columnsContainer = document.querySelector('#columns-container')
const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const loginBtn = document.querySelector('#login-btn')
const sidebarLinkList = document.querySelector('#admin-sidebar ul')

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

/* When login form is submitted */
loginForm.addEventListener('submit', handleLoginFormSubmit)

/* When the left panel toggle is clicked */
leftPanelToggle.addEventListener('click', () => {
  handleLeftPanelToggle()
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

  const navEl = createNav({ title: 'Recipes: Admin', wideNav: true })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'recipes' })
  document.querySelector('main').prepend(rightDrawerEl)

  const selectEl = createSelect({
    id: 'journal-category',
    label: 'Category',
    icon: 'fa-tags',
    orientation: 'column',
    options: [
      { value: 'food', label: 'Food' },
      { value: 'travel', label: 'Travel and more', selected: true },
      { value: 'fun', label: 'Fun' },
    ],
  })
  document.querySelector('#select-target').appendChild(selectEl)
  selectEl.querySelector('select').addEventListener('change', (e) => console.log('changed to', e.target.value))

  const switchEl = createSwitch({
    id: 'test-switch',
    // iconOff: 'fa-sun',
    // iconOn: 'fa-moon',
  })
  document.querySelector('#select-target').appendChild(switchEl)
  switchEl.addEventListener('click', (e) => {
    console.log(switchEl.classList.contains('on'))
  })
  switchEl.setOn()
  // switchEl.disable()

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

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  // adminActionButtonGroup.classList.toggle('collapsed')
  leftSidebar.classList.toggle('collapsed')
}

// ------------------------
// Helpers
// ------------------------

/**
 * Populate the admin sidebar's link list
 */
function showAdminRoutes(data) {
  adminActionButtonGroup.classList.remove('hidden')
  loginContainer.classList.add('hidden')
  columnsContainer.classList.remove('hidden')
  for (const { label, endpoint } of data) {
    const li = makeSidebarLinkEl(endpoint, label, handleSidebarLinkClick)
    sidebarLinkList.appendChild(li)
  }
}

/**
 * Hanlde an admin sidebar's link click
 */
function handleSidebarLinkClick(el) {
  switch (el.dataset.id) {
    case 'admin-recipe-cateogires':
      listRecipeCategories()
      break
  }
}
