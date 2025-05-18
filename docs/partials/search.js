import { createFormHorizontal } from './formHorizontal.js'
import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported
// -------------------------------

/**
 *
 */
export function createSearch(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
async function handleFormSubmit({ e, wrapper, searchCb, searchResultsCb }) {
  e.preventDefault()
  const message = wrapper.querySelector('.message')

  const formData = new FormData(e.target)
  const value = formData.get('search').trim()
  if (value.length === 0) {
    return
  }

  message.textContent = 'Searching...'

  const results = await searchCb(value)
  if (results.length === 0) {
    message.textContent = 'No results found'
  } else {
    message.textContent = `${results.length} results found`
  }
  searchResultsCb(results)
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ searchCb, searchResultsCb }) {
  const wrapper = document.createElement('div')
  wrapper.className = 'search-wrapper'

  const searchForm = createFormHorizontal({
    inputType: 'search',
    inputName: 'search',
    inputPlaceholder: 'Search recipes',
    iClass: 'fa-magnifying-glass',
  })

  wrapper.appendChild(searchForm)
  wrapper
    .querySelector('form')
    .addEventListener('submit', (e) =>
      handleFormSubmit({ e, wrapper, searchCb, searchResultsCb })
    )

  return wrapper
}
