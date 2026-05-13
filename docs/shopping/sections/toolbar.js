import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { state } from '../../assets/js/state.js'
// import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'sort',
        classes: { primary: 'fa-sort', other: 'bordered' },
      }),
      createIcon({
        id: 'suggest',
        classes: { primary: 'fa-lightbulb', other: 'bordered' },
      }),
      createIcon({
        id: 'recurring',
        classes: { primary: 'fa-cloud-arrow-down', other: 'bordered' },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('icon-click:sort', 'toolbar', ({ id }) => {
    const sortEl = document.getElementById(id)
    sortEl.classList.toggle('primary')
    sortEl.classList.toggle('bordered')
  })

  state.on('icon-click:suggest', 'toolbar', ({ id }) => {
    const suggestEl = document.getElementById(id)
    suggestEl.classList.toggle('primary')
    suggestEl.classList.toggle('bordered')
  })
}
