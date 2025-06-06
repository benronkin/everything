/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../../_assets/js/ui.js'
import { createList } from '../../_partials/list.js'
import { newState } from '../../_assets/js/newState.js'
import { createImageGalleryItem } from './imageGalleryItem.js'
import { getR2MetaData } from '../../_assets/js/r2MetaData.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createImageGalleryList({ id, className, emptyState }) {
  injectStyle(css)

  const el = createList({
    id,
    className,
    itemClass: 'ig-item',
    emptyState,
  })

  // Reactivity for image-gallery lists
  // ----------------------------------
  newState.on('active-doc', 'imageGalleryList', (doc) => {
    populateJournalImages(el, doc.id)
  })

  return el
}

// ----------------------
// Helpers
// ----------------------

/**
 * Populate the journal photos
 */
async function populateJournalImages(el, id) {
  el.deleteChildren()

  const url = `/journal/photos/read?entry=${id}`
  const photos = await getR2MetaData(url)
  const children = photos.map((photo) =>
    createImageGalleryItem({
      id: photo.id,
      imgSrc: photo.url,
      caption: photo.caption,
      // expanderCb: toggleExpander,
      // inputCb: handleCaptionChange,
      // trashCb: handlePhotoDelete,
    })
  )

  el.addChildren(children)
}
