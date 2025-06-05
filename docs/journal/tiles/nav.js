import { createNav } from '../../_sections/nav.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function nav() {
  const el = createNav({ title: '<i class="fa-solid fa-book"></i> Journal' })
  return el
}
