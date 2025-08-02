import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { createMainDocumentItem } from '../assets/partials/mainDocumentItem.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createRecipe,
  deleteRecipe,
  fetchCategoriesAndRecipes,
  fetchRecentRecipes,
  searchRecipes,
  updateRecipe,
  updateRecipeAccess,
} from './recipes.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()
    listen()

    let [{ categories, recipes }, { user }] = await Promise.all([
      fetchCategoriesAndRecipes(),
      getMe(),
    ])

    categories = categories.map((c) => ({
      value: c.id,
      label: c.label,
    }))
    categories.unshift({ value: '', label: 'Category' })

    setMessage()
    state.set('main-documents', recipes)
    state.set('recipe-categories', categories)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'recipes')
    window.state = state // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    console.trace(error)
  }
})

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

function react() {
  state.on('icon-click:add-recipe', 'recipes', reactRecipeAdd)

  state.on('icon-click:shop-ingredients', 'recipes', shopIngredients)

  state.on('button-click:modal-delete-btn', 'recipes', reactRecipeDelete)

  state.on('form-submit:left-panel-search', 'recipes', reactRecipeSearch)

  state.on('active-doc', 'recipes', async (id) => {
    if (id) {
      updateRecipeAccess(id)
      // fore list to update itself
      const { recipes } = await fetchRecentRecipes()
      state.set('main-documents', recipes)
    }
  })

  state.on('recipe-categories', 'recipes', (options) =>
    document.getElementById('recipe-category').setOptions(options)
  )

  state.on('app-mode', 'recipes', (appMode) => {
    if (appMode === 'main-panel') populateRelatedRecipes()
  })

  state.on('field-changed', 'recipes', handleFieldChange)
}

function listen() {
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

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

async function reactRecipeDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const password = modalEl.getPassword()
  const { error } = await deleteRecipe(id, password)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.setPassword('')
  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

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
  state.set('main-documents', data)
}

/**
 * Handle Recipe field change
 */

async function handleFieldChange(el) {
  const section = el.name
  let value = el.value

  const id = state.get('active-doc')
  const docs = state.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  try {
    const { error } = await updateRecipe({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    setMessage({ message: 'Saved', type: 'quiet' })
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

    const title = state.get('main-documents').find((doc) => doc.id === id).title
    relatedListEl.addChild(
      createMainDocumentItem({
        id,
        html: title,
      })
    )
  }
}

function shopIngredients() {
  setMessage({ message: 'To be implemented...' })
}
