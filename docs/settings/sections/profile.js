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
      name: 'first_name',
      classes: { icon: 'fa-user', input: 'field' },
      placeholder: 'Enter name',
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'bookmarks',
      classes: { icon: 'fa-bookmark', input: 'field', group: 'mt-30' },
      placeholder: 'Enter your bookmarks note ID',
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

  const user = state.get('user')
  if (user) {
    insertImage(user.avatar, el)
    el.querySelector('[name="first_name"]').value = user.first_name || 'nope'
    el.querySelector('[name="bookmarks"]').value = user.bookmarks || ''
  }
}

function react(el) {
  state.on('button-click:delete-avatar-btn', 'profile', async () => {
    await deleteAvatar()
    const user = state.get('user')
    delete user.avatar
    state.set('user', user)
  })
}

function listen(el) {
  el.querySelectorAll('.field').forEach((f) =>
    f.addEventListener('change', (e) => {
      state.set('profile-field', { name: e.target.name, value: e.target.value })
    })
  )
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
