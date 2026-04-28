import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createDocLinkIcon } from '../../assets/partials/docLinkIcon.js'
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
        id: 'edit',
        classes: {
          primary: 'fa-pencil',
          secondary: 'fa-close',
          other: 'primary hidden',
        },
      }),
      createIcon({
        id: 'toc',
        classes: {
          primary: 'fa-book-open',
          other: 'primary hidden',
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
        classes: { primary: 'fa-clock-rotate-left', other: 'primary hidden' },
      }),
      createDocLinkIcon({
        id: 'doc-link',
        classes: { primary: 'fa-link', other: 'primary hidden' },
      }),
    ],
  })

  react(el)
  listen(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) =>
    toggleToolbarButtons({ appMode }),
  )

  state.on('active-doc', 'notes', (id) => {
    el.querySelector('.avatar-group')?.remove()

    if (id) {
      const doc = { ...state.get('main-documents').find((d) => d.id === id) }
      el.querySelector('.icons').appendChild(
        createAvatarGroup({
          peers: doc.peers,
          className: 'ml-auto',
          showShare: doc.role === 'owner',
        }),
      )
    }
  })

  state.on('icon-click:toc', 'toolbar', () => {
    document.querySelector('#toc').classList.toggle('on')
  })

  state.on('icon-click:edit', 'toolbar', () => {
    document.querySelector('#edit').classList.toggle('on')
  })

  state.on('icon-click:history', 'toolbar', () => {
    document.querySelector('#history').classList.toggle('on')
  })
}

function listen() {}

function toggleToolbarButtons({ appMode, i }) {
  const edit = document.querySelector('#edit')
  const toc = document.querySelector('#toc')
  // const link = document.querySelector('#doc-link')
  const history = document.querySelector('#history')

  const isLeft = appMode === 'left-panel'
  const isOn = (i) => i && i.classList.contains('on')

  edit.classList.toggle('hidden', isLeft || isOn(history))
  history.classList.toggle('hidden', isLeft || isOn(edit))

  if (isLeft) {
    edit.classList.remove('on')
    toc.classList.remove('on')
    history.classList.remove('on')
  }
}
