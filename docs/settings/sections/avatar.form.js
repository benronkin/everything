import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createForm } from '../../assets/partials/form.js'
import { createFileInput } from '../../assets/partials/fileInput.js'
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

  listen(el)

  return el
}

function listen(el) {
  el.querySelector('#hidden-file-input').addEventListener(
    'change',
    async (e) => {
      const file = e.target.files[0]
      if (!file) return

      state.set('profile-avatar', file)
    }
  )
}
