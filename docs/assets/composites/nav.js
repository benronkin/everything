import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
nav {
  background: var(--nav-gradient);
  display: flex;
  height: var(--nav-height);
}
nav ul,
nav .container,
nav .brand {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
nav ul,
nav .container {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
nav .brand {
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  }
nav .brand h3 {
  margin: 0;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.5px;
  }
nav .brand h3,
nav .brand i:hover {      
  color: var(--purple3);
  cursor: default;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createNav({ title, disableRightDrawer = false }) {
  injectStyle(css)

  const el = document.createElement('nav')

  build({ el, disableRightDrawer })

  el.querySelector('h3').innerHTML = title

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build({ el, disableRightDrawer }) {
  const containerEl = createDiv({ className: 'container' })
  el.appendChild(containerEl)

  const brandEl = createDiv({ className: 'brand' })
  containerEl.appendChild(brandEl)

  brandEl.appendChild(createHeader({ type: 'h3' }))

  if (!disableRightDrawer) {
    containerEl.appendChild(
      createIcon({
        id: 'toggle-right-drawer',
        classes: { primary: 'fa-bars', other: ['btn'] },
      })
    )
  }
}
