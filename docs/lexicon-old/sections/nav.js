import { state } from '../../assets/js/state.js'
import { createNav, handleBrandClick } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'

export function nav() {
  const { icon, label } = navList.find((i) => i.id === 'lexicon')

  const el = createNav({
    title: `<i class="fa-solid ${icon}"></i> ${label}`,
  })

  listen(el)

  return el
}

function listen(el) {
  const brand = el.querySelector('.brand')

  brand.removeEventListener('click', handleBrandClick)

  brand.addEventListener('click', () => state.set('default-left-pane', true))
}
