import { injectStyle } from '../js/ui.js'

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
export function create({ id = '', className = '', events = {} } = {}) {
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
  })

  addElementParts(el)
  addEventHandlers(el, events)

  id && (el.dataId = id)
  el.classes = `${className}`.trim()

  return el
}

// -------------------------------
// Object methods
// -------------------------------

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts(el) {}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers(el, events) {
  for (const [k, v] of Object.entries(events)) {
    if (k === 'click') {
      el.addEventListener('click', (e) => {
        // do something locally, then:
        v(e)
      })
    } else {
      el.addEventListener(k, v)
    }
  }
}
