import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createHeader } from '../../_partials/header.js'
import { createForm } from '../../_partials/form.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createButton } from '../../_partials/button.js'
import { createSpan } from '../../_partials/span.js'
import { setMessage } from '../../_assets/js/ui.js'
import { login } from '../home.api.js'
import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  flex-grow: 1;
  justify-content: flex-start;
  padding-top: 20px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  listen(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(
    createHeader({
      type: 'h4',
      html: 'Enter your email address to gain access',
    })
  )

  el.appendChild(
    createForm({
      id: 'login-form',
      className: 'mt-20',
      children: [
        createInputGroup({
          type: 'email',
          name: 'email',
          placeholder: 'Email address',
          autocomplete: false,
          classes: { icon: 'fa-envelope' },
        }),
        createButton({
          className: 'primary w-100 mt-20',
          html: 'SEND',
          type: 'submit',
          disabled: true,
        }),
        createSpan({
          className: 'form-message w-100 ta-center',
        }),
      ],
    })
  )
}

/**
 * Subscribe to state.
 */
function listen(el) {
  el.addEventListener('submit', (e) => handleLogin({ e, el }))

  el.querySelector('input').addEventListener('keyup', (e) => {
    if (e.target.value.trim().length) {
      el.querySelector('button').removeAttribute('disabled')
    } else {
      el.querySelector('button').disabled = true
    }
  })
}

/**
 * Handle login form submit
 */
export async function handleLogin({ e, el }) {
  e.preventDefault()

  const btn = el.querySelector('button')
  const msg = el.querySelector('.form-message')
  const input = el.querySelector('input')

  btn.disabled = true
  input.disabled = true
  setMessage({ message: '' })
  msg.classList.remove('c-red3')
  msg.insertHtml('Checking. Please wait...')

  const email = el.querySelector('input').value.trim()
  try {
    const { status, message } = await login(email)

    btn.removeAttribute('disabled')
    input.removeAttribute('disabled')

    if (status !== 200) {
      throw new Error(message)
    }

    msg.insertHtml(message)
  } catch (error) {
    msg.classList.add('c-red3')
    msg.insertHtml(error.message)
    console.trace(error)
  }
}
