import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { createButton } from './button.js'
import { createDiv } from './div.js'
import { createHeader } from './header.js'
import { createInput } from './input.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
  dialog {
    padding: 20px 30px;
    max-width: 400px;
    margin: auto;
  }
  #delete-modal-header {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  }
  #delete-modal-body {
    margin-bottom: 20px;
  }
  #delete-modal-btn-group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin: 40px 0 20px;
  }
  #delete-modal-input {
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
export function createModalDelete({ id, password }) {
  injectStyle(css)

  const el = document.createElement('dialog')

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = 'modal-delete'
      },
    },
    header: {
      get() {
        return el.querySelector('h3').value
      },
      set(newValue = '') {
        el.querySelector('h3').value = newValue
      },
    },
  })

  createElement({ el, password })

  el.dataId = id

  return el
}

// -------------------------------
// Event listener handlers
// -------------------------------

/**
 * Close modal if clicked outside its visible area
 */
// function handleOutsideModalDeleteClick(e) {
//   const modal = e.target.closest('dialog')
//   const dialogDimensions = modal.getBoundingClientRect()
//   if (
//     e.clientX < dialogDimensions.left ||
//     e.clientX > dialogDimensions.right ||
//     e.clientY < dialogDimensions.top ||
//     e.clientY > dialogDimensions.bottom
//   ) {
//     // modal.password = ''
//     modal.close()
//   }
// }

/**
 * Handle modal confirm delete click
 */
// function handleModalConfirmDeleteClick(e) {
//   const modal = e.target.closest('dialog')
//   document.dispatchEvent(
//     new CustomEvent('modal-delete-confirmed', {
//       detail: { id: modal.dataset.id },
//     })
//   )
// }

/**
 * Handle modal cancel click
 */
// function handleModalCancelClick(e) {
//   e.preventDefault()
//   const modal = e.target.closest('dialog')
//   modal.password = ''
//   modal.close()
// }

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ el }) {
  const headerEl = createHeader({
    id: 'modal-delete-header',
    type: 'h3',
  })
  el.appendChild(headerEl)

  let spanEl = createSpan({
    id: 'modal-delete-body',
  })
  el.appendChild(spanEl)

  if (newState.get('modal-delete-password')) {
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
  // buttonEl.addEventListener('click', handleModalConfirmDeleteClick)
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
  // buttonEl.addEventListener('click', handleModalCancelClick)
  divEl.appendChild(buttonEl)

  spanEl = createSpan({
    id: 'delete-modal-message',
  })
  divEl.appendChild(spanEl)
}

/**
 *
 */
// function handleModalClose(e) {
//   e.target.querySelector('input').value = ''
// }
