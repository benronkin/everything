import { createNav } from '../../../docs/assets/composites/nav.js'

export function nav() {
  const el = createNav({
    title: '<i class="fa-solid fa-list-check"></i> Tasks',
  })
  return el
}
