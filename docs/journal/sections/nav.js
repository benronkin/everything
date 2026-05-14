import { createNav } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'

export function nav() {
  // const el = createNav({ title: '<i class="fa-solid fa-book"></i> Journal' })

  const { icon, label } = navList.find((i) => i.id === 'journal')

  const el = createNav({
    primaryIcon: icon,
    primaryText: label,
    secondaryIcon: 'fa-road',
    secondaryParam: 'around',
  })

  return el
}
