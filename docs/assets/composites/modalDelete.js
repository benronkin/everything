import { state } from '../js/state.js'
import { injectStyle } from '../js/ui.js'
import { createButton } from '../partials/button.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'
import { createInput } from '../partials/input.js'
import { createSpan } from '../partials/span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.modal {
  padding: 0;
  max-width: 400px;
}
.modal .input-group {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
}  
.modal .input-group i {
  padding: 8px 0;  
  color: var(--gray6);
}
.modal .modal-header {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 12px 20px;
  margin: 0;
}
.modal .modal-body {
  display: block;
  padding: 30px 20px;
  margin: 0;
}
.modal .input-group {
  padding: 0 20px 20px;
}
.modal .input-group input {
  flex: 1 1 auto;   /* or simply flex: 1;             */
  width: 100%;      /* keeps it full-width in Safari   */
  min-width: 0;     /* prevents overflow in Chrome     */
}
.modal .modal-button-group {
  display:flex; 
  justify-content:flex-start;
  align-items: center;
  gap:20px; 
  padding: 12px 20px;
  margin: 0;
}
`

export function createModalDelete({ password = true }) {
  injectStyle(css)

  const el = document.createElement('dialog')

  build({ el, password })
  react({ el, password })
  listen({ el, password })

  el.id = 'modal-delete'

  el.message = message.bind(el)
  el.getPassword = getPassword.bind(el)
  el.setPassword = setPassword.bind(el)

  return el
}

function build({ el, password }) {
  const divEl = createDiv({ className: 'modal' })
  el.appendChild(divEl)

  const headerEl = createHeader({
    className: 'modal-header',
    type: 'h3',
  })
  divEl.appendChild(headerEl)

  let spanEl = createSpan({
    className: 'modal-body',
  })
  divEl.appendChild(spanEl)

  if (password) {
    divEl.appendChild(
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

  const groupEl = createDiv({ className: 'modal-button-group' })
  divEl.appendChild(groupEl)

  let buttonEl = createButton({
    id: 'modal-delete-btn',
    html: 'Delete',
    className: 'primary',
  })

  groupEl.appendChild(buttonEl)

  buttonEl = createButton({
    id: 'modal-cancel-btn',
    html: 'Cancel',
    className: 'bordered',
  })

  groupEl.appendChild(buttonEl)

  spanEl = createSpan({
    className: 'modal-message smaller',
  })
  divEl.appendChild(spanEl)
}

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
  this.querySelector('.modal-message').insertHtml(text)
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
