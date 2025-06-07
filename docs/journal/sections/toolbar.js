import { newState } from '../../_assets/js/newState.js'
import { createToolbar } from '../../_composites/toolbar.js'
import { createIcon } from '../../_partials/icon.js'
import { log } from '../../_assets/js/ui.js'

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
      createIcon({ classes: { primary: 'fa-plus', other: ['primary'] } }),
    ],
  })

  react(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('active-doc', 'Journal toolbar', (doc) => {
    const backEl = el.querySelector('#back')
    if (doc) {
      backEl.classList.remove('hidden')
      log('Journal toolbar is showing #back button on active-doc')
    } else {
      backEl.classList.add('hidden')
      log('Journal toolbar is hiding #back button on a null active-doc')
    }
  })
}
