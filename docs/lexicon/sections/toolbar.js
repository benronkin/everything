import { fetchOrSearch } from '../lexicon.handlers.js'
import { updateUserPrefs } from '../../users/users.api.js'
import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSelect } from '../../assets/partials/select.js'

export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),

      createSelect({
        id: 'submitter-select',
        className: 'primary',
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    const backEl = el.querySelector('#back')
    backEl.classList.toggle('hidden', appMode !== 'main-panel')
  })

  state.on('icon-click:back', 'toolbar', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })

  state.on('users', 'toolbar', (users) => {
    const user = state.get('user')
    const options = [
      { value: '', label: 'All' },
      { value: user.id, label: 'Mine' },
    ]

    const peers = users.filter((u) => u.id !== user.id)
    peers.forEach((p) => options.push({ value: p.id, label: p.first_name }))

    const sel = document.querySelector('#submitter-select')
    sel.setOptions(options)
    const selectedVale = user.prefs?.lexicon?.submitterFilter || ''
    sel.selectByValue(selectedVale)
  })

  state.on('select-click:submitter-select', 'toolbar', async (value) => {
    await updateUserPrefs({ lexiconSubmitterFilter: value })
    fetchOrSearch()
  })
}
