/*
  This module creates a custom form. 
  It expects one or more children (fully formed input or fileInput)
  as opposed to creating an input like formHorizontal does.
*/

import { injectStyle } from '../js/ui.js'
import { createButton } from './button.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.form button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.form .input-group {
  width: 100%;
  display: flex;
  align-items: center;
}  
.form .input-group i {
  padding-left: 0;  
}
.form input {
  margin: 0;
  width: 100%;
}
.form .message {
  padding: 10px;
  font-size: 0.75rem;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom form
 */
export function createForm({
  id = '',
  className = '',
  buttonIconClass = '',
  submitText = 'Submit',
  disabled = false,
  events = {},
  children = [],
}) {
  injectStyle(css)
  const el = document.createElement('form')

  el.fieldValue = fieldValue.bind(el)
  el.clear = clear.bind(el)

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.dataset.id = newValue
        el.dataset.testId = id
      },
    },
    disabled: {
      get() {
        return el.dataset.disabled === 'true'
      },
      set(v) {
        el.dataset.disabled = v
        if (v) {
          el.querySelector('button').disabled = 'disabled'
        } else {
          el.querySelector('button').removeAttribute('disabled')
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
  id && (el.dataId = id)
  el.className = `form ${className}`

  addElementParts({ el, children, buttonIconClass, submitText, disabled })
  addEventHandlers(el, events)

  return el
}

// -------------------------------
// Element methods
// -------------------------------

/**
 * Get the value of a specific input inside the form
 */
function fieldValue(id, value) {
  const el = this.querySelector(`[data-id="${id}"]`)
  if (!el) {
    throw new Error(
      `fieldValue: Oops, no input field with data-id "${id}" found`
    )
  }
  if (!value) {
    return el.value
  }
  el.value = value
  return el // for chaining
}

/**
 * Clear all elements of the form
 */
function clear() {
  this.reset()
  this.message = ''
  this.disabled = true
  return
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
  children,
  buttonIconClass,
  submitText,
  disabled,
}) {
  for (const child of children) {
    el.appendChild(child)
  }

  const buttonEl = createButton({
    iconClass: buttonIconClass,
    value: submitText,
    type: 'submit',
    disabled,
  })
  el.appendChild(buttonEl)

  const spanEl = createSpan({})
  spanEl.className = 'message'
  el.appendChild(spanEl)
}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers(el, events) {
  for (const [k, v] of Object.entries(events)) {
    if (k === 'submit') {
      el.addEventListener('submit', (e) => {
        const buttonEl = el.querySelector('buton')
        if (!buttonEl || !buttonEl.disabled) {
          v(e)
        }
      })
    } else {
      el.addEventListener(k, v)
    }
  }
}
