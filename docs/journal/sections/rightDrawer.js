import { createRightDrawer } from '../../assets/composites/rightDrawer.js'

export function rightDrawer() {
  const el = createRightDrawer({ active: 'journal' })
  return el
}
