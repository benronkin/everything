import { state } from '../js/state.js'
import { createDiv } from '../partials/div.js'
import { createForm } from '../partials/form.js'
import { createFileInput } from '../partials/fileInput.js'
import { createButton } from '../partials/button.js'
import { createInputGroup } from '../partials/inputGroup.js'
import { createSpan } from '../partials/span.js'

export function createMediaForm() {
  const el = createForm({
    id: 'add-media-form',
    children: [
      createFileInput({
        id: 'media-file-input',
        label: 'SELECT MEDIA',
        accept: 'image/* video/*',
        iconClass: 'fa-camera'
      }),
      createInputGroup({
        id: 'media-caption-input',
        classes: { group: 'bb-white', icon: 'fa-pencil' },
        name: 'caption',
        placeholder: 'Describe this media...'
      }),
      createDiv({
        className: 'flex mt-20',
        html: [
          createButton({
            id: 'upload-media-button',
            className: 'primary',
            html: '<i class="fa-solid fa-upload"></i> Upload',
            type: 'submit',
            disabled: true
          }),
          createSpan({ className: 'form-message' })
        ]
      })
    ]
  })

  el.className = 'hidden'

  react(el)
  listen(el)

  return el
}

function react(el) {
  state.on('icon-click:add-media-toggle', 'media form', () => {
    el.classList.toggle('hidden')
    el.querySelector('input[type="file"]').value = ''
    el.querySelector('span.file-name').innerHTML = ''
    el.querySelector('#media-caption-input').value = ''
    el.querySelector('.form-message').insertHtml('')
  })

  state.on('button-click:upload-media-button', 'media form', ({ e }) => {
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
    state.set('media-form-submit', formData)
  })

  state.on('media-upload-response', 'media.form.js', (message) => {
    const formMessage = el.querySelector('.form-message')

    formMessage.insertHtml(message)

    if (message === 'media_uploaded') {
      el.querySelector('button').disabled = false
      el.querySelector('#media-caption-input').value = ''
      el.querySelector('span.file-name').innerHTML = ''
      el.querySelector('input[type="file"]').value = ''
    } else {
      console.error(message)
      formMessage.insertHtml(message)
    }
    el.querySelector('button').removeAttribute('disabled')
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
