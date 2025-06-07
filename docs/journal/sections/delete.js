import { injectStyle } from '../../_assets/js/ui.js'
import { createDangerZone } from '../../_composites/dangerZone.js'
import { createDiv } from '../../_partials/div.js'

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
export function createDelete({ id, className } = {}) {
  injectStyle(css)

  const el = createDiv({ id, className: `delete-wrapper ${className}`.trim() })

  build(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build(el) {
  const dz = createDangerZone()
  el.appendChild(dz)
}
