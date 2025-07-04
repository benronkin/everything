import { createNav } from '../../assets/composites/nav.js'

export function nav() {
  const el = createNav({
    title: '<i class="fa-solid fa-home"></i> Everything App',
  })
  return el
}
