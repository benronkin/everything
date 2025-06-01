/* 
  This module sets up state variables that are used during
  partial construction.
*/

import { newState } from '../js/newState.js'
import { createEntryTitle } from './events.js'

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

// ----------------------
// State subscribers
// ----------------------

newState.on('left-panel-list', (arr) => {
  const children = arr.map((j) =>
    createMenuItem({
      id: j.id,
      value: createEntryTitle(j.location, j.visit_date),
      events: { click: handleJournalLinkClick },
    })
  )
  getEl('left-panel-list').deleteChildren().addChildren(children)
  if (!newState.get('active-journal')) {
    return
  }

  // select the active recipe if it exists in the updated list
  const priorDoc = getEl('left-panel-list').getChildById(
    newState.get('active-journal')
  )
  if (!priorDoc) {
    newState.set('active-journal', null)
    return
  }
  priorDoc.selected = true

  // Handle main-panel

  const journal = state.getJournalById(id)

  getEl('journal-location').value = journal.location
  getEl('journal-visit-date').value = new Date(journal.visit_date)
    .toISOString()
    .split('T')[0]
  const notesEl = getEl('journal-notes')
  notesEl.value = journal.notes
  resizeTextarea(notesEl)
  getEl('journal-city').value = journal.city
  getEl('journal-state').value = journal.state
  getEl('journal-country').value = journal.country
  getEl('journal-id').textContent = journal.id
  getEl('photo-entry-id').value = journal.id
  getEl('image-gallery').value = ''
  populateJournalImages(journal.id)
  getEl('main-panel').hidden = false
})
