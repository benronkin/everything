/*
  This module creates a custom form. 
  It expects one or more children (fully formed input or fileInput)
  as opposed to creating an input like formHorizontal does.
*/

import { injectStyle } from '../_assets/js/ui.js'

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
  padding: 10px;
  font-size: 0.75rem;
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

  if (className) {
    el.className = className
  }

  build({ el, children })

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
