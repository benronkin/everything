import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.journal-photo {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 10px;
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
  const flexEl = createDiv({ className: 'flex' })
  el.appendItem(flexEl)
}
const html = `

  <div class="group collapsed">
  <i class="group-expander fa-solid fa-chevron-left collapsed"></i>
  <i class="fa-solid fa-trash hidden"></i>
  </div>
  <span class="photo-message"></span>

<img />
<input type="text" />
`
