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
 * Constructor for custom header element
 * @param {String} type - h1... h6
 * @param {String} html - the contents of the header
 */
export function createHeader({ html = '', id, type = 'h2' } = {}) {
  injectStyle(css)

  const el = document.createElement(type)

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
        el.innerHTML = newValue
      },
    },
  })

  el.value = html
  el.dataId = id

  return el
}
