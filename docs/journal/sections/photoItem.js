import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createCollapsibleGroup } from '../../assets/partials/collapsibleGroup.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createImage } from '../../assets/partials/image.js'
import { createInput } from '../../assets/partials/input.js'
import { deleteEntryPhoto, updatePhotoCaption } from '../journal.api.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.photo-item {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: none !important;
}
.photo-item.container {
  padding: 0;
  width: 100%;
}
.photo-item:hover {
  border: none !important;
}
.journal-photo {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 10px;
}
.journal-photo-caption {
  margin-top: 20px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for the custom item
 * @param {String} id The id of the image
 */
export function createPhotoItem({ id, imgSrc, caption }) {
  injectStyle(css)

  const el = createDiv({ id, className: 'photo-item list-item container' })

  build(el)
  listen(el)

  imgSrc && (el.querySelector('img').src = imgSrc)
  caption && (el.querySelector('input').value = caption)

  return el
}

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
function build(el) {
  const cgEl = createCollapsibleGroup({
    collapsed: true,
    html: [createIcon({ classes: { primary: 'fa-trash' } })],
  })
  el.appendChild(cgEl)

  el.appendChild(createSpan({ className: 'photo-message' }))

  el.appendChild(createImage({ className: 'journal-photo' }))

  el.appendChild(
    createInput({
      className: 'photo-caption mt-20 w-100',
      placeholder: 'Add caption...',
      name: 'caption',
    })
  )
}

/**
 *
 */
function listen(el) {
  el.querySelector('.fa-trash').addEventListener('click', async (e) => {
    const parent = e.target.closest('.photo-item')
    const id = parent.id

    const trashEl = e.target
    trashEl.disabled = true
    el.querySelector('.photo-message').insertHtml('Deleting image...')

    const { error } = await deleteEntryPhoto(id)

    if (error) {
      trashEl.removeAttribute('disabled')
      el.querySelector('.photo-message').insertHtml(error.message)
      return
    }
    parent.remove()
  })

  el.querySelector('.photo-caption').addEventListener('change', async (e) => {
    const parent = e.target.closest('.photo-item')
    const id = parent.id
    const value = e.target.value

    const { message, error } = await updatePhotoCaption({ id, value })

    if (error) {
      el.querySelector('.photo-message').insertHtml(error.message)
      return
    }
    el.querySelector('.photo-message').insertHtml(message)
  })
}
