/*
  Event handlers are loaded from events.js for convenience. 
*/

import { state } from '../js/state.js'
import { getEl, setMessage, resizeTextarea, isMobile } from '../js/ui.js'
import { setEvents } from './events.js'
import { createNav } from '../sections/nav.js'
import { createFooter } from '../sections/footer.js'
import { createFormField } from '../partials/formField.js'
import { createIcon } from '../partials/icon.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createModalDelete } from '../sections/modalDelete.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { createSearch } from '../partials/search.js'
import { createSelect } from '../partials/select.js'
import { createSwitch } from '../partials/switch.js'
import { createList } from '../partials/list.js'
import { handleTokenQueryParam, getWebApp } from '../js/io.js'

// ----------------------
// Event handlers
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  setMessage({ message: 'Loading...' })

  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  const [recipesResp, categoriesResp] = await Promise.all([
    getWebApp(`${state.getWebAppUrl()}/recipes/latest`),
    getWebApp(`${state.getWebAppUrl()}/recipes/categories/read`),
  ])

  const { recipes } = recipesResp
  let { categories } = categoriesResp
  categories = categories.map((c) => ({
    value: c.id,
    label: c.label,
  }))
  categories.unshift({ value: '', label: '' })

  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({
    title: '<i class="fa-solid fa-cake-candles"></i> Recipes',
  })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'recipes' })
  document.querySelector('main').prepend(rightDrawerEl)

  const mainIconGroup = createMainIconGroup({
    shouldAllowCollapse: {
      message: 'Select a recipe first',
      cb: () => !!state.get('active-recipe'),
    },
    children: [
      createIcon({ id: 'add-recipe', className: 'fa-plus' }),
      createIcon({ id: 'shop-ingredients', className: 'fa-cart-plus' }),
    ],
  })
  getEl('main-icon-group-wrapper').appendChild(mainIconGroup)

  getEl('left-panel').prepend(
    createSearch({
      iconClass: 'fa-magnifying-glass',
      placeholder: 'Search recipes',
      searchCb: searchRecipes,
      searchResultsCb: handleSearchResult,
    })
  )

  getEl('left-panel').appendChild(
    createList({
      id: 'left-panel-list',
      itemClass: 'menu-item',
    })
  )

  getEl('related-recipes-header').appendChild(
    createSwitch({
      id: 'related-recipes-switch',
      classList: ['u-ml-20'],
      events: {
        click: function () {
          getEl('recipe-related').classList.toggle('hidden')
          resizeTextarea(getEl('recipe-related'))
        },
      },
    })
  )

  getEl('related-links-wrapper').appendChild(
    createList({
      id: 'related-recipes-list',
      itemClass: 'menu-item',
    })
  )

  const categoryFormField = createFormField({
    element: createSelect({
      id: 'recipe-category',
      name: 'category',
      className: 'field',
      options: categories,
    }),
    label: 'category',
    labelPosition: 'top',
    fieldClasses: ['u-column-start'],
    labelClasses: ['u-h5'],
    labelFor: 'recipe-category',
  })
  getEl('category-target').appendChild(categoryFormField)

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  document.querySelector('body').appendChild(
    createModalDelete({
      header: 'Delete recipe',
      body: `Delete the ${getEl('recipe-title').value} recipe?`,
      id: 'modal-delete',
      password: true,
    })
  )

  if (isMobile()) {
    getEl('main-panel').classList.add('hidden')
  }

  // imported from the events.js module
  setEvents()

  // must run after recipes-state-changed EH is added
  // so as to trigger recipe list population
  state.setRecipes(recipes)
  state.setDefaultPage('recipes')

  setMessage()
}

// ------------------------
// Helpers
// ------------------------

/**
 * Get the searched recipes
 */
async function searchRecipes(q) {
  const data = await getWebApp(
    `${state.getWebAppUrl()}/recipes/search?q=${q.trim().toLowerCase()}`
  )

  const { recipes, message } = data
  if (message) {
    console.log(`searchRecipes error: ${message}`)
    return message
  }
  return recipes
}

/**
 * Handle results coming from the search partial
 */
async function handleSearchResult(results) {
  state.setRecipes(results)
}
