import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { state } from '../../assets/js/state.js'
// import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'calendar-priority',
        classes: {
          primary: 'fa-list',
          secondary: 'fa-calendar',
          other: ['bordered'],
        },
      }),

      createIcon({
        id: 'sort-icon',
        classes: { primary: 'fa-sort', other: ['bordered'] },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('icon-click:calendar-priority', 'toolbar', ({ className }) => {
    const state = className.includes('fa-calendar') ? 'calendar' : 'priority'
    localStorage.setItem('task-list-view', state)

    el.querySelector('#sort-icon').classList.toggle(
      'hidden',
      state === 'calendar',
    )
  })

  state.on('icon-click:sort-icon', 'toolbar', ({ id }) => {
    const sortEl = document.getElementById(id)
    sortEl.classList.toggle('primary')
    sortEl.classList.toggle('bordered')
  })
}
