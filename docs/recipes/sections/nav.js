import { createNav } from '../../assets/composites/nav.js'

export function nav() {
  const el = createNav({
    title: '<i class="fa-solid fa-cake-candles"></i> Recipes',
  })
  return el
}
