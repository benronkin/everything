import { state } from '../../assets/js/state.js'
import { isMobile, injectStyle } from '../../assets/js/ui.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { floatingMenu } from '../../assets/partials/floatingMenu.js'
import { setMessage } from '../../assets/js/ui.js'

const css = `
.floating-menu {
  left: 20px !important;
  top: 150px !important;
  background-color: var(--purple2) !important;
  border: 1px solid var(--purple3) !important;
  color: var(--gray6) !important;
  width: 300px;
}
.floating-menu-option {
  padding: 15px 10px !important;
}
.floating-menu-option:not(:first-child) {
  border-top: 3px solid var(--purple3);
}
`

export function toolbar() {
  injectStyle(css)

  const controls = getControls()

  let children

  if (isMobile()) {
    children = controls.filter((c) => c.skipMenu).map((c) => createIcon(c))
  } else {
    children = controls.filter((c) => !c.mobileOnly).map((c) => createIcon(c))
  }

  const el = createToolbar({
    className: 'container',
    children
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (mode) => {
    const isLeftPanel = mode === 'left-panel'
    el.querySelector('#toggle-toolbar-floating-menu')?.classList.toggle(
      'hidden',
      isLeftPanel
    )
    el.querySelector('#add-entry').classList.toggle('hidden', !isLeftPanel)
    el.querySelector('#geo-location')?.classList.toggle('hidden', isLeftPanel)
    el.querySelector('#copy-address')?.classList.toggle('hidden', isLeftPanel)
    el.querySelector('#around-this-time')?.classList.toggle(
      'hidden',
      isLeftPanel
    )
  })

  state.on('icon-click:toggle-toolbar-floating-menu', 'Journal toolbar', () => {
    floatingMenu({
      id: 'toolbar-floating-menu',
      className: 'floating-menu',
      options: getControls()
        .filter((c) => !c.skipMenu)
        .map((c) => {
          const icon = document.createElement('i')
          icon.className = `fa-solid fa-fw ${c.classes.primary}`
          return {
            id: c.id,
            html: [icon, createSpan({ html: c.title })]
          }
        }),
      toggleId: 'toggle-toolbar-floating-menu'
    })
    document.querySelectorAll('.floating-menu-option').forEach((o) =>
      o.addEventListener('click', () => {
        document.querySelector('.floating-menu').innerHTML = ''

        const stateText = `icon-click:${o.id}`
        state.set(stateText, {
          id: o.id,
          className: o.querySelector('i').className
        })
      })
    )
  })

  state.on('icon-click:copy-address', 'Journal toolbar', () => {
    const doc = state.get('main-documents')[0]

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

  // Wait for main documents to see whether to make geo button visible
  state.on('main-documents', 'Journal toolbar', (docs) => {
    if (!docs) return
    const doc = docs[0]
    if (!doc || typeof doc.street !== 'string') return
    const street = doc.street.trim()

    el.querySelector('#geo-location')?.classList.toggle(
      'hidden',
      street.length > 0
    )
  })
}

/**
 *
 */
function getControls() {
  return [
    {
      id: 'toggle-toolbar-floating-menu',
      classes: { primary: 'fa-bars', other: ['primary'] },
      title: 'Open options',
      skipMenu: true,
      mobileOnly: true
    },
    {
      id: 'add-entry',
      classes: { primary: 'fa-plus', other: ['primary'] },
      title: 'Create a new entry',
      skipMenu: true
    },
    {
      id: 'geo-location',
      classes: { primary: 'fa-location-dot', other: 'primary' },
      title: 'Set current address'
    },
    {
      id: 'copy-address',
      classes: { primary: 'fa-clipboard', other: ['primary'] },
      title: 'Copy address to clipboard'
    },
    {
      id: 'around-this-time',
      classes: { primary: 'fa-road', other: ['primary'] },
      title: 'View adjacent entries'
    }
  ]
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
