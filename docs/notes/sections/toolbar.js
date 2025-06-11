import { createToolbar } from '../../_composites/toolbar.js'
import { createIcon } from '../../_partials/icon.js'
import { state } from '../../_assets/js/state.js'
// import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
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

// -------------------------------
// Helpers
// -------------------------------

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('app-mode', 'Notes toolbar', (appMode) => {
    const backEl = el.querySelector('#back')
    backEl.classList.toggle('hidden', appMode !== 'main-panel')
  })
}

/**
 * Set event handlers which can set state.
 */
/**
 * Set event handlers which can set state.
 */
function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
