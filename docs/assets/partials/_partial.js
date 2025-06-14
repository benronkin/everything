import { injectStyle } from '../../assets/js/ui.js'
import { insertHtml } from '../../assets/js/format.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

export function create({ id, className, html } = {}) {
  injectStyle(css)

  const el = document.createElement('')

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  className && (el.className = className)
  html && el.insertHtml(html)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

function build(el) {}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
