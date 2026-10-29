import { createMarkdown } from '../../assets/composites/markdown.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSelect } from '../../assets/partials/select.js'
import { createSpan } from '../../assets/partials/span.js'
import { createSwitchGroup } from '../../assets/partials/switchGroup.js'

const css = `
#item-group .item-title {
  background-color: var(--purple0);
  padding: 10px 5px;
  border-radius: var(--border-radius);
}
#item-group .item-title input {
  font-size: 1.2rem;
}
#item-group #edit-note-toggle {
  width: 25px;
  text-align: center;
}
#item-group #note-header {
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
#item-group h4, 
#media-header-wrapper h4 {
  margin: 0;
}
#item-group #store-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#item-group .select-wrapper {
  background-color: var(--gray1);
  padding: 15px 5px;
}
`

export function createItemGroup() {
  injectStyle(css)

  const el = createDiv({ id: 'item-group' })

  build(el)

  return el
}

/**
 *
 */
function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'title',
      name: 'title',
      placeholder: 'Item',
      autocomplete: 'off',
      classes: { group: 'mb-40 item-title', icon: 'fa-basket-shopping' }
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
      classes: { group: 'mb-20' }
    })
  )

  el.appendChild(
    createDiv({
      id: 'store-wrapper',
      html: [
        createSpan({ html: 'Store' }),
        createSelect({
          name: 'store',
          id: 'store',
          classes: { group: 'mb-40 store-select', icon: 'fa-store' }
        })
      ]
    })
  )

  el.appendChild(
    createDiv({
      id: 'note-header',
      html: [
        createHeader({ html: 'NOTE', type: 'h4' }),
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
      toggleId: 'edit-note-toggle',
      placeholder: 'Add a note…'
    })
  )
}
