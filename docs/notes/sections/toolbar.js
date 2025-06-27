import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add-note',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({ classes: { primary: 'fa-pencil', other: 'primary' } }),
      createIcon({
        classes: {
          primary: 'fa-paragraph',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: { snippet: '<div>\n  $1\n</div>' },
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
