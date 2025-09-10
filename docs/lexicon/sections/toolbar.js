import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSelect } from '../../assets/partials/select.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createSelect({
        id: 'view-by',
        className: 'primary',
        options: [
          { value: 'recent', label: 'Recently viewed' },
          { value: 'wotd', label: 'Recent WOTD' },
        ],
      }),
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add',
        classes: { primary: 'fa-plus', other: ['primary', 'hidden'] },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    const sels = ['#back', '#add']

    sels.forEach((sel) =>
      el.querySelector(sel).classList.toggle('hidden', appMode !== 'main-panel')
    )

    document
      .querySelector('#view-by')
      .classList.toggle('hidden', appMode === 'main-panel')
  })

  state.on('user', 'toolbar', (user) => {
    document
      .querySelector('#view-by')
      .selectByValue(user?.prefs?.lexicon?.viewBy || 'recent')
  })

  state.on('icon-click:back', 'toolbar', () => {
    document.getElementById('new-entry-wrapper').classList.add('hidden')
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
