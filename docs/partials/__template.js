import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

const html = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function create(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({} = {}) {
  const el = document.createElement('div')
  el.innerHTML = html

  return el
}
