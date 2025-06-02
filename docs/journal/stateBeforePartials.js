/* 
  This module sets up state variables that are used during
  partial construction.
*/

import { newState } from '../js/newState.js'

// ----------------------
// Exports
// ----------------------

/**
 * Set state variables used during partial construction
 * exported for journal.js and delete.test.js
 */
export function setStateBeforePartials() {
  newState.set('modal-delete-password', () => true)

  // ----------------------
  // State subscribers
  // ----------------------

  newState.on('main-documents', 'journal stateBeforePartials', () => {
    // >>>>>> CONTINUE FROM HERE <<<<<<<<<<<<<<<<<
    // update click events to house active-doc full document not just id
    // getEl('image-gallery').value = ''
    // populateJournalImages(journal.id)
    // getEl('main-panel').hidden = false
  })
}
