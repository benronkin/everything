import { createRightDrawer } from '../../../docs/assets/composites/rightDrawer.js'

export function rightDrawer() {
  const el = createRightDrawer({ active: 'tasks' })
  return el
}
