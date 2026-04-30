import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'add-note',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({
        id: 'edit-note',
        classes: {
          primary: 'fa-pencil',
          secondary: 'fa-close',
          other: 'primary',
        },
      }),
      createIcon({
        id: 'labels',
        classes: {
          primary: 'fa-bookmark',
          other: 'primary',
        },
      }),
      createIcon({
        id: 'history',
        classes: { primary: 'fa-clock-rotate-left', other: 'primary' },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('active-doc', 'toolbar', () => {
    el.querySelector('.avatar-group')?.remove()

    const doc = state.get('main-documents')[0]

    const avatarGroup = createAvatarGroup({
      peers: doc.peers,
      className: 'ml-auto',
      showShare: doc.role === 'owner',
    })

    el.querySelector('.icons').appendChild(avatarGroup)
  })

  state.on('app-mode', 'toolbar', (mode) => {
    const isLeftPanel = mode === 'left-panel'
    el.querySelector('#add-note').classList.toggle('hidden', !isLeftPanel)
    el.querySelector('#edit-note').classList.toggle('hidden', isLeftPanel)
    el.querySelector('#history').classList.toggle('hidden', isLeftPanel)
  })

  state.on('icon-click:history', 'toolbar', () => {
    document.querySelector('#history').classList.toggle('on')
  })
}
