import { injectStyle } from '../../assets/js/ui.js'
import { log } from '../../assets/js/logger.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createList } from '../../assets/partials/list.js'
import { createListItem } from '../../assets/partials/listItem.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'

const css = `
#left-panel {
  width: 100%;
}
`
export function leftPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)
  listen({ el, id: 'left-panel' })

  el.id = 'left-panel'

  return el
}
function build(el) {
  const listEl = createList({ enableDrag: 'false' })
  el.appendChild(listEl)
  listEl.addChildren([
    createListItem({
      id: 'main-item-profile',
      html: createSpanGroup({
        html: 'Profile',
        classes: { icon: 'fa-circle-user' },
      }),
    }),
  ])
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      // log(`letPanel is hiding itself on app-mode: ${appMode}`)
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')
    // log(`letPanel is showing itself on app-mode: ${appMode}`)
  })
}

function listen() {
  // el.addEventListener('click', () => {})
}
