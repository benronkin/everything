/*
This module handles journal events so that the journal.js stays leaner.
This module loads aftr all partials were created.
*/
import { createDiv } from '../../_partials/div.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createTextareaGroup } from '../../_partials/textareaGroup.js'
// import { log } from '../../_assets/js/logger.js'
// import { newState } from '../../_assets/js/newState.js'

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

/**
 *
 */
function listen() {}
