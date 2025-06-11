import { injectStyle } from '../js/ui.js'
import { createFormHorizontal } from '../partials/formHorizontal.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function search({
  id = 'left-panel-search',
  name,
  placeholder,
  classes = { icon: 'fa-magnifying-glass', group: 'outer-wrapper' },
} = {}) {
  injectStyle(css)

  const el = createFormHorizontal({
    id,
    classes,
    placeholder,
    name,
  })

  return el
}
