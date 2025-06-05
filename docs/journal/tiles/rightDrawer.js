import { createRightDrawer } from '../../_sections/rightDrawer.js'

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
