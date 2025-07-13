import { createNav } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function nav() {
  const { icon, label } = navList.find((i) => i.id === 'lexicon')

  const el = createNav({
    title: `<i class="fa-solid ${icon}"></i> ${label}`,
  })
  return el
}
