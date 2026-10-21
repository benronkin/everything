import { createMarkdown } from '../../assets/composites/markdown.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSwitchGroup } from '../../assets/partials/switchGroup.js'

const css = `
#edit-note-toggle {
  width: 25px;
  text-align: center;
}
#note-header {
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}
#note-header h5 {
  margin: 0;
}
`

export function createItemGroup() {
  injectStyle(css)

  const el = createDiv({ id: 'item-group' })

  build(el)

  return el
}

function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'title',
      name: 'title',
      placeholder: 'Item',
      autocomplete: 'off',
      classes: { group: 'mb-40', icon: 'fa-basket-shopping' }
    })
  )

  el.appendChild(
    createSwitchGroup({
      name: 'carted',
      id: 'carted',
      label: 'Add to cart',
      classes: { group: 'mb-20' }
    })
  )

  el.appendChild(
    createSwitchGroup({
      name: 'recurring',
      id: 'recurring',
      label: 'Recurring',
      classes: { group: 'mb-40' }
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'store',
      id: 'store',
      placeholder: 'Store',
      classes: { group: 'mb-40', icon: 'fa-store' }
    })
  )

  el.appendChild(
    createDiv({
      id: 'note-header',
      html: [
        createHeader({ html: 'NOTE', type: 'h5' }),
        createIcon({
          id: 'edit-note-toggle',
          classes: {
            primary: 'fa-pencil',
            secondary: 'fa-close',
            other: ['primary']
          }
        })
      ]
    })
  )

  el.appendChild(
    createMarkdown({
      id: 'note',
      name: 'note',
      toggleId: 'edit-note-toggle'
    })
  )
}
