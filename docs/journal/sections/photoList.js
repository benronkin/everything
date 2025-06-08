/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../../_assets/js/ui.js'
import { createList } from '../../_partials/list.js'
import { newState } from '../../_assets/js/newState.js'
import { createPhotoItem } from './photoItem.js'
import { fetchEntryPhotosMetadata } from '../journal.api.js'

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
  newState.on('app-mode', 'photoList', async (appMode) => {
    if (appMode !== 'main-panel') {
      return
    }

    const doc = newState.get('active-doc')
    el.deleteChildren()

    const { photos = [], error } = await fetchEntryPhotosMetadata(doc.id)

    if (error) {
      console.error(error)
      return
    }

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
