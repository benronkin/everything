import { injectStyle } from '../js/ui.js'
import { createDangerZone } from './dangerZone.js'

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
export function createDelete({ id = '', className = '' } = {}) {
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
        el.dataset.testId = 'test-delete'
      },
    },
  })

  addElementParts({ el })

  id && (el.dataId = id)
  el.classes = `delete-wrapper ${className}`

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts({ el }) {
  const dz = createDangerZone()
  el.appendChild(dz)
}
