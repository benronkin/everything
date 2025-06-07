import { createToolbar } from '../../_composites/toolbar.js'
import { createIcon } from '../../_partials/icon.js'

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({ classes: { primary: 'fa-plus', other: ['primary'] } }),
    ],
  })
  return el
}
