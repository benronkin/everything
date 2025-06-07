import { createInput } from '../../_partials/input.js'
import { createTextarea } from '../../_partials/textarea.js'

import { createDiv } from '../../_partials/div.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createTextareaGroup } from '../../_partials/textareaGroup.js'
import { createParagraph } from '../../_partials/paragraph.js'
import { createHeader } from '../../_partials/header.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function appendEntryDetails(el) {
  // el.appendChild(
  //   createHeader({ type: 'h5', className: 'hidden', html: 'Location' })
  // )

  // el.appendChild(
  //   createHeader({ type: 'h5', className: 'hidden', html: 'Visited on' })
  // )
  // el.appendChild(
  //   createHeader({ type: 'h5', className: 'hidden', html: 'Notes' })
  // )

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
}
