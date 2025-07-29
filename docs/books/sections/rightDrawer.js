import { createRightDrawer } from '../../assets/composites/rightDrawer.js'

export function rightDrawer() {
  const el = createRightDrawer({ active: 'books' })
  return el
}
