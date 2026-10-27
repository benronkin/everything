import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'

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
#shopping-form .form-message:empty {
  display: none;
}
#add-item-form-wrapper #one-off-message {
  margin: 5px 0 0 40px;
  display: flex;
  align-items: center;
  gap: 5px;
}
#add-item-form-wrapper #one-off-message span { 
  font-size: 0.9rem !important;
  color: var(--gray4);
}
#add-item-form-wrapper #make-temporary-span {
  cursor: pointer;
}
`

export function addItemForm() {
  injectStyle(css)

  const el = createDiv({
    id: 'add-item-form-wrapper',
    className: 'outer-wrapper'
  })

  el.appendChild(
    createFormHorizontal({
      inputOrTextarea: 'textarea',
      id: 'shopping-form',
      type: 'text',
      name: 'new-item',
      placeholder: 'Add item to cart',
      autocomplete: 'off',
      classes: {
        icon: 'fa-cart-shopping',
        form: 'pos-relative'
      }
    })
  )

  el.appendChild(createOneOffMessage())

  const textarea = el.querySelector('textarea')
  textarea.rows = 1

  el.querySelector('.ta-group').appendChild(
    createIcon({
      id: 'temp',
      classes: { primary: 'fa-clock' }
    })
  )

  react(el)
  listen(el)
  return el
}

/**
 *
 */
function react(el) {
  state.on('icon-click:temp', 'addItemForm', () => {
    el.querySelector('#temp').classList.toggle('primary')
    handleTempMessage()
    document.querySelector('textarea[name="new-item"]').focus()
  })

  state.on('select-click:view-select', 'addItemForm', (value) => {
    const tempIcon = el.querySelector('#temp')
    const isCart = value === 'cart'

    tempIcon.style.visibility = isCart ? 'visible' : 'hidden'

    if (!isCart) {
      tempIcon.classList.remove('primary')
    }

    el.querySelector('textarea').placeholder =
      value === 'cart'
        ? 'Add item to cart'
        : value === 'recurring'
          ? 'Add item to recurring list'
          : 'Add item to inventory'

    handleTempMessage()
  })

  state.on('suggestion-carted', 'addItemForm', () => {
    const textarea = el.querySelector('textarea')
    textarea.rows = 1
    textarea.value = ''
    handleTempMessage()
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    textarea.focus()
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('#make-temporary-span').addEventListener('click', () => {
    el.querySelector('#temp').classList.add('primary')
    handleTempMessage()
    document.querySelector('textarea[name="new-item"]').focus()
  })

  el.querySelector('#make-temporary-icon').addEventListener('click', () => {
    el.querySelector('#temp').classList.add('primary')
    handleTempMessage()
    document.querySelector('textarea[name="new-item"]').focus()
  })

  el.querySelector('textarea[name="new-item"]').addEventListener(
    'input',
    handleTempMessage
  )
}

/**
 *
 */
function createOneOffMessage() {
  const div = createDiv({ id: 'one-off-message', className: 'hidden' })
  div.appendChild(createSpan({ html: 'Looks like a one-off item.' }))
  div.appendChild(
    createSpan({
      id: 'make-temporary-span',
      html: 'Make temporary',
      className: 'c-purple3'
    })
  )
  div.appendChild(
    createIcon({
      id: 'make-temporary-icon',
      classes: { primary: 'fa-clock', other: ['c-purple3'] }
    })
  )
  return div
}

/**
 *
 */
function handleTempMessage() {
  const textarea = document.querySelector('textarea[name="new-item"]')
  const oneOffMessage = document.getElementById('one-off-message')

  if (document.querySelector('#temp').classList.contains('primary')) {
    oneOffMessage.classList.add('hidden')
    return
  }

  const view = document.getElementById('view-select').getSelected().value
  const isTemporary = document
    .getElementById('temp')
    .classList.contains('primary')

  if (view !== 'cart' || isTemporary) {
    oneOffMessage.classList.add('hidden')
    return
  }

  const value = textarea.value.trim()

  // detect a leading quantity such as 2, 1/2 or 1.5
  const units = [
    'kg',
    'g',
    'mg',
    'lb',
    'lbs',
    'oz',
    'ml',
    'l',
    'cup',
    'cups',
    'tbsp',
    'tsp'
  ]

  // escape regex characters so each unit is treated as literal text
  const escapedUnits = units.map((unit) => {
    return unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  })

  // join units with | so the regex accepts any one of them
  const unitPattern = escapedUnits.join('|')

  // match a leading whole number, fraction or decimal
  const quantityPattern = new RegExp(
    `^(?:\\d+\\/\\d+|\\d+(?:\\.\\d+)?)(?:\\s+|(?:${unitPattern})\\b)`,
    'i'
  )

  const looksLikeQuantity = quantityPattern.test(value)
  oneOffMessage.classList.toggle('hidden', !looksLikeQuantity)
}
