import { injectStyle } from '../js/ui.js'
import { createButton } from './button.js'
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
.form-horizontal-input-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}
.form-horizontal .input-group {
  width: 100%;
  display: flex;
  align-items: center;
}  
.form-horizontal .input-group i {
  padding-left: 0;  
}
.form-horizontal .form-horizontal input {
  margin: 0;
  width: 100%;
}
.form-horizontal .message {
  padding: 10px;
  font-size: 0.75rem;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom horizontal form
 */
export function createFormHorizontal({
  id = '',
  inputType = 'text',
  inputName = '',
  placeholder = '',
  inputAutoComplete = '',
  buttonIconClass = '',
  formIconClass = '',
  submitText,
  value = '',
  disabled = false,
  events = {},
  inputEvents = {},
}) {
  injectStyle(css)

  const el = document.createElement('form')

  Object.defineProperties(el, {
    disabled: {
      get() {
        return el.dataset.disabled === 'true'
      },
      set(v) {
        el.dataset.disabled = v
        el.querySelector('button').disabled = v
      },
    },
    focused: {
      set(v) {
        if (v) {
          this.querySelector('input').focus()
        } else {
          this.querySelector('input').blur()
        }
      },
    },
    message: {
      get() {
        return el.querySelector('.message').textContent
      },
      set(message) {
        el.querySelector('.message').textContent = message
      },
    },
    submit: {
      get() {
        return el.querySelector('button').textContent
      },
      set(value) {
        el.querySelector('button').textContent = value
      },
    },
    value: {
      get() {
        return el.querySelector('input').value
      },
      set(value) {
        el.querySelector('input').value = value
      },
    },
  })

  addElementParts({
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

  addEventHandlers({ el, events, inputEvents })

  try {
    el.value = value
  } catch (e) {
    // fail silently for vitest
  }
  el.id = id
  el.dataset.id = id
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
function addElementParts({
  el,
  inputType,
  inputName,
  placeholder,
  inputAutoComplete,
  buttonIconClass,
  formIconClass,
  submitText,
  value,
  disabled,
}) {
  let buttonEl

  const inputWrapper = document.createElement('div')
  inputWrapper.classList.add('form-horizontal-input-wrapper')

  el.appendChild(inputWrapper)

  const divEl = document.createElement('div')
  divEl.className = 'input-group'
  if (formIconClass) {
    const formIcon = createIcon({ className: formIconClass })
    divEl.appendChild(formIcon)
  }
  inputWrapper.appendChild(divEl)

  const inputEl = createInput({
    value,
    type: inputType,
    name: inputName,
    placeholder,
    inputAutoComplete,
  })
  divEl.appendChild(inputEl)

  if (submitText) {
    buttonEl = createButton({
      iconClass: buttonIconClass,
      value: submitText,
      type: 'submit',
      disabled,
    })
    inputWrapper.appendChild(buttonEl)
  }

  const spanEl = createSpan({})
  spanEl.className = 'message'
  el.appendChild(spanEl)
}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers({ el, events, inputEvents }) {
  for (const [k, v] of Object.entries(events)) {
    el.addEventListener(k, v)
  }

  for (const [k, v] of Object.entries(inputEvents)) {
    el.querySelector('input').addEventListener(k, v)
  }
}
