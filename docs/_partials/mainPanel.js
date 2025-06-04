import { newState } from '../_assets/js/newState.js'
import { injectStyle } from '../_assets/js/ui.js'

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
export function createMainPanel({ className = 'hidden', html = '' } = {}) {
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
        el.dataset.testId = 'test-'
      },
    },
    isHidden: {
      get() {
        return el.classList.contains('hidden')
      },
      set(v) {
        el.classList.toggle('hidden', v)
      },
    },
    html: {
      get() {
        return el.innerHTML
      },
      set(newValue = '') {
        el.innerHTML = newValue
      },
    },
  })

  el.dataId = 'main-panel'
  el.classes = `${className}`.trim()
  el.html = html

  // reactivity
  newState.on('main-documents', 'mainPanel', () => {
    el.isHidden = true
  })
  newState.on('active-doc', 'mainPanel', () => {
    el.isHidden = false
  })

  return el
}
