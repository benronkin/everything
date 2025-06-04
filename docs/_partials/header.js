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
 * Constructor for custom header element
 * @param {String} type - h1... h6
 * @param {String} html - the contents of the header
 */
export function createHeader({ html, id, className, type = 'h2' } = {}) {
  injectStyle(css)

  const el = document.createElement(type)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  if (className) {
    el.className = className
  }

  if (html) {
    el.innerHTML = html
  }

  return el
}
