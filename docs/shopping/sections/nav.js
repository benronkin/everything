import { createNav } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'

export function nav() {
  const { icon, label } = navList.find((i) => i.id === 'shopping')

  const el = createNav({
    primaryIcon: icon,
    primaryText: label
  })

  return el
}
