import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'

export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add',
        classes: { primary: 'fa-plus', other: ['primary', 'hidden'] },
      }),
    ],
    classes: { primary: 'b-none' },
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    el.querySelector('.icons').classList.toggle(
      'b-none',
      appMode !== 'main-panel'
    )

    const sels = ['#back', '#add']

    sels.forEach((sel) =>
      el.querySelector(sel).classList.toggle('hidden', appMode !== 'main-panel')
    )
  })

  state.on('icon-click:back', 'toolbar', () => {
    document.getElementById('new-entry-wrapper').classList.add('hidden')
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
