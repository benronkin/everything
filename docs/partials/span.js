import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
span {
  padding: 7px 0;
  border-radius: var(--border-radius);
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
export function createSpan(config) {
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
function createElement({ html } = {}) {
  const el = document.createElement('span')

  Object.defineProperty(el, 'value', {
    get() {
      return el.innerHTML
    },
    set(newValue) {
      el.innerHTML = newValue
    },
  })

  el.value = html

  return el
}
