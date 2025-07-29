import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function createImage({ id, className, src } = {}) {
  injectStyle(css)

  const el = document.createElement('img')

  build(el)
  react(el)
  listen(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  src && (el.src = src)

  return el
}

function build(el) {}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {})
}
