import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
// import { log } from '../../assets/js/logger.js'

export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add-recipe',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({
        id: 'shop',
        classes: { primary: 'fa-shopping-cart', other: ['primary', 'hidden'] },
      }),
    ],
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    const backEl = el.querySelector('#back')
    const shopEl = el.querySelector('#shop')
    backEl.classList.toggle('hidden', appMode !== 'main-panel')
    shopEl.classList.toggle('hidden', appMode !== 'main-panel')
  })

  state.on('icon-click:back', 'toolbar', () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
