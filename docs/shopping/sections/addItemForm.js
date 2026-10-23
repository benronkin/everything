import { injectStyle, isMobile } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createButton } from '../../assets/partials/button.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
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
      icon: 'fa-cart-shopping',
      form: 'pos-relative'
    }
  })

  react(el)

  return el
}

function react(el) {
  state.on('form-keyup:shopping-form', 'addItemForm', ({ value }) =>
    handleFormKeyup({ el, value })
  )
}

function handleFormKeyup({ el, value }) {}
