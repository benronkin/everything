/* global imageCompression */

import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { log } from '../../assets/js/logger.js'

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
#main-panel.hidden {
  display: none;
}
#main-panel input.field,
#main-panel textarea.field {
  padding: 0;
  margin: 0;
  border-bottom: 1px dotted var(--gray1);
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)

  el.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(
    createDiv({ id: 'settings-wrapper', className: 'outer-wrapper' })
  )
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode === 'main-panel') {
      el.classList.remove('hidden')
      // log('mainPanel is showing itself on active-doc')
    } else {
      el.classList.add('hidden')
      // log(`mainPanel is hiding itself on app-mode: ${appMode}`)
    }
  })
}
