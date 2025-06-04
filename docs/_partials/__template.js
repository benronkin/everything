import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function create({ id = '', className = '' } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

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

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  newState.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 * Subscribe to and set state.
 */
function react(el) {}

/**
 *
 */
function listen({ el, id }) {
  el.addEventListener('click', () => {})
}
