import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createCollapsibleGroup } from '../../_partials/collapsibleGroup.js'
import { createIcon } from '../../_partials/icon.js'
import { createSpan } from '../../_partials/span.js'
import { createImage } from '../../_partials/image.js'
import { createInput } from '../../_partials/input.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
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

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for the custom item
 */
export function createPhotoItem({ id, imgSrc, caption }) {
  injectStyle(css)

  const el = createDiv({ id, className: 'photo-item container' })

  build(el)

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
      className: 'journal-photo-caption',
      placeholder: 'Add caption...',
    })
  )
}
