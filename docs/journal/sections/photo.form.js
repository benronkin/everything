import { state } from '../../_assets/js/state.js'
import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createForm } from '../../_partials/form.js'
import { createFileInput } from '../../_partials/fileInput.js'
import { createButton } from '../../_partials/button.js'
import { createInput } from '../../_partials/input.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createSpan } from '../../_partials/span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createPhotoForm() {
  injectStyle(css)

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

  build(el)
  react(el)
  listen(el)

  el.className = 'hidden'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.addEventListener('change', () => {
    const fileInput = el.querySelector('input[type="file"]')
    if (fileInput?.files?.length) {
      delete el.querySelector('button').disabled
    } else {
      el.querySelector('button').disabled = true
    }
  })
}

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('icon-click:add-photo-toggle', 'mainPanel', () => {
    el.classList.toggle('hidden')

    el.querySelector('input[type="file"]').value = ''
    el.querySelector('#photo-caption-input').value = ''
    el.querySelector('.form-message').insertHtml('')
  })
}

/**
 *
 */
function listen(el) {
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
