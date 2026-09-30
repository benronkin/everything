import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
// import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: getControls().map((c) => createIcon(c))
  })

  react(el)
  listen(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    el.querySelector('#back').classList.toggle(
      'hidden',
      appMode !== 'main-panel'
    )
    el.querySelector('#add-book').classList.toggle(
      'hidden',
      appMode === 'main-panel'
    )
    el.querySelector('#book-info').classList.toggle(
      'hidden',
      appMode !== 'main-panel'
    )
  })
}

function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}

/**
 *
 */
function getControls() {
  return [
    // {
    //   id: 'toggle-toolbar-floating-menu',
    //   classes: { primary: 'fa-bars', other: ['primary'] },
    //   title: 'Open options',
    //   skipMenu: true,
    //   mobileOnly: true
    // },
    {
      id: 'back',
      classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] }
    },
    {
      id: 'add-book',
      classes: { primary: 'fa-plus', other: ['primary'] },
      title: 'Add a book',
      skipMenu: true
    },
    {
      id: 'book-info',
      classes: { primary: 'fa-cloud-arrow-down', other: ['primary', 'hidden'] },
      title: 'Set book info'
    }
  ]
}
