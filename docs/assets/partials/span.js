import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
span {
  padding: 7px 0;
  border-radius: var(--border-radius);
}
`

/**
 * Constructor for custom span element
 */
export function createSpan({ html, className, id, title } = {}) {
  injectStyle(css)

  const el = document.createElement('span')

  el.insertHtml = insertHtml.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  title && (el.title = title)
  className && (el.className = className)
  html && el.insertHtml(html)

  return el
}
