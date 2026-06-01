import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createCollapsibleGroup } from '../../assets/partials/collapsibleGroup.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createImage } from '../../assets/partials/image.js'
import { createMarkdown } from './markdown.js'
import { state } from '../js/state.js'

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

/**
 * Constructor for the custom item
 * @param {String} id The id of the image
 */
export function createPhotoItem(obj) {
  injectStyle(css)

  const { id, imgSrc } = obj

  const el = createDiv({ id, className: 'photo-item container' })

  build({ el, obj })
  react(el)
  listen(el)

  imgSrc && (el.querySelector('img').src = imgSrc)

  return el
}

function build({ el, obj }) {
  const markdownToggleId = `ev${crypto.randomUUID()}`

  const cgEl = createCollapsibleGroup({
    collapsed: true,
    html: [
      createIcon({ classes: { primary: 'fa-pencil' }, id: markdownToggleId }),
      createIcon({ classes: { primary: 'fa-trash' } })
    ]
  })
  el.appendChild(cgEl)

  el.appendChild(createImage({ className: 'journal-photo' }))

  el.appendChild(
    createMarkdown({
      className: 'photo-caption mt-20 w-100',
      placeholder: 'Add caption...',
      name: 'caption',
      toggleId: markdownToggleId,
      value: obj.caption || ''
    })
  )
}

function react(el) {
  state.on('photo-delete-response', 'photoItem', ({ error }) => {
    const modalDelete = document.getElementById('modal-delete')

    if (error) {
      modalDelete.message(error)

      return
    } else {
      el.remove()
      modalDelete.showPassword()
      modalDelete.dataset.photo = ''
    }
  })

  state.on('button-click:modal-cancel-btn', 'photoItem', () => {
    el.querySelector('.fa-trash').removeAttribute('disabled')
    const modalDelete = document.getElementById('modal-delete')
    modalDelete.showPassword()
    modalDelete.dataset.photo = ''
  })

  state.on('photo-caption-response', 'photoItem', ({ error, message }) => {
    // el.querySelector('.photo-message').insertHtml(error || message)
  })
}

function listen(el) {
  el.querySelector('.fa-trash').addEventListener('click', async (e) => {
    const parent = e.target.closest('.photo-item')
    const id = parent.id
    const caption = parent.querySelector('.markdown-wrapper').getValue()

    const modalDelete = document.getElementById('modal-delete')

    modalDelete.setHeader('Delete image')
    modalDelete.setBody(caption ? `Delete "${caption}"?` : 'Delete this image?')
    modalDelete.hidePassword()

    modalDelete.dataset.photo = id
    modalDelete.showModal()
  })
}
