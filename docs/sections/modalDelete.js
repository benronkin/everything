/* 
  Don't use this file. Instead, use a specific modal (e.g modalDelete)
*/

import { injectStyle } from '../js/ui.js'
import { createButton } from '../partials/button.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createInput } from '../partials/input.js'
import { createSpan } from '../partials/span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
  dialog {
    padding: 20px 30px;
    max-width: 400px;
    margin: auto;
  }
  [data-id="delete-modal-header"] {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  }
  [data-id="delete-modal-body"] {
    margin-bottom: 20px;
  }
  [data-id="delete-modal-btn-group"] {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin: 40px 0 20px;
  }
  [data-id="delete-modal-input"] {
    width: 100%;
    padding: 8px 10px;
    margin: 0;
  }
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a modal-delete
 */
export function createModalDelete({ header, body, id, password = false }) {
  injectStyle(css)

  const el = document.createElement('dialog')

  Object.defineProperties(el, {
    body: {
      get() {
        return el.querySelector('[data-id="delete-modal-body"]').innerHTML
      },
      set(newValue = '') {
        el.querySelector('[data-id="delete-modal-body"]').innerHTML = newValue
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = newValue
      },
    },
    header: {
      get() {
        return el.querySelector('[data-id="delete-modal-header"]').innerHTML
      },
      set(newValue = '') {
        el.querySelector('[data-id="delete-modal-header"]').innerHTML = newValue
      },
    },
    message: {
      get() {
        return el.querySelector('[data-id="delete-modal-message"]').innerHTML
      },
      set(newValue = '') {
        el.querySelector('[data-id="delete-modal-message"]').innerHTML =
          newValue
      },
    },
    password: {
      get() {
        return el.dataset.password === 'true'
      },
      set(newValue = false) {
        el.dataset.password = newValue
      },
    },
  })

  createElement({ el, password })

  el.addEventListener('click', handleOutsideModalDeleteClick)
  el.addEventListener('close', handleModalClose)

  id && (el.dataId = id)
  password && (el.password = password)
  el.header = header
  el.body = body

  return el
}

// -------------------------------
// Event listener handlers
// -------------------------------

/**
 * Close modal if clicked outside its visible area
 */
function handleOutsideModalDeleteClick(e) {
  const modal = e.target.closest('dialog')
  const dialogDimensions = modal.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    // modal.password = ''
    modal.close()
  }
}

/**
 * Handle modal confirm delete click
 */
function handleModalConfirmDeleteClick(e) {
  const modal = e.target.closest('dialog')
  document.dispatchEvent(
    new CustomEvent('delete-confirmed', {
      detail: { id: modal.dataset.id },
    })
  )
}

/**
 * Handle modal cancel click
 */
function handleModalCancelClick(e) {
  e.preventDefault()
  const modal = e.target.closest('dialog')
  // modal.password = ''
  modal.close()
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ el, password }) {
  const headerEl = createHeader({
    id: 'delete-modal-header',
    type: 'h3',
  })
  el.appendChild(headerEl)

  let spanEl = createSpan({
    id: 'delete-modal-body',
  })
  el.appendChild(spanEl)

  if (password) {
    const inputEl = createInput({
      type: 'password',
      name: 'password',
      autocomplete: 'new-password',
      placeholder: 'Password',
      id: 'modal-delete-input',
    })
    el.appendChild(inputEl)
  }

  let divEl = createDiv({ id: 'delete-modal-btn-group' })
  el.appendChild(divEl)

  let buttonEl = createButton({
    id: 'delete-modal-delete-btn',
    value: 'Delete',
  })
  buttonEl.addEventListener('click', handleModalConfirmDeleteClick)
  divEl.appendChild(buttonEl)

  buttonEl = createButton({
    id: 'cancel-modal-delete-btn',
    value: 'Cancel',
    classes: {
      active: 'primary',
      base: 'bordered',
      hover: 'primary',
    },
  })
  buttonEl.addEventListener('click', handleModalCancelClick)
  divEl.appendChild(buttonEl)

  spanEl = createSpan({
    id: 'delete-modal-message',
  })
  divEl.appendChild(spanEl)
}

/**
 *
 */
function handleModalClose(e) {
  e.target.querySelector('input').value = ''
}
