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
  createHeader({ type: 'h5', className: 'hidden', html: 'Location' }),
    el.appendChild(
      createHeader({ type: 'h5', className: 'hidden', html: 'Visited on' })
    )
  el.appendChild(
    createHeader({ type: 'h5', className: 'hidden', html: 'Notes' })
  )

  el.appendChild(
    createInputGroup({
      id: 'journal-location',
      name: 'location',
      placeholder: 'Attraction',
      className: 'field',
      iconClass: 'fa-building',
    })
  )

  el.appendChild(
    createDiv({
      className: 'grid-1-2',
      html: [
        createInputGroup({
          name: 'visit-date',
          id: 'journal-visit-date',
          className: 'field',
          type: 'date',
          iconClass: 'fa-calendar',
          value: new Date().toISOString().split('T')[0],
        }),
        el.appendChild(
          createInputGroup({
            name: 'city',
            id: 'journal-city',
            className: 'field',
            iconClass: 'fa-city',
          })
        ),
      ],
    })
  )

  el.appendChild(
    createTextareaGroup({
      name: 'notes',
      id: 'journal-notes',
      className: 'field',
      iconClass: 'fa-pencil',
      placeholder: 'Notes...',
    })
  )

  el.appendChild(
    createHeader({ type: 'h5', className: 'hidden', html: 'City' })
  )

  el.appendChild(
    createHeader({ type: 'h5', className: 'hidden', html: 'State' })
  )

  el.appendChild(
    createInput({
      name: 'state',
      id: 'journal-state',
      className: 'field',
    })
  )

  el.appendChild(
    createHeader({ type: 'h5', className: 'hidden', html: 'Country' })
  )

  el.appendChild(
    createInput({
      name: 'country',
      id: 'journal-country',
      className: 'field',
    })
  )

  el.appendChild(createHeader({ type: 'h5', className: 'hidden', html: 'Id' }))

  el.appendChild(
    createParagraph({ id: 'journal-id', className: 'smaller mb-20' })
  )
}
