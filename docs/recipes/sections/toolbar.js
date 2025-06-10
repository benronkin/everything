import { newState } from '../../_assets/js/newState.js'
import { createToolbar } from '../../_composites/toolbar.js'
import { createIcon } from '../../_partials/icon.js'
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
        id: 'add-recipe',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({
        id: 'shop-ingredients',
        classes: { primary: 'fa-shopping-cart', other: ['primary'] },
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
  newState.on('app-mode', 'Recipes toolbar', (appMode) => {
    const backEl = el.querySelector('#back')
    backEl.classList.toggle('hidden', appMode !== 'main-panel')
  })
}

/**
 * Set event handlers which can set state.
 */
function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    newState.set('active-doc', null)
    newState.set('app-mode', 'left-panel')
  })
}
