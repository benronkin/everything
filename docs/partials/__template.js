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
export function create({
  id = '',
  className = '',
  events = {},
  html = '',
} = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = `${newValue}`.trim()
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.dataset.id = newValue
        el.dataset.testId = `id-span`
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
  el.dataId = id
  el.classes = className

  addElementParts(el)
  addEventHandlers(el, events)

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
        v()
      })
    } else {
      el.addEventListener(k, v)
    }
  }
}
