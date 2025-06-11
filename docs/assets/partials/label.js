import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
label {
  border-radius: var(--border-radius);
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createLabel({ id, html, className } = {}) {
  injectStyle(css)

  const el = document.createElement('label')

  el.insertHtml = insertHtml.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  if (className) {
    el.className = className
  }

  if (html) {
    el.insertHtml(html)
  }

  return el
}
