import { injectStyle } from '../../assets/js/ui.js'
import { createHeader } from '../../assets/partials/header.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createAvatarForm } from './avatar.form.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

const css = `
`

export function profile() {
  injectStyle(css)

  const el = createDiv({ id: 'profile-wrapper' })

  build(el)
  react(el)
  listen(el)

  return el
}

function build(el) {
  log(state.get('user'))

  el.appendChild(
    createHeader({
      className: 'mb-20',
      html: 'Profile',
      type: 'h4',
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'user-name',
      classes: { icon: 'fa-user' },
      placeholder: 'Enter name',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mt-20', icon: 'fa-circle-user' },
      html: 'Avatar',
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex align-start mt-10',
      html: [
        createAvatarForm(),
        createButton({
          id: 'delete-avatar-btn',
          html: 'delete photo',
          className: 'bordered',
        }),
      ],
    })
  )
}

function react(el) {}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
