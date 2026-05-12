import { injectStyle } from '../js/ui.js'
import { createAvatar } from './avatar.js'
import { handlRightDrawerState } from '../js/ui.js'
import { createNavigationMenu } from '../composites/navigationMenu.js'
import { state } from '../js/state.js'

const css = `
.avatar {  
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  font-weight: 700;
  border: 1px solid #e5e5e5;
}
div.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray1);
}
`

export function createNavAvatar(doc) {
  injectStyle(css)

  const el = createAvatar(doc)

  listen(el)

  return el
}

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {
    const active = state.get('default-page')
    handlRightDrawerState('navigation-menu')
    createNavigationMenu({
      container: document.getElementById('right-drawer'),
      active,
    })
  })
}
