import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createForm } from '../../assets/partials/form.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createButton } from '../../assets/partials/button.js'
import { createSpan } from '../../assets/partials/span.js'
import { setMessage } from '../../assets/js/ui.js'
import { login } from '../home.api.js'
import { log } from '../../assets/js/logger.js'

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
#main-panel .outer-wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  listen(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(
    createDiv({
      className: 'outer-wrapper',
      html: [
        createHeader({
          type: 'h4',
          html: 'Sign in',
        }),

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
              html: 'LOG IN',
              type: 'submit',
              disabled: true,
            }),
            createSpan({
              className: 'form-message w-100 ta-center',
            }),
          ],
        }),
      ],
    })
  )
}

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
  setMessage()
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
