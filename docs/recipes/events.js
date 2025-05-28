/* 
  This module handles recipe events so that the recipes.js stays leaner. 
  This module loads aftr all dynamic fields have been created.
*/

import { state } from '../js/state.js'
import { getEl, isMobile, resizeTextarea } from '../js/ui.js'
import { getWebApp, postWebAppJson } from '../js/io.js'
import { createMenuItem } from '../partials/menuItem.js'

// ----------------------
// Exports
// ----------------------

/**
 * Set multiple the event handlers of the recipes page
 */
export function setEvents() {
  /* When recipes array state changes */
  document.addEventListener('recipes-state-changed', handleRecipesStateChanged)

  /* When active recipe state changes */
  document.addEventListener(
    'active-recipe-state-changed',
    handleActiveRecipeStateChanged
  )

  /* When recipe field loses focus */
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })

  /* When new recipe is created */
  getEl('add-recipe').addEventListener('click', handleRecipeCreate)

  /* When related recipe is changed */
  getEl('recipe-related').addEventListener('change', populateRelatedRecipes)

  /* When the trash recipe button is clicked */
  getEl('bottom-btn-group')
    .querySelector('.fa-trash')
    .addEventListener('click', handleRecipeDeleteBtnClick)

  /* When a recipe is confirmed delete */
  document.addEventListener('delete-confirmed', handleDeleteRecipe)

  /* When shop-ingredients button is clicked */
  getEl('shop-ingredients').addEventListener(
    'click',
    handleShopIngredientsClick
  )
}

// ----------------------
// Event handlers
// ----------------------

/**
 * This reactive function is called when the document receives
 * recipes-state-changed event from state.set('reicpes).
 */
function handleRecipesStateChanged(e) {
  if (isMobile()) {
    getEl('main-icon-group').expand()
  }

  const children = e.detail.map((recipe) =>
    createMenuItem({
      id: recipe.id,
      value: recipe.title,
      // related recipes are hidden until
      // clicked on in the related recipes recipe section
      hidden: recipe.hidden,
      events: { click: handleRecipeLinkClick },
    })
  )
  getEl('left-panel-list').deleteChildren().addChildren(children)
  if (!state.get('active-recipe')) {
    return
  }

  // select the active recipe if it exists in the updated list
  const priorRecipe = getEl('left-panel-list').getChildById(
    state.get('active-recipe')
  )
  if (!priorRecipe) {
    state.set('active-recipe', null)
    return
  }
  priorRecipe.selected = true
}

/**
 * This reactive function is called when the document receives
 * active-recipe-state-changed event from state.set('active-recipe).
 */
async function handleActiveRecipeStateChanged(e) {
  const id = e.detail
  if (!id) {
    // active recipe has been cleared
    getEl('main-icon-group').expand()
    return
  }

  // select item in left links list in case this
  // click was a related recipe link click
  let leftPanelItem = getEl('left-panel-list').getChildById(id)

  // related links are hidden by default in the left
  // pane list
  leftPanelItem.hidden = false
  leftPanelItem.selected = true

  // Handle main-panel
  const recipeIngredients = getEl('recipe-ingredients')
  const recipeMethod = getEl('recipe-method')
  const recipeNotes = getEl('recipe-notes')
  const recipeTags = getEl('recipe-tags')
  const recipeIdEl = getEl('recipe-id')
  const categorySelect = getEl('recipe-category')

  const recipe = state.getRecipeById(id)

  getEl('related-recipes-switch').setOff()
  getEl('main-panel').classList.remove('hidden')
  getEl('recipe-title').value = recipe.title
  getEl('recipe-related').value = recipe.related
  populateRelatedRecipes()
  recipeIngredients.value = recipe.ingredients
  resizeTextarea(recipeIngredients)
  recipeMethod.value = recipe.method
  resizeTextarea(recipeMethod)
  recipeNotes.value = recipe.notes
  resizeTextarea(recipeNotes)
  if (categorySelect.hasOptionValue(recipe.category)) {
    categorySelect.selectByValue(recipe.category)
  } else {
    categorySelect.unselect()
  }

  recipeTags.value = recipe.tags
  resizeTextarea(recipeTags)
  recipeIdEl.textContent = recipe.id

  const resp = await postWebAppJson(
    `${state.getWebAppUrl()}/recipes/update-access`,
    {
      id,
    }
  )
  const { message } = resp
  console.log(message)
}

/**
 * Handle recipe create
 */
async function handleRecipeCreate() {
  getEl('add-recipe').disabled = true
  const { id } = await getWebApp(`${state.getWebAppUrl()}/recipes/create`)

  const newRecipe = {
    id,
    title: 'New recipe',
    ingredients: '',
    method: '',
    notes: '',
    tags: '',
    related: '',
  }
  getEl('recipe-category').unselect()
  state.push('recipes', newRecipe)
  state.set('active-recipe', id)
}

/**
 * Handle recipe field change
 */
async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value
  let id

  if (section === 'title') {
    value = value.toLowerCase()
    getEl('left-panel-list').getSelected().value = value
  }

  id = getEl('recipe-id').textContent
  state.setRecipeSection(id, section, value)

  try {
    const { status, message } = await postWebAppJson(
      `${state.getWebAppUrl()}/recipes/update`,
      { id, section, value }
    )
    if (status !== 200) {
      throw new Error(message)
    }
    console.log(message)
  } catch (err) {
    console.trace(err)
    console.log('id:', id)
    console.log('section:', section)
    console.log('value:', value)
  }
}

/**
 * Populate related recipes
 */
function populateRelatedRecipes() {
  getEl('related-recipes-list').deleteChildren()

  const ids = getEl('recipe-related').value
  if (!ids) {
    return
  }
  const splitRegEx = /,|\n|\s/
  const idsArr = ids
    .split(splitRegEx)
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  for (const id of idsArr) {
    if (!id.trim().length || id === 'undefined') {
      continue
    }
    const recipe = state.getRecipeById(id)
    if (!recipe) {
      console.warn(`populateRelatedRecipes: Oops, id "${id}" was not found`)
      continue
    }
    const title = recipe.title
    getEl('related-recipes-list').addChild(
      createMenuItem({
        id,
        value: title,
        events: { click: handleRecipeLinkClick },
      })
    )
  }
}

/**
 * Handle recipe link click.
 */
async function handleRecipeLinkClick(e) {
  // hide the left panel if mobile
  if (isMobile()) {
    getEl('main-icon-group').collapse()
  }

  const elem = e.target.closest('.menu-item')
  state.set('active-recipe', elem.dataId)
}

/**
 * Handle button click to show delete modal
 */
function handleRecipeDeleteBtnClick() {
  const modal = document.querySelector('dialog[data-id="modal-delete"]')
  const title = getEl('recipe-title').value
  modal.body = `Delete recipe "${title}"?`
  modal.showModal()
}

/**
 * Handle delete recipe confirmation
 */
async function handleDeleteRecipe() {
  const modal = getEl('modal-delete')
  modal.message = ''

  const id = getEl('recipe-id').value
  const password = getEl('modal-delete-input').value
  const { error } = await getWebApp(
    `${state.getWebAppUrl()}/recipes/delete?id=${id}&password=${password}`
  )

  if (error) {
    modal.message = error
    return
  }
  modal.close()
  state.delete('recipes', id)
  getEl('left-panel-list').deleteChild(id)
  getEl('main-panel').hidden = true
}

/**
 * Handle shop ingredients click
 */
async function handleShopIngredientsClick(e) {
  e.target.disabled = true
  // get the recipe's ingredients
  const newItems = getEl('recipe-ingredients')
    .value.split('\n')
    .map((i) => i.trim().toLowerCase())
  if (!newItems.length || newItems[0] === '') {
    return
  }
  // get the server's shopping list
  let { shoppingList } = await getWebApp(
    `${state.getWebAppUrl()}/shopping/read`
  )
  // combine recipe ingredients with shopping list and dedup ingredients
  shoppingList = shoppingList.split(',').map((i) => i.trim().toLowerCase())
  const allItems = [...new Set([...newItems, ...shoppingList])].filter(Boolean)
  // updat the server's shopping list
  await postWebAppJson(`${state.getWebAppUrl()}/shopping/update`, {
    value: allItems.join(','),
  })
}
