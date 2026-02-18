import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createForm } from '../../assets/partials/form.js'
import { createFileInput } from '../../assets/partials/fileInput.js'
import { createButton } from '../../assets/partials/button.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSpan } from '../../assets/partials/span.js'

export function createPhotoForm() {
  const el = createForm({
    id: 'add-photo-form',
    children: [
      createFileInput({
        id: 'photo-file-input',
        label: 'SELECT PHOTO',
        accept: 'image/*',
        iconClass: 'fa-camera',
      }),
      createInputGroup({
        id: 'photo-caption-input',
        classes: { group: 'bb-white', icon: 'fa-pencil' },
        name: 'caption',
        placeholder: 'Describe this photo...',
      }),
      createDiv({
        className: 'flex mt-20',
        html: [
          createButton({
            id: 'upload-photo-button',
            className: 'primary',
            html: '<i class="fa-solid fa-upload"></i> Upload',
            type: 'submit',
            disabled: true,
          }),
          createSpan({ className: 'form-message' }),
        ],
      }),
    ],
  })

  el.className = 'hidden'

  react(el)
  listen(el)

  return el
}

function react(el) {
  state.on('icon-click:add-photo-toggle', 'photo form', () => {
    el.classList.toggle('hidden')
    el.querySelector('input[type="file"]').value = ''
    el.querySelector('span.file-name').innerHTML = ''
    el.querySelector('#photo-caption-input').value = ''
    el.querySelector('.form-message').insertHtml('')
  })

  state.on('button-click:upload-photo-button', 'photo form', ({ e }) => {
    e.preventDefault()

    const formMessage = el.querySelector('.form-message')

    const formData = new FormData(el)

    const file = formData.get('file')
    if (!file || file.size === 0) {
      const message = 'Please select an image'
      formMessage.insertHtml(message)
      return
    }

    el.querySelector('button').disabled = true
    formMessage.insertHtml('Uploading...')
    state.set('photo-form-submit', formData)
  })

  state.on('photo-upload-response', 'photo.form.js', (message) => {
    const formMessage = el.querySelector('.form-message')

    formMessage.insertHtml(message)

    if (message === 'Photo uploaded') {
      el.querySelector('button').disabled = false
      el.querySelector('#photo-caption-input').value = ''
      el.querySelector('span.file-name').innerHTML = ''
      el.querySelector('input[type="file"]').value = ''
      // refresh photos to show added photo
      document.querySelector('#photo-list').showPhotos()
    } else {
      console.error(message)
      formMessage.insertHtml(message)
      el.querySelector('button').removeAttribute('disabled')
    }
  })
}

function listen(el) {
  el.addEventListener('change', () => {
    const fileInput = el.querySelector('input[type="file"]')
    if (fileInput?.files?.length) {
      delete el.querySelector('button').disabled
    } else {
      el.querySelector('button').disabled = true
    }
  })

  el.querySelector('#hidden-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      el.querySelector('.file-name').insertHtml(file.name)
      el.querySelector('button').removeAttribute('disabled')
      delete el.querySelector('button').dataset.disabled
    } else {
      el.querySelector('.file-name').insertHtml('')
      el.querySelector('button').disabled = true
      el.querySelector('button').dataset.disabled = true
    }
  })
}
