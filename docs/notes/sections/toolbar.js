import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
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
}

function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
