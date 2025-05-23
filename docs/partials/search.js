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
export function createSearch({
  iconClass,
  placeholder,
  searchCb,
  searchResultsCb,
}) {
  injectStyle(css)

  const wrapper = document.createElement('div')

  const searchForm = createFormHorizontal({
    inputType: 'search',
    inputName: 'search',
    placeholder,
    formIconClass: iconClass,
  })

  wrapper.appendChild(searchForm)
  wrapper
    .querySelector('form')
    .addEventListener('submit', (e) =>
      handleFormSubmit({ e, wrapper, searchCb, searchResultsCb })
    )

  return wrapper
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
