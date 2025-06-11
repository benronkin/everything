import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'
import { log } from '../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
span {
  padding: 7px 0;
  border-radius: var(--border-radius);
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for custom span element
 */
export function createSpan({ html, className, id } = {}) {
  injectStyle(css)

  const el = document.createElement('span')

  el.insertHtml = insertHtml.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  className && (el.className = className)
  html && el.insertHtml(html)

  return el
}
