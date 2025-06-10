import { newState } from '../_assets/js/newState.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import {
  createRecipe,
  deleteRecipe,
  fetchRecentRecipes,
  searchRecipes,
  updateRecipe,
} from './recipes.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()
    react()
    listen()

    const { data } = await fetchRecentRecipes()
    newState.set('main-documents', data)
    newState.set('app-mode', 'left-panel')
    newState.set('default-page', 'recipes')
    window.newState = newState // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    console.trace(error)
  }
})

// ------------------------
// Helper functions
// ------------------------

/**
 *
 */
async function build() {
  document.head.title = 'Recipes | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

/**
 *
 */
function react() {
  newState.on('form-submit:left-panel-search', 'recipes', reactSearch)
  newState.on('icon-click:add-Recipe', 'recipes', reactRecipeAdd)
  newState.on('button-click:modal-delete-btn', 'recipes', reactRecipeDelete)
}

function listen() {
  /* When recipe field loses focus */
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}

/**
 * Add a recipe Recipe
 */

async function reactRecipeAdd({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const { id, error } = await createRecipe()
  if (error) {
    console.error(`Recipes server error: ${error}`)
    return
  }

  const { defaults, error: error2 } = await fetchDefaults()
  if (error2) {
    console.error(`Recipes server error: ${error2}`)
    return
  }

  const dateString = new Date().toISOString()

  const doc = {
    id,
    location: 'New Recipe',
    created_at: dateString,
    visit_date: dateString,
    city: defaults.city,
    state: defaults.state,
    country: defaults.country,
    notes: '',
  }

  newState.set('main-documents', [doc, ...newState.get('main-documents')])
  newState.set('active-doc', doc)
  newState.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

/**
 *
 */
async function reactRecipeDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = newState.get('active-doc').id
  const password = modalEl.getPassword()
  const { error } = await deleteRecipe(id, password)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.setPassword('')
  modalEl.close()

  const filteredDocs = newState
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  newState.set('main-documents', filteredDocs)
  newState.set('app-mode', 'left-panel')
}

/**
 *
 */
async function reactSearch(doc) {
  let resp

  if (doc['search-Recipe'].trim().length) {
    resp = await searchRecipes(doc['search-Recipe'])
  } else {
    // get most recent recipes instead
    resp = await fetchRecenRecipes()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Recipe server error: ${message}`)
    return
  }
  newState.set('main-documents', data)
}

/**
 * Handle Recipe field change
 */

async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value

  const doc = newState.get('active-doc')
  const id = doc.id

  doc[section] = value

  const docs = newState.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx] = doc

  newState.set('main-documents', docs)
  newState.set('active-doc', doc)

  try {
    const { message, error } = await updateRecipe({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    log(message)
  } catch (err) {
    log(err)
  }
}
