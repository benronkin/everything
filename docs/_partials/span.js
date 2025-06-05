import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'

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
export function createSpan({ html, id } = {}) {
  injectStyle(css)

  const el = document.createElement('span')

  el.insertHtml = insertHtml.bind(el)

  id && (el.dataId = id)
  el.insertHtml(html)

  return el
}
