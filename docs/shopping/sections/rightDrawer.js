import { createRightDrawer } from '../../_composites/rightDrawer.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function rightDrawer() {
  const el = createRightDrawer({ active: 'shopping' })
  return el
}
