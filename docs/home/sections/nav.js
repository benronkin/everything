import { createNav } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'

export function nav() {
  const { icon, label } = navList.find((i) => i.id === 'home')

  const el = createNav({
    title: `<i class="fa-solid ${icon}"></i> ${label}`,
  })
  return el
}
