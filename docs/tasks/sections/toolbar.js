import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { state } from '../../js/state.js'
// import { log } from '../../js/logger.js'

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
        id: 'sort-icon',
        classes: { primary: 'fa-sort', other: 'bordered' },
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
  state.on('icon-click:sort-icon', 'toolbar', ({ id }) => {
    const sortEl = document.getElementById(id)
    sortEl.classList.toggle('primary')
    sortEl.classList.toggle('bordered')
  })
}

/**
 * Set event handlers which can set state.
 */
function listen(el) {}
