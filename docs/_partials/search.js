import { createFormHorizontal } from './formHorizontal.js'
import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createSearch({
  id,
  className,
  value,
  iconClass,
  placeholder,
  searchCb,
  searchResultsCb,
  searchEntity = { singular: 'entry', plural: 'entries' },
} = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  el.setSearchMessage = setSearchMessage.bind(el)

  value && (el.value = value)
  id && (el.dataId = id)
  className && (el.classes = className)
  searchCb && (el._searchCb = searchCb)
  searchEntity && (el._searchEntity = searchEntity)
  searchResultsCb && (el._searchResultsCb = searchResultsCb)

  addElementParts({ el, iconClass, placeholder })
  addEventHandlers(el)

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
async function handleFormSubmit({ e, el }) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const value = formData.get('search').trim()
  if (value.length === 0) {
    return
  }

  el.message = 'Searching...'

  const results = await el._searchCb(value)

  // remove from counting the hidden results such as related recipes
  // that must ne set to hidden in the left pane list by default
  const cleanResults = results.filter((r) => !r.hidden)

  el.setSearchMessage(cleanResults)

  // return all results, including the hidden ones
  el._searchResultsCb(results)
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Set the search results count
 */
function setSearchMessage(arr) {
  const count = arr.length
  const entity =
    count === 1 ? this.searchEntity.singular : this.searchEntity.plural
  this.message = `${count} ${entity} found`
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts({ el, iconClass, placeholder }) {
  const searchForm = createFormHorizontal({
    inputType: 'search',
    inputName: 'search',
    placeholder,
    formIconClass: iconClass,
  })

  el.appendChild(searchForm)
}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers(el) {
  el.querySelector('form').addEventListener('submit', (e) =>
    handleFormSubmit({
      e,
      el,
    })
  )
}
