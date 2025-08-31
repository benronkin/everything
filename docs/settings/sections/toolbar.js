import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
    ],
  })

  react(el)
  listen(el)

  return el
}

function react(el) {
  state.on('app-mode', 'Notes toolbar', (appMode) => {
    const backEl = el.querySelector('#back')
    backEl.classList.toggle('hidden', appMode !== 'main-panel')
    // hide the entire toolbar in left-panel since there are no icons to display

    el.classList.toggle('invisible', appMode !== 'main-panel')
  })

  state.on('active-doc', 'notes', (id) => {
    el.querySelector('.avatar-group')?.remove()

    if (id) {
      const doc = { ...state.get('main-documents').find((d) => d.id === id) }
      el.querySelector('.icons').appendChild(
        createAvatarGroup({
          peers: doc.peers,
          className: 'ml-auto',
          showShare: doc.role === 'owner',
        })
      )
    }
  })
}

function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
