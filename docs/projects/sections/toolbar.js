import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
// import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'add-project',
        classes: { primary: 'fa-plus', other: ['primary'] }
      })
    ]
  })

  react(el)

  return el
}

/**
 *
 */
function react(el) {
  state.on('app-mode', 'toolbar', (mode) => {
    const isLeftPanel = mode === 'left-panel'
    el.querySelector('#add-project').classList.toggle('hidden', !isLeftPanel)
  })

  state.on('active-doc', 'toolbar', () => {
    el.querySelector('.avatar-group')?.remove()

    const doc = state.get('main-documents')[0]

    const avatarGroup = createAvatarGroup({
      peers: doc.peers,
      className: 'ml-auto',
      showShare: doc.role === 'owner'
    })

    el.querySelector('.icons').appendChild(avatarGroup)
  })
}
