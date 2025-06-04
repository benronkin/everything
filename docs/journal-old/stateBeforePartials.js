/* 
  This module sets up state variables that are used during
  partial construction.
*/

import { newState } from '../_assets/js/newState.js'

// ----------------------
// Exports
// ----------------------

/**
 * Set state variables used during partial construction
 * exported for journal.js and delete.test.js
 */
export function setStateBeforePartials() {
  newState.set('modal-delete-password', () => true)
}
