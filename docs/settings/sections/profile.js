import { injectStyle } from '../../assets/js/ui.js'
import { createHeader } from '../../assets/partials/header.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createImage } from '../../assets/partials/image.js'
import { createAvatarForm } from './avatar.form.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { deleteAvatar } from '../../users/users.api.js'
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
          className: 'bordered hidden',
        }),
      ],
    })
  )

  el.appendChild(
    createDiv({
      id: 'avatar-wrapper',
    })
  )

  const url = state.get('user')?.avatar
  if (url) insertImage(url, el)
}

function react(el) {
  state.on('user', 'profile', (user) => insertImage(user.avatar, el))
}

function listen(el) {
  el.querySelector('#delete-avatar-btn').addEventListener('click', async () => {
    const { message } = await deleteAvatar()
    const user = state.get('user')
    delete user.avatar
    state.set('user', user)
  })
}

function insertImage(url, el) {
  const avatarWrapperEl = el.querySelector('#avatar-wrapper')
  const deleteAvatarBtn = el.querySelector('#delete-avatar-btn')
  avatarWrapperEl.innerHTML = ''
  deleteAvatarBtn.classList.add('hidden')
  if (!url) {
    log('Did not receive avatar url')
    return
  }
  const imgEl = createImage({ src: url })
  avatarWrapperEl.insertHtml(imgEl)
  deleteAvatarBtn.classList.remove('hidden')
}
