import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
import { createIcon } from '../../assets/partials/icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#shopping-form .ta-group {
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
#shopping-form textarea {
  overflow-y: hidden;
}
#shopping-form #temp {
  border: 1px solid var(--gray1);
  padding: 5px;
  cursor: pointer;
}

`

export function addItemForm() {
  injectStyle(css)

  const el = createFormHorizontal({
    inputOrTextarea: 'textarea',
    id: 'shopping-form',
    type: 'text',
    name: 'new-item',
    placeholder: 'Add item',
    autocomplete: 'off',
    classes: {
      group: 'outer-wrapper',
      icon: 'fa-cart-shopping',
      form: 'pos-relative'
    }
  })

  const textarea = el.querySelector('textarea')
  textarea.rows = 1

  el.querySelector('.outer-wrapper').appendChild(
    createIcon({
      id: 'temp',
      classes: { primary: 'fa-clock' }
    })
  )

  react(el)

  return el
}

/**
 *
 */
function react(el) {
  state.on('icon-click:temp', 'addItemForm', () => {
    el.querySelector('#temp').classList.toggle('primary')
  })
}
