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
export function createDiv({ className = '', html = '', id = '' } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = newValue
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = id
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
  el.classes = className

  return el
}
