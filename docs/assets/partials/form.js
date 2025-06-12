/*
  This module creates a custom form. 
  It expects one or more children (fully formed input or fileInput)
  as opposed to creating an input like formHorizontal does.

  DO NOT listen to form submissions here since the form lacks
  a submit button so hitting enter might submit the form without
  firing its submit event.
*/

import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
form button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
form .input-group {
  width: 100%;
  display: flex;
  align-items: center;
}  
form .input-group i {
  padding-left: 0;  
}
form input {
  margin: 0;
  width: 100%;
}
form .message {
  margin-left: 20px;
  font-size: 0.9rem;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a custom form
 */
export function createForm({ id, className, children = [] }) {
  injectStyle(css)

  const el = document.createElement('form')

  el.clear = clear.bind(el)
  el.disableButton = disableButton.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  className && (el.className = className)

  build({ el, children })
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element.
 */
function build({ el, children }) {
  for (const child of children) {
    el.appendChild(child)
  }
}

/**
 *
 */
function listen(el) {
  if (el.querySelector('button')) {
    el.addEventListener('submit', () => handleFormSubmit(el.id))
    return
  }

  // this handler is needed in cases where the form lacks
  // a submit type button, yet the form might still submit
  // without firing its submit event
  el.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleFormSubmit(el.id)
    }
  })

  // for shopping auto-suggest
  el.addEventListener('keyup', (e) => {
    // without this, add-task input reloads the page
    if (e.key === 'Enter') e.preventDefault()

    state.set(`form-keyup:${el.id}`, {
      key: e.key,
      value: el.querySelector('input').value,
    })
  })
}

/**
 *
 */
function handleFormSubmit(id) {
  state.set(`form-submit:${id}`, { id })
  log('form sets form-submit with value')
}

// -------------------------------
// Element methods
// -------------------------------

/**
 * Clear all elements of the form
 */
function clear() {
  this.reset()
  if (this.message) {
    this.message = ''
  }
  disableButton()
}

/**
 *
 */
function disableButton() {
  const button = this.querySelector('button')
  if (!button) {
    return
  }
  button.disabled = true
}
