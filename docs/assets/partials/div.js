import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'
// import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function createDiv({ className, id, html, dataset = {} } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  el.insertHtml = insertHtml.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  html && el.insertHtml(html)

  for (const [k, v] of Object.entries(dataset)) {
    el.dataset[k] = v
  }

  return el
}
