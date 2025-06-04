import { injectStyle } from '../_assets/js/ui.js'

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
export function createSpan({ html = '', id } = {}) {
  injectStyle(css)

  const el = document.createElement('span')

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = newValue
      },
    },
    value: {
      get() {
        return el.innerHTML
      },
      set(newValue) {
        if (typeof newValue === 'string') {
          newValue = document.createTextNode(newValue)
        }
        el.innerHTML = ''
        el.appendChild(newValue)
      },
    },
  })
  el.value = html
  id && (el.dataId = id)

  return el
}
