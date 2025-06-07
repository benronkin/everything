import { newState } from '../../_assets/js/newState.js'
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
    children: [
      createFileInput({
        id: 'photo-file-input',
        label: 'Select photo',
        accept: 'image/*',
        iconClass: 'fa-camera',
      }),
      createInputGroup({
        id: 'photo-caption-input',
        classes: { group: 'bb-white', icon: 'fa-tag' },
        name: 'caption',
        placeholder: 'Describe this photo...',
      }),
      createInput({
        id: 'photo-entry-id',
        type: 'hidden',
        name: 'entry',
      }),
      createDiv({
        className: 'flex mt-20',
        html: [
          createButton({
            className: 'fa-cloud-upload',
            html: 'Upload',
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

  el.id = 'add-photo-form'
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
  newState.on('icon-click:add-photo-toggle', 'mainPanel', () => {
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
  // el.addEventListener('click', () => {})
}
