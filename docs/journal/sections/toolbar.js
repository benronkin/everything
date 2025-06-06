import { createToolbar } from '../../_instances/toolbar.js'
import { createIcon } from '../../_partials/icon.js'

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function toolbar() {
  const el = createToolbar({
    children: [createIcon({ classes: { primary: 'fa-plus' } })],
  })
  return el
}
