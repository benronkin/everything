import { injectStyle } from '../../assets/js/ui.js'
import { insertHtml } from '../../assets/js/format.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { createButton } from '../../assets/partials/button.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#shopping-form {
  position: relative;
}
#add-to-both-lists-button {
  position: absolute;
  margin: 0;
  padding: 5px;
  right: 0;
  bottom: 20px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function addItemForm() {
  injectStyle(css)

  const el = createFormHorizontal({
    id: 'shopping-form',
    type: 'text',
    name: 'new-item',
    placeholder: 'Add item',
    autocomplete: 'off',
    classes: {
      icon: 'fa-cart-shopping',
      form: 'pos-relative',
    },
    disabled: true,
  })

  el.querySelector('i').id = 'shopping-form-icon'

  build(el)
  react(el)
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

function build(el) {
  const addToBothEl = createButton({
    id: 'add-to-both-lists-button',
    className: 'bordered smaller bg-gray0 hidden',
    html: '<i class="fa-solid fa-cart-shopping"></i><i class="fa-solid fa-lightbulb"></i>',
  })

  el.appendChild(addToBothEl)
}

function react(el) {
  state.on('form-keyup:shopping-form', 'addItemForm', handleFormKeyup)
}

function listen(el) {}

function handleFormKeyup({ value }) {
  const inShoppingList = state.get('shopping-list').includes(value)
  const inSuggestionsList = state.get('suggestions-list').includes(value)

  document
    .querySelector('#add-to-both-lists-button')
    .classList.toggle('hidden', inShoppingList || inSuggestionsList)

  document
    .querySelector('input[name="new-item"]')
    .classList.toggle('c-gray3', inShoppingList)

  document
    .querySelector('#shopping-form-icon')
    .classList.toggle('fa-cart-arrow-down', inShoppingList)
  document
    .querySelector('#shopping-form-icon')
    .classList.toggle('c-gray3', inShoppingList)
  document
    .querySelector('#shopping-form-icon')
    .classList.toggle('fa-cart-shopping', !inShoppingList)
}
