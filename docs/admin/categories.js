import { getWebApp, postWebAppJson } from '../js/io.js'
import { state } from '../js/state.js'
import { createField } from '../partials/formField.js'
import { createFormHorizontal } from '../partials/formHorizontal.js'
import { createSuperList } from '../partials/superList.js'
import { createSuperListItem } from '../partials/superListItem.js'
import { createSwitch } from '../partials/switch.js'

// -------------------------------
// Globals
// -------------------------------

const mainPanelEl = document.querySelector('#main-panel')
let categoriesEl
let categoryFormEl
let sortSwitch
let template
let clone

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Get and display all recipe categories
 */
export async function listRecipeCategories() {
  const { categories } = await getWebApp(
    `${state.getWebAppUrl()}/recipes/categories/read`
  )

  mainPanelEl.innerHTML = ''

  // set the add category form
  categoryFormEl = createFormHorizontal({
    formId: 'add-category-form',
    inputType: 'text',
    inputName: 'category',
    inputPlaceholder: 'Add category',
    iClass: 'fa-box-archive',
    submitText: 'Add',
    disabled: true,
    events: {
      keyup: handleCategoryInputKeyUp,
    },
  })
  categoryFormEl.addEventListener('submit', handleCategoryFormSubmit)
  mainPanelEl.appendChild(categoryFormEl)

  // add the sort switch wrapper and element
  template = document.querySelector('#top-switches-template')
  clone = template.content.cloneNode(true)
  mainPanelEl.appendChild(clone)
  const switchWrapper = document.querySelector('[data-role="top-switches"]')
  sortSwitch = createSwitch({ id: 'sort-switch' })
  sortSwitch.addEventListener('click', handleSortSwitchClick)
  let field = createField({
    element: sortSwitch,
    label: 'Sort',
    labelPosition: 'left',
  })
  switchWrapper.appendChild(field)

  // create the categories super list
  categoriesEl = createSuperList({
    id: 'categories-list',
    className: 'main-super-list-wrapper u-mb-20',
    draggable: true,
  })
  categoriesEl.addEventListener(
    'selection-changed',
    handleCategorySelectionChange
  )
  categoriesEl.addEventListener('list-changed', handleCategoriesListChange)
  mainPanelEl.appendChild(categoriesEl)

  // popualte the categories super list
  for (const { id, label: text } of categories) {
    const cat = createSuperListItem({
      text,
      id,
      textColor: 'var(--gray6)',
      bgColor: 'var(--purple2)',
    })
    categoriesEl.appendChild(cat)
  }
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  if (sortSwitch.isOn()) {
    categoriesEl.enableDragging()
  } else {
    categoriesEl.enableClicking()
  }
}

/**
 * Handle key up
 */
function handleCategoryInputKeyUp(e) {
  const categoryFormEl = e.target.closest('.form-horizontal-wrapper')
  const value = categoryFormEl.getValue().trim()
  if (value.length) {
    categoryFormEl.enable()
  } else {
    categoryFormEl.disable()
  }
}

/**
 *
 */
function handleCategoryFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(categoryFormEl.querySelector('form'))
  const category = formData.get('category').trim().toLowerCase()
  if (!category.length) {
    return
  }

  const selectedItem = categoriesEl.getSelected()
  if (selectedItem) {
    categoriesEl.updateItem(selectedItem.getAttribute('id'), category)
  } else {
    const cat = createSuperListItem({
      text: category,
      id: crypto.randomUUID(),
      textColor: 'var(--gray6)',
      bgColor: 'var(--purple2)',
    })
    categoriesEl.addChild(cat, 'top')
  }
}

/**
 * Handle click/unclick of category item
 */
function handleCategorySelectionChange(e) {
  const { selected, value } = e.detail
  if (selected) {
    categoryFormEl.setValue(value)
    categoryFormEl.setSubmit({ text: 'UPDATE' })
    categoryFormEl.enable()
  } else {
    categoryFormEl.setValue('')
    categoryFormEl.setSubmit({ text: 'ADD' })
    categoryFormEl.disable()
  }
}

/**
 *
 */
function handleCategoriesListChange() {
  const items = categoriesEl.getData()
  console.log('items', items)
}
