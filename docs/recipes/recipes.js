import { state } from '../js/state.js'
import { populateNav } from '../partials/nav.js'
import { populateFooter } from '../partials/footer.js'
import { setMessage, initUi, resizeTextarea, isMobile } from '../js/ui.js'
import { handleTokenQueryParam, getWebApp, postWebApp } from '../js/io.js'
import { filterIngredient, transformIngredient } from '../js/ingredients.js'
import { addItemsToShoppingList } from '../shopping/shopping.js'
import { MODAL, setDialog } from '../js/modal.js'

// ----------------------
// Globals
// ----------------------

const switchEl = document.querySelector('#related-recipes-switch')
const leftPanelToggle = document.querySelector('#left-panel-toggle')
const addRecipeBtn = document.querySelector('#add-recipe')
const shopIngredientsBtn = document.querySelector('#shop-ingredients')
const searchRecipesEl = document.querySelector('#search-recipes')
const searchRecipesMessageEl = document.querySelector('#search-recipes-message')
const recipeContainer = document.querySelector('#recipe-container')
const recipesList = document.querySelector('#recipes-list')
const recipeEl = document.querySelector('#recipe')
const recipeTitleEl = document.querySelector('#recipe-title')
const recipeRelated = document.querySelector('#recipe-related')
const relatedRecipesEl = document.querySelector('#related-recipe-links')
const recipeIngredients = document.querySelector('#recipe-ingredients')
const recipeMethod = document.querySelector('#recipe-method')
const recipeNotes = document.querySelector('#recipe-notes')
const recipeCategory = document.querySelector('#recipe-category')
const recipeTags = document.querySelector('#recipe-tags')
const recipeIdEl = document.querySelector('#recipe-id')
const recipeDeleteBtn = document.querySelector('#bottom-btn-group .fa-trash')

// ----------------------
// Event handlers
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

/* When related recipes switch is toggled */
switchEl.addEventListener('click', handleRelatedSwitchClick)

/* When recipes container is populated */
recipeContainer.addEventListener('recipes-loaded', handleRecipeContainerPopulated)

/* When the left panel toggle is clicked */
leftPanelToggle.addEventListener('click', () => {
  handleLeftPanelToggle()
})

/* When add recipe button is clicked */
addRecipeBtn.addEventListener('click', async () => {
  await handleRecipeCreate()
})

/* When shop ingredients button is clicked */
shopIngredientsBtn.addEventListener('click', async () => {
  handleShopIngredientsClick()
})

/* When search recipes input key down */
searchRecipesEl.addEventListener('keydown', async (e) => {
  await handleRecipeSearch(e)
})

/* When recipe field loses focus */
document.querySelectorAll('.field').forEach((field) => {
  field.addEventListener('change', (e) => {
    handleFieldChange(e.target)
  })
})

/* When related recipe is changed */
recipeRelated.addEventListener('change', (e) => {
  populateRelatedRecipes(e.target.value)
})

/* When the trash recipe button is clicked */
recipeDeleteBtn.addEventListener('click', handleRecipeDeleteBtnClick)

/* When a recipe is confirmed delete */
document.addEventListener('delete-recipe', handleDeleteRecipe)

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  initUi()

  const { recipes } = await getWebApp(`${state.getWebAppUrl()}/recipes-latest`)

  setMessage('')

  state.setRecipes(recipes)
  populateRecipes()

  populateNav({
    nav: document.querySelector('nav'),
    title: 'Recipes',
    active: 'recipes',
  })
  populateFooter()
}

/**
 * Handle related switch click
 */
function handleRelatedSwitchClick() {
  switchEl.classList.toggle('on')
  recipeRelated.classList.toggle('hidden')
  resizeTextarea(recipeRelated)
}

/**
 * Handle recipe container populated
 */
function handleRecipeContainerPopulated() {
  const recipeLinks = document.querySelectorAll('.recipe-link')
  for (const recipeLink of recipeLinks) {
    recipeLink.addEventListener('click', async (e) => {
      handleRecipeLinkClick(e.target)
    })
  }
}

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  addRecipeBtn.classList.toggle('hidden')
  shopIngredientsBtn.classList.toggle('hidden')
  document.querySelector('#recipe-action-buttons-group').classList.toggle('collapsed')
  searchRecipesEl.classList.toggle('hidden')
  recipesList.classList.toggle('hidden')
  document.querySelector('#recipe-left-sidebar').classList.toggle('collapsed')
}

/**
 * Handle recipe create
 */
async function handleRecipeCreate() {
  addRecipeBtn.disabled = true
  const { id } = await getWebApp(`${state.getWebAppUrl()}/recipe-create`)

  const newRecipe = {
    id,
    title: 'New recipe',
    ingredients: '',
    method: '',
    notes: '',
    category: '',
    tags: '',
    related: '',
  }
  state.push('recipes', newRecipe)

  const li = makeRecipeLinkEl(id, newRecipe.title)
  recipesList.appendChild(li)
  li.click()
  addRecipeBtn.disabled = false
}

/**
 * Handle recipe search
 */
async function handleRecipeSearch(e) {
  if (e.key !== 'Enter') {
    return
  }
  const value = e.target.value.toLowerCase().trim()
  if (value.length === 0) {
    return
  }
  searchRecipesMessageEl.textContent = 'Searching...'
  const { recipes } = await getSearchedRecipes(value)
  if (recipes.length === 0) {
    searchRecipesMessageEl.textContent = 'No recipes found'
  } else {
    searchRecipesMessageEl.textContent = ''
  }

  state.setRecipes(recipes)
  populateRecipes()
}

/**
 * Handle recipe field change
 */
async function handleFieldChange(elem) {
  // const recipeSection = elem.id.replace('recipe-', '')
  const recipeSection = elem.name
  if (recipeSection === 'title') {
    document.querySelector('.recipe-link.active').textContent = elem.value
  }
  const id = recipeIdEl.textContent
  state.setRecipeSection(id, recipeSection, elem.value)

  try {
    const { message, error } = await postWebApp(`${state.getWebAppUrl()}/recipe-update`, {
      id,
      value: elem.value,
      section: recipeSection,
    })
    if (error) {
      throw new Error(error)
    }
    console.log(message)
  } catch (err) {
    console.log(err)
  }
}

/**
 * Handle recipe link click
 */
async function handleRecipeLinkClick(elem) {
  shopIngredientsBtn.classList.remove('hidden')
  shopIngredientsBtn.disabled = false
  document.querySelector('.recipe-link.active')?.classList.remove('active')

  // hide the left panel if mobile
  if (isMobile()) {
    handleLeftPanelToggle()
  }

  // if this li is a related link then clicking it
  // needs to activate its li in the sidebar
  // so don't use: elem.classList.add('active')
  document.querySelector(`.recipe-link[data-id="${elem.dataset.id}"]`).classList.add('active')
  const recipeId = elem.dataset.id
  const recipe = state.getRecipeById(recipeId)
  if (!recipe) {
    console.log(`handleRecipeLinkClick error: Recipe not found for id: ${recipeId}`)
    console.log('recipes:', state.getRecipes())
    return
  }

  loadRecipe(recipe)
  const resp = await postWebApp(`${state.getWebAppUrl()}/recipe-access`, {
    id: recipeId,
  })
  const { message } = resp
  console.log(message)
}

/**
 * Handle button click to show delete modal
 */
function handleRecipeDeleteBtnClick() {
  setDialog({
    type: MODAL.DELETE_RECIPE,
    header: 'Delete recipe',
    body: `Delete the ${recipeTitleEl.value} recipe?`,
    id: recipeIdEl.innerText,
  })
  const dialog = document.querySelector('dialog')
  dialog.showModal()
}

/**
 * Handle delete recipe confirmation
 */
async function handleDeleteRecipe(e) {
  const modalMessageEl = document.querySelector('#modal-message')
  modalMessageEl.innerText = ''
  const id = e.detail.id
  const password = document.querySelector('#modal-delete-input').value
  const { error } = await getWebApp(`${state.getWebAppUrl()}/recipe-delete?id=${id}&password=${password}`)

  if (error) {
    modalMessageEl.innerText = error
    return
  }
  state.delete('recipes', id)
  document.querySelector(`.recipe-link[data-id="${id}"`).remove()
  console.log(`handleDeleteRecipe message: ${message}`)
  document.querySelector('dialog').close()
}

/**
 * Handle shop ingredients click
 */
async function handleShopIngredientsClick() {
  shopIngredientsBtn.disabled = true
  // get the recipe's ingredients
  const newItems = recipeIngredients.value.split('\n').map((i) => i.trim().toLowerCase())
  // get the server's shopping list
  let { shoppingList } = await getWebApp(`${state.getWebAppUrl()}/shopping`)
  // combine recipe ingredients with shopping list and dedup ingredients
  shoppingList = shoppingList.split(',').map((i) => i.trim().toLowerCase())
  const allItems = [...new Set([...newItems, ...shoppingList])].filter(Boolean)
  // updat the server's shopping list
  await postWebApp(`${state.getWebAppUrl()}/shopping-list-update`, {
    value: allItems.join(','),
  })
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Populate the recipes list
 */
function populateRecipes() {
  const recipes = state.getRecipes()
  if (!recipes) {
    console.log(`populateRecipes error: state does not have recipes: ${recipes}`)
    return
  }

  recipesList.innerHTML = ''
  for (const recipe of recipes) {
    const li = document.createElement('li')
    li.textContent = recipe.title
    li.classList.add('recipe-link')
    li.dataset.id = recipe.id
    recipesList.appendChild(li)
  }
  recipeContainer.dispatchEvent(new CustomEvent('recipes-loaded'))
}

/**
 * Load the recipe object to the page
 */
function loadRecipe(recipe) {
  if (switchEl.classList.contains('on')) {
    switchEl.dispatchEvent(new Event('click'))
  }

  switchEl.classList.remove('on')
  recipeEl.classList.remove('hidden')
  recipeTitleEl.value = recipe.title
  recipeRelated.value = recipe.related
  populateRelatedRecipes(recipe.related)
  recipeIngredients.value = recipe.ingredients
  resizeTextarea(recipeIngredients)
  recipeMethod.value = recipe.method
  resizeTextarea(recipeMethod)
  recipeNotes.value = recipe.notes
  resizeTextarea(recipeNotes)
  recipeCategory.value = recipe.category || ''
  resizeTextarea(recipeCategory)
  recipeTags.value = recipe.tags
  resizeTextarea(recipeTags)
  recipeIdEl.textContent = recipe.id
}

/**
 * Get the searched recipes
 */
async function getSearchedRecipes(q) {
  const data = await getWebApp(`${state.getWebAppUrl()}/recipes-search?q=${q}`)

  const { recipes, message } = data
  if (message) {
    console.log(`getSearchedRecipes error: ${message}`)
    return { error: message }
  }
  return { recipes }
}

/**
 * Populate related recipes
 */
function populateRelatedRecipes(ids) {
  relatedRecipesEl.innerHTML = ''
  if (!ids) {
    return
  }
  const splitRegEx = /,|\n|\s/
  const idsArr = ids
    .split(splitRegEx)
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
  const ulEl = document.createElement('ul')

  for (const id of idsArr) {
    const recipe = state.getRecipeById(id)
    if (!recipe) {
      console.log(`populateRelatedRecipes: Oops, id ${id} was not found`)
      continue
    }
    const title = recipe.title
    const li = makeRecipeLinkEl(id, title)
    ulEl.appendChild(li)
  }
  relatedRecipesEl.appendChild(ulEl)
}

/**
 * Make a recipe link element
 */
function makeRecipeLinkEl(id, title) {
  const li = document.createElement('li')
  li.textContent = title
  li.classList.add('recipe-link')
  li.dataset.id = id
  li.addEventListener('click', () => {
    handleRecipeLinkClick(li)
  })
  return li
}
