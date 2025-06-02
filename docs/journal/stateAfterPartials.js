/* 
  This module sets up state variables that are consumed by partials.
*/

import { newState } from '../js/newState.js'
import { createEntryTitle } from './events.js'
import { createMainDocumentItem } from '../partials/mainDocumentItem.js'

/**
 * Set various state variables
 * @param {Array<Object>} journal - list of journal entries
 */
export function setStateAfterPartials(journalEntries) {
  newState.set('main-documents', {
    docs: journalEntries,
    render: ({ id, location, visit_date }) =>
      createMainDocumentItem({
        id,
        value: createEntryTitle(location, visit_date),
      }),
  })

  newState.setDefaultPage('journal')
}
