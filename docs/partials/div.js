import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// const html = `
// `

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for custom span element
 */
export function createDiv({ html = '', id } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.dataset.id = newValue
      },
    },
    value: {
      get() {
        return el.innerHTML
      },
      set(newValue) {
        el.innerHTML = newValue
      },
    },
  })

  el.value = html
  el.dataId = id

  return el
}
