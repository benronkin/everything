import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
span {
  padding: 7px 0;
  border-radius: var(--border-radius);
}
`

// const html = `
// `

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for custom span element
 */
export function createSpan({ html = '' } = {}) {
  injectStyle(css)

  const el = document.createElement('span')

  Object.defineProperty(el, 'value', {
    get() {
      return el.innerHTML
    },
    set(newValue) {
      el.innerHTML = newValue
    },
  })

  el.value = html

  return el
}
