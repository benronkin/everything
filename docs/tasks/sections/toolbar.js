import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: getControls().map((c) => createIcon(c))
  })

  react(el)
  listen()

  return el
}

/**
 *
 */
function react(el) {
  state.on('app-mode', 'toolbar', (mode) => {
    const isLeftPanel = mode === 'left-panel'
    el.querySelector('#calendar-priority').classList.toggle(
      'hidden',
      !isLeftPanel
    )
    el.querySelector('#sort-icon').classList.toggle('hidden', !isLeftPanel)
    el.querySelector('#templates').classList.toggle('hidden', !isLeftPanel)
  })

  state.on('active-doc', 'toolbar', () => {
    state.set('steps-changed', true)

    el.querySelector('.avatar-group')?.remove()

    const doc = state.get('main-documents')[0]

    const avatarGroup = createAvatarGroup({
      peers: doc.peers,
      className: 'ml-auto',
      showShare: doc.role === 'owner'
    })

    el.querySelector('.icons').appendChild(avatarGroup)
  })

  state.on('icon-click:calendar-priority', 'toolbar', ({ className }) => {
    const state = className.includes('fa-calendar') ? 'calendar' : 'priority'
    localStorage.setItem('task-list-view', state)

    el.querySelector('#sort-icon').classList.toggle(
      'hidden',
      state === 'calendar'
    )
  })
  state.on('icon-click:sort-icon', 'toolbar', ({ id }) => {
    const sortEl = document.getElementById(id)
    sortEl.classList.toggle('primary')
    sortEl.classList.toggle('bordered')
  })
  state.on('icon-click:templates', 'toolbar', ({ id }) => {
    const el = document.getElementById(id)
    el.classList.toggle('primary')
    el.classList.toggle('bordered')
  })

  state.on('steps-changed', 'toolbar', () => {
    const isMainPanel = state.get('app-mode') === 'main-panel'
    const hasSteps =
      document.getElementById('steps-wrapper')?.children?.length > 0

    el.querySelector('#copy-steps').classList.toggle(
      'hidden',
      isMainPanel && !hasSteps
    )
  })

  state.on('icon-click:copy-steps', 'Toolbar', () => {
    const steps = [
      ...document
        .getElementById('steps-wrapper')
        .querySelectorAll('.step-caption')
    ].map((el) => el.innerHTML)

    if (!navigator.clipboard || !steps.length) return

    const stepsText = steps.join('\n')

    navigator.clipboard.writeText(stepsText).catch((err) => {
      console.error('Clipboard write failed:', err)
    })
    setMessage(`Copied task steps`)
  })
}

/**
 *
 */
function listen() {
  document.addEventListener('click', (e) => {
    const id = 'templates'
    if (!e.target.closest(`#${id}`)) {
      const el = document.getElementById(id)
      el.classList.remove('primary')
      el.classList.add('bordered')
    }
  })
}

/**
 *
 */
function getControls() {
  return [
    {
      id: 'calendar-priority',
      classes: {
        primary: 'fa-list',
        secondary: 'fa-calendar',
        other: ['bordered']
      },
      title: 'Order by priority'
    },
    {
      id: 'sort-icon',
      classes: { primary: 'fa-sort', other: ['bordered'] },
      title: 'Sort manually'
    },
    {
      id: 'templates',
      classes: { primary: 'fa-file-circle-plus', other: ['bordered'] },
      title: 'Open templates'
    },
    {
      id: 'copy-steps',
      classes: { primary: 'fa-clipboard', other: ['bordered', 'hidden'] },
      title: 'Copy steps to clipboard'
    }
  ]
}
