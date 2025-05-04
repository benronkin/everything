import { state } from '../js/state.js'
import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createLeftPanelLink } from '../partials/leftPanelLink.js'
import { createIcon } from '../partials/icon.js'
import { createMainIconGroup } from '../partials/mainIconGroup.js'
import { createRightDrawer } from '../partials/rightDrawer.js'
import { createSwitch } from '../partials/switch.js'
import { MODAL, initDialog, setDialog } from '../partials/modal.js'
import { setMessage, resizeTextarea, isMobile } from '../js/ui.js'
import { handleTokenQueryParam, getWebApp, postWebAppJson } from '../js/io.js'

// ----------------------
// Globals
// ----------------------

const searchRecipesEl = document.querySelector('#search-recipes')
const searchRecipesMessageEl = document.querySelector('#search-recipes-message')
const columnsContainer = document.querySelector('#columns-container')
const leftPanelList = document.querySelector('#left-panel-list')
const mainPanelEl = document.querySelector('#main-panel')
const recipeTitleEl = document.querySelector('#recipe-title')
const recipeRelated = document.querySelector('#recipe-related')
const relatedRecipesEl = document.querySelector('#related-recipes-links')
const recipeIngredients = document.querySelector('#recipe-ingredients')
const recipeMethod = document.querySelector('#recipe-method')
const recipeNotes = document.querySelector('#recipe-notes')
const recipeCategory = document.querySelector('#recipe-category')
const recipeTags = document.querySelector('#recipe-tags')
const recipeIdEl = document.querySelector('#recipe-id')
const recipeDeleteBtn = document.querySelector('#bottom-btn-group .fa-trash')
let mainIconGroup
let addRecipeBtn
let shopIngredientsBtn

// ----------------------
// Event handlers
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

/* When search recipes input key down */
searchRecipesEl.addEventListener('keydown', handleRecipeSearch)

/* When recipe field loses focus */
document.querySelectorAll('.field').forEach((field) => {
  field.addEventListener('change', handleFieldChange)
})

/* When related recipe is changed */
recipeRelated.addEventListener('change', populateRelatedRecipes)

/* When the trash recipe button is clicked */
recipeDeleteBtn.addEventListener('click', handleRecipeDeleteBtnClick)

/* When a recipe is confirmed delete */
document.addEventListener('delete-confirmed', handleDeleteRecipe)

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

  setMessage('Loading...')

  const { recipes } = await getWebApp(`${state.getWebAppUrl()}/recipes/latest`)

  setMessage('')

  state.setRecipes(recipes)
  populateRecipes()

  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({ title: 'Recipes' })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'recipes' })
  document.querySelector('main').prepend(rightDrawerEl)

  mainIconGroup = createMainIconGroup({
    elements: [createIcon({ id: 'add-recipe', className: 'fa-plus' }), createIcon({ id: 'shop-ingredients', className: 'fa-cart-plus' })],
  })
  document.querySelector('#main-icon-group-wrapper').appendChild(mainIconGroup)
  addRecipeBtn = document.querySelector('#add-recipe')
  addRecipeBtn.addEventListener('click', handleRecipeCreate)

  shopIngredientsBtn = document.querySelector('#shop-ingredients')
  shopIngredientsBtn.addEventListener('click', handleShopIngredientsClick)

  const switchEl = createSwitch({ id: 'related-recipes-switch', classList: ['ml-20'] })
  switchEl.addEventListener('click', handleRelatedSwitchClick)
  document.querySelector('#related-recipes-header').appendChild(switchEl)

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)
  initDialog()

  state.setDefaultPage('recipes')

  if (isMobile()) {
    mainPanelEl.classList.add('hidden')
  }
}

/**
 * Handle related switch click
 */
function handleRelatedSwitchClick() {
  recipeRelated.classList.toggle('hidden')
  resizeTextarea(recipeRelated)
}

/**
 * Handle recipe create
 */
async function handleRecipeCreate() {
  addRecipeBtn.disabled = true
  const { id } = await getWebApp(`${state.getWebAppUrl()}/recipes/create`)

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

  const li = createLeftPanelLink({ id, title: newRecipe.title, cb: handleLeftPanelLinkClick })
  leftPanelList.appendChild(li)
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
  // hide the left panel if mobile
  if (isMobile()) {
    mainIconGroup.expand()
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
async function handleFieldChange(e) {
  const elem = e.target
  const recipeSection = elem.name
  if (recipeSection === 'title') {
    document.querySelector('.left-panel-link.active').textContent = elem.value
  }
  const id = recipeIdEl.textContent
  state.setRecipeSection(id, recipeSection, elem.value)

  try {
    const { message, error } = await postWebAppJson(`${state.getWebAppUrl()}/recipes/update`, {
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
async function handleLeftPanelLinkClick(elem) {
  shopIngredientsBtn.classList.remove('hidden')
  shopIngredientsBtn.disabled = false

  const recipeId = elem.dataset.id
  const recipe = state.getRecipeById(recipeId)
  if (!recipe) {
    console.log(`handleLeftPanelLinkClick error: Recipe not found for id: ${recipeId}`)
    console.log('recipes:', state.getRecipes())
    return
  }

  loadRecipe(recipe)
  const resp = await postWebAppJson(`${state.getWebAppUrl()}/recipes/update-access`, {
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
    type: MODAL.DELETE,
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
  console.log('here')
  const modalMessageEl = document.querySelector('#modal-message')
  modalMessageEl.innerText = ''
  const id = e.detail.id
  const password = document.querySelector('#modal-delete-input').value
  const { error } = await getWebApp(`${state.getWebAppUrl()}/recipes/delete?id=${id}&password=${password}`)

  if (error) {
    modalMessageEl.innerText = error
    return
  }
  state.delete('recipes', id)
  document.querySelector(`.left-panel-link[data-id="${id}"`).remove()
  document.querySelector('dialog').close()
  mainPanelEl.classList.add('hidden')
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
  await postWebAppJson(`${state.getWebAppUrl()}/shopping/update`, {
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

  leftPanelList.innerHTML = ''
  for (const { id, title } of recipes) {
    const li = createLeftPanelLink({ id, title, cb: handleLeftPanelLinkClick })
    leftPanelList.appendChild(li)
  }
  columnsContainer.dispatchEvent(new CustomEvent('recipes-loaded'))
}

/**
 * Load the recipe object to the page
 */
function loadRecipe(recipe) {
  document.querySelector('#related-recipes-switch').setOff()

  mainPanelEl.classList.remove('hidden')
  recipeTitleEl.value = recipe.title
  recipeRelated.value = recipe.related
  populateRelatedRecipes()
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
  const data = await getWebApp(`${state.getWebAppUrl()}/recipes/search?q=${q}`)

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
function populateRelatedRecipes() {
  const ids = recipeRelated.value

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
    const li = createLeftPanelLink({ id, title, cb: handleLeftPanelLinkClick })
    ulEl.appendChild(li)
  }
  relatedRecipesEl.appendChild(ulEl)
}
