import { injectStyle } from '../../assets/js/ui.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSelect } from '../../assets/partials/select.js'
import { state } from '../../assets/js/state.js'

const css = `
#view-select {
  border: 1px solid var(--gray4);
  padding: 12px;
  }
#view-select .custom-select{
  color: var(--gray4); 
}
`

export function toolbar() {
  injectStyle(css)
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['bordered', 'hidden'] },
        title: 'Sort'
      }),
      createIcon({
        id: 'sort',
        classes: { primary: 'fa-sort', other: ['bordered', 'hidden'] },
        title: 'Sort'
      }),

      createIcon({
        id: 'recurring',
        classes: {
          primary: 'fa-cloud-arrow-down',
          other: ['bordered', 'hidden']
        }
      }),
      createSelect({
        id: 'view-select',
        className: 'hidden',
        options: [
          { label: 'CART', value: 'cart' },
          { label: 'ALL', value: 'all' },
          { label: 'RECURRING', value: 'recurring' }
        ],
        value: 'cart'
      })
    ]
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (mode) => {
    const isLeftPanel = mode === 'left-panel'
    el.querySelector('#back').classList.toggle('hidden', isLeftPanel)
    el.querySelector('#sort').classList.toggle('hidden', !isLeftPanel)
    el.querySelector('#recurring').classList.toggle('hidden', !isLeftPanel)
    el.querySelector('#view-select').classList.toggle('hidden', !isLeftPanel)
  })

  state.on('icon-click:back', 'toolbar', () => {
    window.location.href = './index.html'
  })

  state.on('icon-click:sort', 'toolbar', ({ id }) => {
    const sortEl = document.getElementById(id)
    sortEl.classList.toggle('primary')
    sortEl.classList.toggle('bordered')
  })
}
