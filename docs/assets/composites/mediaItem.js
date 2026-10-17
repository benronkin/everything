import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createCollapsibleGroup } from '../partials/collapsibleGroup.js'
import { createIcon } from '../partials/icon.js'
import { createImage } from '../partials/image.js'
import { createVideo } from '../partials/video.js'
import { createMarkdown } from './markdown.js'
import { createSpan } from '../partials/span.js'
import { state } from '../js/state.js'

const css = `
.media-item {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: none !important;
}
.media-item.container {
  padding: 0;
  width: 100%;
}
.journal-media {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 10px;
}
.journal-media-caption {
  margin-top: 20px;
}
`

/**
 * Constructor for the custom item
 * @param {String} id The id of the image
 */
export function createMediaItem(obj) {
  injectStyle(css)

  const el = createDiv({ id: obj.id, className: 'media-item container' })

  build({ el, obj })
  react(el)
  listen(el)

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

  let media
  switch (obj.mediaType) {
    case 'image':
      media = createImage({ className: 'journal-media' })
      obj.src && (media.src = obj.src)
      break
    case 'video':
      media = createVideo({ className: 'journal-media' })
      obj.src && (media.src = obj.src)
      break
    default:
      media = createDiv({ html: `Unknwon media type: "${obj.mediaType}"` })
  }
  el.appendChild(media)

  el.appendChild(
    createMarkdown({
      className: 'media-caption mt-20 w-100',
      placeholder: 'Add caption...',
      name: 'caption',
      toggleId: markdownToggleId,
      value: obj.caption || ''
    })
  )
}

function react(el) {
  state.on('media-delete-response', 'mediaItem', ({ error }) => {
    const modalDelete = document.getElementById('modal-delete')

    if (error) {
      modalDelete.message(error)
    } else {
      el.remove()
    }
  })

  state.on('button-click:modal-cancel-btn', 'mediaItem', () => {
    el.querySelector('.fa-trash').removeAttribute('disabled')
    const modalDelete = document.getElementById('modal-delete')
    modalDelete.dataset.photo = ''
  })

  state.on('media-caption-response', 'mediaItem', ({ error, message }) => {
    // el.querySelector('.photo-message').insertHtml(error || message)
  })
}

function listen(el) {
  el.querySelector('.fa-trash').addEventListener('click', async (e) => {
    const parent = e.target.closest('.media-item')
    const id = parent.id
    const caption = parent.querySelector('.markdown-wrapper').getValue()

    const modalDelete = document.getElementById('modal-delete')
    modalDelete.config({
      header: createSpan({ html: 'Delete media' }),
      body: createSpan({
        html: caption ? `Delete "${caption}"?` : 'Delete this media?'
      }),
      password: false,
      photo: id
    })
    modalDelete.showModal()
  })
}
