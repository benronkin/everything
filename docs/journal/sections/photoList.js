/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { state } from '../../assets/js/state.js'
import { createPhotoItem } from './photoItem.js'
import { fetchEntryPhotosMetadata } from '../journal.api.js'
import { log } from '../../assets/js/logger.js'

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

  el.showPhotos = showPhotos.bind(el)

  return el
}

// ----------------------
// Object methods
// ----------------------

/**
 *
 */
async function showPhotos() {
  const doc = state.get('active-doc')
  this.deleteChildren()

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

  this.addChildren(children)
}
