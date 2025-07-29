import { getWebApp, postWebAppJson } from '../js/io.js'
import { state } from '../js/state.js'
import { createFormField } from '../assets/partials/formField.js'
import { createFormHorizontal } from '../assets/partials/formHorizontal.js'
import { createIcon } from '../assets/partials/icon.js'
import { createList } from '../assets/partials/list.js'
import { createListItem } from '../assets/partials/listItem.js'
import { createSwitch } from '../assets/partials/switch.js'
// import { log } from '../js/logger.js'

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
    id: 'add-category-form',
    inputType: 'text',
    inputName: 'category',
    inputPlaceholder: 'Add category',
    iconClass: 'fa-box-archive',
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
  let field = createFormField({
    element: sortSwitch,
    label: 'Sort',
    labelPosition: 'left',
  })
  switchWrapper.appendChild(field)

  // create the categories super list
  categoriesEl = createList({
    id: 'categories-list',
    className: 'outer-wrapper u-mb-20',
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
    const cat = createListItem({
      title: text,
      id,
      textColor: 'var(--gray6)',
      bgColor: 'var(--purple2)',
      children: [
        createIcon({
          className: 'fa-trash hidden',
          events: { click: handleCategoryTrashClick },
        }),
      ],
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
  if (sortSwitch.value) {
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

function handleCategoryFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(categoryFormEl.querySelector('form'))
  const category = formData.get('category').trim().toLowerCase()
  if (!category.length) {
    return
  }

  const selectedItem = categoriesEl.getSelected()
  if (selectedItem) {
    categoriesEl.updateChild(selectedItem.getAttribute('id'), category)
  } else {
    const cat = createListItem({
      title: category,
      id: `ev${crypto.randomUUID()}`,
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
  const { selected } = e.detail
  if (selected) {
    categoryFormEl.setValue('')
    categoryFormEl.disable()
  }
}

async function handleCategoriesListChange() {
  const categories = categoriesEl.getData()
  const { status, message } = await postWebAppJson(
    `${state.getWebAppUrl()}/recipes/categories/update`,
    { categories }
  )

  console.log('status', status)
  console.log('message', message)
}

/**
 * Handle the category trash click
 */
function handleCategoryTrashClick(e) {
  const el = e.target.closest('.list-item')
  const id = el.getAttribute('id')
  categoriesEl.deleteChild(id)
}
