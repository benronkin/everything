/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../../_assets/js/ui.js'
import { createList } from '../../_partials/list.js'
import { newState } from '../../_assets/js/newState.js'
import { createPhotoItem } from './photoItem.js'
import { getR2MetaData } from '../../_assets/js/r2MetaData.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function photoList() {
  injectStyle(css)

  const el = createList({
    id: 'photo-list',
  })

  react(el)

  return el
}

// ----------------------
// Helpers
// ----------------------

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('active-doc', 'photoList', async ({ id }) => {
    el.deleteChildren()

    const url = `${newState.const('APP_URL')}/journal/photos/read?entry=${id}`
    const photos = await getR2MetaData(url)
    const children = photos.map((photo) =>
      createPhotoItem({
        id: photo.id,
        imgSrc: photo.url,
        caption: photo.caption,
      })
    )

    el.addChildren(children)
  })
}
