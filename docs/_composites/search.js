import { injectStyle } from '../_assets/js/ui.js'
import { createFormHorizontal } from '../_partials/formHorizontal.js'
import { state } from '../_assets/js/state.js'

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
