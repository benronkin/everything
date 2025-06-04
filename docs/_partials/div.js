import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for custom span element
 */
export function createDiv({ className = '', id = '' } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  build(el)
  react(el)

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
 * Add sub elements to the element. No need
 */
function build(el) {}

/**
 * Subscribe to and set state.
 */
function react(el) {}
