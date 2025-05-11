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
export function createSpan(config) {
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
function createElement({ text } = {}) {
  const el = document.createElement('span')
  el.innerHTML = html
  el.textContent = text

  return el
}
