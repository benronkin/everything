import { state } from '../assets/js/state.js'
import { toolbar } from './sections/toolbar.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { nav } from './sections/nav.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createRecipe,
  fetchCategoriesAndRecipes,
  fetchRecentRecipes,
  fetchRecipesByCategory,
  searchRecipes
} from './recipes.api.js'

// Refresh recipes when Back/Forward restores this page from cache,
// preserving the current search query and selected category.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage('Loading...')

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    let [{ categories, recipes }, { user }] = await Promise.all([
      fetchCategoriesAndRecipes(),
      getMe()
    ])

    categories = categories.map((c) => ({
      value: c.id,
      label: c.label
    }))
    categories.unshift({ value: '', label: 'Category' })

    setMessage()
    state.set('recipe-categories', categories)
    state.set('main-documents', recipes)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'recipes')

    if (document.querySelector('[name="search-recipe"]').value.trim()) {
      await reactRecipeSearch()
    }

    window.state = state // avail to browser console
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.title = 'Recipes | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper'
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(createRightDrawer({ active: 'recipes' }))
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('icon-click:add-recipe', 'recipes', reactRecipeAdd)

  state.on('form-submit:left-panel-search', 'recipes', reactRecipeSearch)

  state.on('field-changed', 'recipes', handleFieldChange)
}

/**
 * Add a recipe Recipe
 */
async function reactRecipeAdd({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  setMessage('Creating a new recipe...')

  const { id, error } = await createRecipe()
  if (error) {
    console.error(`Recipes server error: ${error}`)
    return
  }

  window.location.href = `./recipe.html?id=${id}`
}

/**
 *
 */
async function reactRecipeSearch() {
  let resp

  const query = document.querySelector('[name="search-recipe"]').value?.trim()

  state.set('search-action', Boolean(query.length))

  if (query.length) {
    resp = await searchRecipes(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentRecipes()
  }

  const { recipes, message } = resp
  if (message) {
    console.error(`Recipe server error: ${message}`)
    return
  }
  state.set('main-documents', recipes)
}

/**
 *
 */
async function handleFieldChange(el) {
  let value = el.value
  const name = el.name

  if (name === 'category-filter') {
    handleCategoryChange(value)
    return
  }
}

/**
 *
 */
async function handleCategoryChange(id) {
  let resp
  if (!id) {
    resp = await fetchRecentRecipes()
  } else {
    resp = await fetchRecipesByCategory(id)
  }

  const { recipes } = resp

  state.set('main-documents', recipes)
  state.set('app-mode', 'left-panel')
}
