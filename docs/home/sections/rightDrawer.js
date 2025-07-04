import { createRightDrawer } from '../../assets/composites/rightDrawer.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function rightDrawer() {
  const el = createRightDrawer({ active: 'home' })
  return el
}
