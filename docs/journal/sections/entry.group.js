import { log } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createTextareaGroup } from '../../_partials/textareaGroup.js'
import { updateEntry, updateJournalDefaults } from '../journal.api.js'
/*
  This module handles journal events so that the journal.js stays leaner.
  This module loads aftr all partials were created.
*/

import { newState } from '../../_assets/js/newState.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createEntryGroup() {
  const el = createDiv({ id: 'entry-group' })

  build(el)
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'journal-location',
      name: 'location',
      placeholder: 'Attraction',
      autocomplete: 'off',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-utensils' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'visit-date',
      id: 'journal-visit-date',
      type: 'date',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-calendar' },
      value: new Date().toISOString().split('T')[0],
    })
  )

  el.appendChild(
    createTextareaGroup({
      name: 'notes',
      id: 'journal-notes',
      classes: { group: 'mb-40', textarea: 'field', icon: 'fa-pencil' },
      placeholder: 'Notes...',
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'city',
      id: 'journal-city',
      placeholder: 'City',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-city' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'state',
      id: 'journal-state',
      placeholder: 'State',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-map' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'country',
      id: 'journal-country',
      placeholder: 'Country',
      classes: { input: 'field', icon: 'fa-flag' },
    })
  )

  return el
}

function listen(el) {
  /* When journal field loses focus */
  el.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}
/**
 * Handle journal entry field change
 */

async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value

  const doc = newState.get('active-doc')
  const id = doc.id

  doc[section] = value

  const docs = newState.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx] = doc

  newState.set('main-documents', docs)
  newState.set('active-doc', doc)

  try {
    const { message, error } = await updateEntry({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    log(message)

    if (['city', 'state', 'country'].includes(section)) {
      await updateJournalDefaults({ id, section, value })
    }
  } catch (err) {
    log(err)
  }
}
