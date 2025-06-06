import { createRightDrawer } from '../../_instances/rightDrawer.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function rightDrawer() {
  const el = createRightDrawer({ active: 'journal' })
  return el
}
