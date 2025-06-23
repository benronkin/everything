/* global imageCompression */
import { createAvatar } from '../../users/users.api.js'
import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createForm } from '../../assets/partials/form.js'
import { createFileInput } from '../../assets/partials/fileInput.js'
import { createButton } from '../../assets/partials/button.js'
import { createSpan } from '../../assets/partials/span.js'

const css = `
`

export function createAvatarForm() {
  injectStyle(css)

  const el = createForm({
    id: 'profile-avatar',
    children: [
      createFileInput({
        id: 'photo-file-input',
        label: 'SELECT PHOTO',
        accept: 'image/*',
        iconClass: 'fa-camera',
      }),
      createSpan({ className: 'form-message' }),
    ],
  })

  build(el)
  react(el)
  listen(el)

  return el
}

function build(el) {}

function react(el) {
  state.on('icon-click:add-photo-toggle', 'photo form', () => {
    el.classList.toggle('hidden')
    el.querySelector('input[type="file"]').value = ''
    el.querySelector('span.file-name').innerHTML = ''
    el.querySelector('#photo-caption-input').value = ''
    el.querySelector('.form-message').insertHtml('')
  })
}

function listen(el) {
  el.querySelector('#hidden-file-input').addEventListener(
    'change',
    async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const compressionOptions = {
        maxWidthOrHeight: 125,
        useWebWorker: true,
        fileType: 'image/jpeg',
        exifOrientation: null,
      }

      try {
        const compressed = await imageCompression(file, compressionOptions)
        const formData = new FormData()
        formData.set('file', compressed)
        formData.set('entry', state.get('active-doc'))

        const { message, url } = await createAvatar(formData)
        const user = state.get('user')
        user.avatar = url
        state.set('user', user)
        log(message)
      } catch (error) {
        console.error(error)
      }
    }
  )
}
