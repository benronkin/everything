import { injectStyle, setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
// import { createCountryStateCity } from '../../assets/composites/countryStateCity.js'
import { log } from '../../assets/js/logger.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function createEntryGroup() {
  injectStyle(css)

  const el = createDiv({ id: 'entry-group' })

  build(el)

  return el
}

function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'journal-location',
      name: 'location',
      placeholder: 'Attraction',
      autocomplete: 'off',
      classes: { group: 'mb-40', icon: 'fa-utensils' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'visit_date',
      id: 'journal-visit_date',
      type: 'date',
      classes: { group: 'mb-40', icon: 'fa-calendar' },
      value: new Date().toISOString().split('T')[0],
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'street',
      id: 'journal-street',
      placeholder: 'Street address',
      classes: { group: 'mb-40', icon: 'fa-road' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'city',
      id: 'journal-city',
      placeholder: 'City',
      classes: { group: 'mb-40', icon: 'fa-city' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'state',
      id: 'journal-state',
      placeholder: 'State',
      classes: { group: 'mb-40', icon: 'fa-map' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'country',
      id: 'journal-country',
      placeholder: 'Country',
      classes: { group: 'mb-40', icon: 'fa-flag' },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'phone',
      id: 'journal-phone',
      placeholder: 'Phone',
      classes: { group: 'mb-40', icon: 'fa-phone' },
    })
  )

  el.appendChild(
    createSelectGroup({
      name: 'rating',
      id: 'journal-rating',
      classes: {
        group: 'mb-40 w-fc p-5-0',
        select: 'field',
        icon: 'fa-face-smile',
      },
      options: [
        { value: '', label: '' },
        { value: 'great', label: '🔥' },
        { value: 'medium', label: '🆗' },
        { value: 'bad', label: '🤮' },
      ],
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mt-30 mb-20', icon: 'fa-pencil' },
      html: 'Note:',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'notes',
      id: 'journal-notes',
      className: 'w-100',
      placeholder: 'Add details...',
    })
  )
}
