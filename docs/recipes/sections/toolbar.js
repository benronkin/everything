import { state } from '../../assets/js/state.js'
import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSelect } from '../../assets/partials/select.js'

export function toolbar() {
  const el = createToolbar({
    className: 'container',
    children: [
      createIcon({
        id: 'add-recipe',
        classes: { primary: 'fa-plus', other: ['primary'] }
      }),
      createIcon({
        id: 'shop',
        classes: { primary: 'fa-shopping-cart', other: ['primary', 'hidden'] }
      }),
      createSelect({
        id: 'category-filter',
        name: 'category-filter',
        className: 'primary'
      })
    ]
  })

  react(el)

  return el
}

function react(el) {
  state.on('app-mode', 'toolbar', (appMode) => {
    el.querySelector('#add-recipe').classList.toggle(
      'hidden',
      appMode === 'main-panel'
    )
    el.querySelector('#shop').classList.toggle(
      'hidden',
      appMode !== 'main-panel'
    )
    el.querySelector('#category-filter').classList.toggle(
      'hidden',
      appMode === 'main-panel'
    )
  })

  state.on('recipe-categories', 'toolbar', (cats) => {
    cats.shift()
    cats.sort((a, b) => a.label.localeCompare(b.label))
    cats.unshift({ value: '', label: 'Recently viewed' })
    document.querySelector('#category-filter').closest('div').setOptions(cats)
  })
}
