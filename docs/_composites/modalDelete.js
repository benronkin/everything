import { state } from '../_assets/js/state.js'
import { injectStyle } from '../_assets/js/ui.js'
import { createButton } from '../_partials/button.js'
import { createDiv } from '../_partials/div.js'
import { createHeader } from '../_partials/header.js'
import { createIcon } from '../_partials/icon.js'
import { createInput } from '../_partials/input.js'
import { createSpan } from '../_partials/span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
  dialog {
    padding: 20px 30px;
    max-width: 400px;
    width: 90%;
    margin: auto;
  }
  #modal-delete .input-group {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
}  
#modal-delete .input-group i {
  padding: 8px 0;  
  color: var(--gray6);
}
  #modal-delete-header {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  }
  #modal-delete-body {
    margin-bottom: 20px;
  }
  #modal-delete-group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin: 40px 0 20px;
  }
  #modal-delete-input {
    width: 100%;
    padding: 8px 10px;
  }
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a modal-delete
 */
export function createModalDelete({ id, password = true }) {
  injectStyle(css)

  const el = document.createElement('dialog')

  build({ el, password })
  react({ el, password })
  listen({ el, password })

  el.message = message.bind(el)
  el.getPassword = getPassword.bind(el)
  el.setPassword = setPassword.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function build({ el, password }) {
  const headerEl = createHeader({
    id: 'modal-delete-header',
    type: 'h3',
  })
  el.appendChild(headerEl)

  let spanEl = createSpan({
    id: 'modal-delete-body',
  })
  el.appendChild(spanEl)

  if (password) {
    el.appendChild(
      createDiv({
        className: 'input-group',
        html: [
          createIcon({ classes: { primary: 'fa-key' } }),
          createInput({
            type: 'password',
            name: 'password',
            autocomplete: 'new-password', // to block auto complete
            placeholder: 'Password',
            id: 'modal-delete-input',
          }),
        ],
      })
    )
  }

  let divEl = createDiv({ id: 'modal-delete-group' })
  el.appendChild(divEl)

  let buttonEl = createButton({
    id: 'modal-delete-btn',
    html: 'Delete',
    className: 'primary',
  })

  divEl.appendChild(buttonEl)

  buttonEl = createButton({
    id: 'modal-cancel-btn',
    html: 'Cancel',
    className: 'bordered',
  })

  divEl.appendChild(buttonEl)

  spanEl = createSpan({
    id: 'modal-delete-message',
    className: 'smaller',
  })
  divEl.appendChild(spanEl)
}

/**
 *
 */
export function react({ el, password }) {
  state.on('button-click:modal-cancel-btn', 'modalDelete', () => {
    password && (el.querySelector('#modal-delete-input').value = '')
    el.close()
  })
}

/**
 *
 */
function listen({ el, password }) {
  el.addEventListener('click', (e) => {
    const dialogDimensions = el.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      password && (el.querySelector('#modal-delete-input').value = '')
      el.close()
    }
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function message(text = '') {
  this.querySelector('#modal-delete-message').insertHtml(text)
}

/**
 *
 */
function getPassword() {
  return this.querySelector('#modal-delete-input').value
}

/**
 *
 */
function setPassword(value) {
  return (this.querySelector('#modal-delete-input').value = value)
}
