import { injectStyle } from '../../_assets/js/ui.js'
import { newState } from '../../_assets/js/newState.js'
import { createForm } from '../../_partials/form.js'
import { createFileInput } from '../../_partials/fileInput.js'
import { createButton } from '../../_partials/button.js'
import { createInput } from '../../_partials/input.js'
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
export function form() {
  injectStyle(css)

  const el = createForm({
    children: [
      createFileInput({
        id: 'photo-file-input',
        label: 'Select image',
        accept: 'image/*',
        iconClass: 'fa-camera',
      }),
      createInput({
        id: 'photo-caption-input',
        className: 'bb-white',
        name: 'caption',
        type: 'text',
        placeholder: 'Describe this photo...',
        maxLength: '200',
      }),
      createInput({
        id: 'photo-entry-id',
        type: 'hidden',
        name: 'entry',
      }),
      createButton({
        className: 'fa-cloud-upload',
        html: 'Upload',
        type: 'submit',
        disabled: true,
      }),
      createSpan({ className: 'message' }),
    ],
  })

  build(el)
  react(el)
  listen(el)

  el.id = 'add-photo-form'
  el.className = 'hidden'

  // events: {
  //       // set the form's button's disabled
  //       // based on file input contents
  //       change: () => {
  //         const el = getEl('add-photo-form')
  //         const fileInput = el.querySelector('input[type="file"]')
  //         el.disabled = !(fileInput?.files?.length > 0)
  //       },
  //     },

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {}

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {})
}
