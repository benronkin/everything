import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
input {
  border-radius: var(--border-radius);
  border: none;
  background: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  padding: 7px 3px;
}
`

// const html = `
// `

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createInput(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Constructor
// -------------------------------

/**
 *
 */
function createElement({ value } = {}) {
  const el = document.createElement('input')

  Object.defineProperty(el, 'value', {
    get() {
      return el.value
    },
    set(newValue) {
      el.value = newValue
    },
  })

  el.value = value

  return el
}
