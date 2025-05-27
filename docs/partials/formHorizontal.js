import { injectStyle } from '../js/ui.js'
import { createButton } from './button.js'
import { createIcon } from './icon.js'
import { createInput } from './input.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-horizontal-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.form-horizontal-wrapper button {
  margin-left: 20px;
}
.form-horizontal-wrapper button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.form-horizontal-wrapper .form-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}
.form-horizontal-wrapper .input-group {
  width: 100%;
  display: flex;
  align-items: center;
}  
.form-horizontal-wrapper .input-group i {
  padding-left: 0;  
}
.form-horizontal-wrapper .form-horizontal input {
  margin: 0;
  width: 100%;
}
.form-horizontal-wrapper .message {
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
  formId,
  inputType,
  inputName,
  placeholder,
  inputAutoComplete,
  buttonIconClass = '',
  formIconClass = '',
  submitText,
  value,
  disabled = false,
  events,
}) {
  injectStyle(css)

  const el = document.createElement('div')
  el.className = 'form-horizontal-wrapper'
  let buttonEl

  const formEl = document.createElement('form')
  formEl.classList.add('form-horizontal')
  if (formId) {
    formEl.dataset.id = formId
  }
  el.appendChild(formEl)

  const divEl = document.createElement('div')
  divEl.className = 'input-group'
  if (formIconClass) {
    const formIcon = createIcon({ className: formIconClass })
    divEl.appendChild(formIcon)
  }
  formEl.appendChild(divEl)

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
    formEl.appendChild(buttonEl)
  }

  const spanEl = createSpan({})
  spanEl.className = 'message'
  el.appendChild(spanEl)

  if (events) {
    for (const [k, v] of Object.entries(events)) {
      if (k === 'submit') {
        formEl.addEventListener('submit', (e) => {
          if (!buttonEl || !buttonEl.disabled) {
            v(e)
          }
        })
      } else {
        formEl.addEventListener(k, v)
      }
    }
  }

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

  return el
}
