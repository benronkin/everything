import { injectStyle } from '../_assets/js/ui.js'
import { createButton } from './button.js'
import { createInputGroup } from './inputGroup.js'
import { createIcon } from './icon.js'
import { createInput } from './input.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-horizontal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.form-horizontal button {
  margin-left: 20px;
}
.form-horizontal button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.form-horizontal .message {
  padding: 10px;
  font-size: 0.75rem;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a custom horizontal form
 */
export function createFormHorizontal({
  id,
  inputType = 'text',
  inputName,
  placeholder,
  inputAutoComplete,
  buttonIconClass,
  formIconClass,
  submitText,
  value,
  disabled = false,
  events = {},
  inputEvents = {},
}) {
  injectStyle(css)

  const el = document.createElement('form')

  build({
    el,
    id,
    inputType,
    inputName,
    placeholder,
    inputAutoComplete,
    buttonIconClass,
    formIconClass,
    submitText,
    value,
    disabled,
    events,
    inputEvents,
  })

  id && (el.id = id)
  el.className = 'form-horizontal'
  value && (el.value = value)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({
  el,
  inputType,
  inputName,
  placeholder,
  autocomplete,
  buttonIconClass,
  formIconClass,
  submitText,
  value,
  disabled,
}) {
  el.appendChild(
    createInputGroup({
      iconClass: formIconClass,
      placeholder,
      type: inputType,
      name: inputName,
      autocomplete,
      value,
    })
  )

  if (submitText) {
    el.appendChild(
      createButton({
        iconClass: buttonIconClass,
        value: submitText,
        type: 'submit',
        disabled,
      })
    )
  }

  el.appendChild(createSpan({ className: 'form-message' }))
}
