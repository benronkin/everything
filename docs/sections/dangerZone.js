import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createSpan } from '../partials/span.js'

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
export function createDangerZone({
  id,
  events = {},
  header = 'Delete entry',
} = {}) {
  injectStyle(css)

  const el = createDiv({ className: 'flex danger-box u-mt-40 u-mb-20' })

  addElementParts({ el, header })
  addEventHandlers(el, events)

  id && (el.dataId = id)

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
function addElementParts({ el, header }) {
  el.appendChild(createSpan({ html: header }))
  el.appendChild(createIcon({ id: 'delete-entry-btn', className: 'fa-trash' }))
}

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
