import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { createForm } from './form.js'
import { createButton } from './button.js'
import { createInputGroup } from './inputGroup.js'
import { createSpan } from './span.js'
import { log } from '../_assets/js/logger.js'

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
  type = 'text',
  name,
  placeholder,
  autocomplete,
  buttonIconClass,
  formIconClass,
  submitText,
  value,
  disabled = false,
}) {
  injectStyle(css)

  const el = createForm({
    id,
    type,
    name,
    placeholder,
    autocomplete,
    value,
    submitText,
  })

  build({
    el,
    name,
    type,
    placeholder,
    autocomplete,
    buttonIconClass,
    formIconClass,
    submitText,
    disabled,
  })

  listen(el)

  el.className = 'form-horizontal'

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
  type,
  name,
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
      classes: { icon: formIconClass },
      placeholder,
      type,
      name,
      autocomplete,
      value,
    })
  )

  if (submitText) {
    el.appendChild(
      createButton({
        iconClass: buttonIconClass,
        className: 'primary',
        html: submitText,
        disabled,
      })
    )
  }

  el.appendChild(createSpan({ className: 'form-message' }))
}

/**
 * Set up event listeners
 */
function listen(el) {
  // this handler is needed in cases where the form lacks
  // a submit type button, yet the form might still submit
  // without firing its submit event
  el.querySelector('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputEl = e.target
      const stateValue = { id: el.id, [inputEl.name]: inputEl.value }
      newState.set(`form-submit:${el.id}`, stateValue)
      log(
        `formHorizontal sets form submit with value: ${JSON.stringify(
          stateValue
        )}`
      )
    }
  })
}
