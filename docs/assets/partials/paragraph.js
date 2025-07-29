import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function createParagraph({ id, className, html } = {}) {
  injectStyle(css)

  const el = document.createElement('p')
  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen({ el, id })

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

function build(el) {}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
