import { createFormHorizontal } from '../partials/form-horizontal.js'
import { getWebApp, postWebAppJson } from '../js/io.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const mainPanelEl = document.querySelector('#main-panel')

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Get all recipe categories
 */
export async function listRecipeCategories() {
  const { categories } = await getWebApp(`${state.getWebAppUrl()}/recipes/categories/read`)

  mainPanelEl.innerHTML = ''
  const addCategoryFormEl = createFormHorizontal({
    formId: 'add-category-form',
    inputType: 'text',
    inputName: 'add-category-input',
    inputPlaceholder: 'Add category',
    iClass: 'box-archive',
    submitText: 'Add',
  })
  addCategoryFormEl.style.width = '300px'
  mainPanelEl.appendChild(addCategoryFormEl)
  console.log('categories', categories)
}
