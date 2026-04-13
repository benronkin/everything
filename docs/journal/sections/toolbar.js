import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { setMessage } from '../../assets/js/ui.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary'] },
      }),
      createIcon({
        id: 'add-entry',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({
        id: 'recent-entries',
        classes: { primary: 'fa-calendar', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'page-entries',
        classes: { primary: 'fa-list', other: ['primary'] },
      }),
      createIcon({
        id: 'copy-address',
        classes: { primary: 'fa-clipboard', other: ['primary'] },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'Journal toolbar', (appMode) => {
    const icons = [
      { id: 'back', hideOn: appMode === 'left-panel' },
      { id: 'page-entries', hideOn: appMode === 'main-panel' },
      { id: 'copy-address', hideOn: appMode === 'left-panel' },
    ]

    icons.forEach(({ id, hideOn }) => {
      const icon = el.querySelector(`#${id}`)
      icon.classList.toggle('hidden', hideOn)
    })
  })

  state.on('icon-click:back', 'Journal toolbar', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })

  state.on('icon-click:page-entries', 'Journal toolbar', () => {
    el.querySelector('#page-entries').classList.add('hidden')
    el.querySelector('#recent-entries').classList.remove('hidden')
  })

  state.on('icon-click:recent-entries', 'Journal toolbar', () => {
    el.querySelector('#page-entries').classList.remove('hidden')
    el.querySelector('#recent-entries').classList.add('hidden')
  })

  state.on('icon-click:copy-address', 'Journal toolbar', () => {
    const id = state.get('active-doc')
    const docs = state.get('main-documents')
    const doc = docs.find((d) => d.id === id)

    let address = doc.street.trim()

    if (!navigator.clipboard || !doc || !address) return

    if (!streetHasCoords(doc.street)) {
      if (doc.city.trim().length) {
        address = `${address} ${doc.city.trim()}`
        if (doc.state.trim().length) {
          address = `${address}, ${doc.state.trim()}`
        }
      }
    }
    navigator.clipboard.writeText(address).catch((err) => {
      console.error('Clipboard write failed:', err)
    })
    setMessage(`Copied: "${address}"`)
  })
}

/**
 * Returns true when `doc.street` contains something that looks like a
 * latitude-longitude pair, e.g. “37.7749, -122.4194”.
 *
 * @param {{ street?: string }} doc
 */
export function streetHasCoords(street) {
  if (!street) return false

  // latitude  -90 →  90   with optional decimal
  // longitude -180 → 180  with optional decimal
  const coordRE =
    /\b-?(?:90|[0-8]?\d)(?:\.\d+)?,\s*-?(?:180|1[0-7]\d|[0-9]?\d)(?:\.\d+)?\b/

  return coordRE.test(street)
}
