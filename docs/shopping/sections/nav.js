import { createNav } from '../../_composites/nav.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function nav() {
  const el = createNav({
    title: '<i class="fa-solid fa-shopping-cart"></i> Shopping',
  })
  return el
}
