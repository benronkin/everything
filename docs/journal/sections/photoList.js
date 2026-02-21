/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { state } from '../../assets/js/state.js'
import { createPhotoItem } from './photoItem.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function photoList() {
  injectStyle(css)

  const el = createList({
    id: 'photo-list',
  })

  react(el)
  return el
}

function react(el) {
  state.on('photos-metadata', 'photoList', ({ error, photos }) => {
    el.deleteChildren()

    const children = photos.map((photo) =>
      createPhotoItem({
        id: photo.id,
        imgSrc: photo.url,
        caption: photo.caption,
      }),
    )

    el.addChildren(children)
  })
}
