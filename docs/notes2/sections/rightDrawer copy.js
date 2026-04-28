import { createRightDrawer } from '../../assets/partials/rightDrawer.js'

export function rightDrawer() {
  const el = createRightDrawer({ active: 'notes' })
  return el
}
