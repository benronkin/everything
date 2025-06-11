import { newState } from '../_assets/js/newState.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { createMainDocumentItem } from '../_partials/mainDocumentItem.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import {
  createRecipe,
  deleteRecipe,
  fetchCategoriesAndRecipes,
  fetchRecentRecipes,
  searchRecipes,
  updateRecipe,
} from './recipes.api.js'
import { log } from '../_assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()
    listen()

    const resp = await fetchCategoriesAndRecipes()
    let { categories, recipes } = resp

    categories = categories.map((c) => ({
      value: c.id,
      label: c.label,
    }))
    categories.unshift({ value: '', label: 'Category' })

    newState.set('main-documents', recipes)
    newState.set('recipe-categories', categories)
    newState.set('app-mode', 'left-panel')
    newState.set('default-page', 'recipes')
    window.newState = newState // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    console.trace(error)
    window.location.href = `../home/index.html?message=${error.message}`
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
  newState.on('icon-click:add-recipe', 'recipes', reactRecipeAdd)
  newState.on('icon-click:shop-ingredients', 'recipes', shopIngredients)
  newState.on('button-click:modal-delete-btn', 'recipes', reactRecipeDelete)
  newState.on('form-submit:left-panel-search', 'recipes', reactRecipeSearch)
  newState.on('recipe-categories', 'recipeGroup', (options) =>
    document.getElementById('recipe-category').setOptions(options)
  )
  newState.on('app-mode', 'recipes', (appMode) => {
    if (appMode === 'main-panel') populateRelatedRecipes()
  })
}

function listen() {
  // When recipe field loses focus
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })

  // When recipe category switch is toggled
  document.getElementById('related-switch').addEventListener('click', () => {
    document.getElementById('recipe-related').classList.toggle('hidden')
  })
}

/**
 * Add a recipe Recipe
 */
async function reactRecipeAdd() {
  const addBtn = document.getElementById('add-recipe')
  addBtn.disabled = true

  const { id, error } = await createRecipe()
  if (error) {
    console.error(`Recipes server error: ${error}`)
    return
  }

  const dateString = new Date().toISOString()

  const doc = {
    id,
    title: 'New Recipe',
    created_at: dateString,
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
async function reactRecipeSearch() {
  let resp

  const query = document.querySelector('[name="search-recipe"]').value?.trim()

  if (query.length) {
    resp = await searchRecipes(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentRecipes()
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
    const { error } = await updateRecipe({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    // log(message)
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }

  if (section === 'related') {
    populateRelatedRecipes()
  }
}

/**
 * Populate related recipes
 */
function populateRelatedRecipes() {
  const relatedListEl = document.getElementById('related-list')
  relatedListEl.deleteChildren()

  const ids = document.getElementById('recipe-related').value
  if (!ids) return

  const splitRegEx = /,|\n|\s/
  const idsArr = ids
    .split(splitRegEx)
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  if (!idsArr.length) return

  for (const id of idsArr) {
    if (!id.trim().length || id === 'undefined') {
      continue
    }

    const title = newState
      .get('main-documents')
      .find((doc) => doc.id === id).title
    relatedListEl.addChild(
      createMainDocumentItem({
        id,
        html: title,
      })
    )
  }
}

/**
 *
 */
function shopIngredients() {
  setMessage({ message: 'To be implemented...' })
}
