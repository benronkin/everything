import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createCountryStateCity } from '../../assets/composites/countryStateCity.js'
import { log } from '../../assets/js/logger.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function createEntryGroup() {
  injectStyle(css)

  const el = createDiv({ id: 'entry-group' })

  build(el)
  listen(el)

  return el
}

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

  // el.appendChild(
  //   createInputGroup({
  //     name: 'city',
  //     id: 'journal-city',
  //     placeholder: 'City',
  //     classes: { group: 'mb-40', input: 'field', icon: 'fa-city' },
  //   })
  // )

  // el.appendChild(
  //   createInputGroup({
  //     name: 'state',
  //     id: 'journal-state',
  //     placeholder: 'State',
  //     classes: { group: 'mb-40', input: 'field', icon: 'fa-map' },
  //   })
  // )

  // el.appendChild(
  //   createInputGroup({
  //     name: 'country',
  //     id: 'journal-country',
  //     placeholder: 'Country',
  //     classes: { input: 'field', icon: 'fa-flag' },
  //   })
  // )

  const cscEl = createCountryStateCity()
  cscEl.querySelector('[name="city"').dataset.id = 'journal-city'
  cscEl.querySelector('[name="state"').dataset.id = 'journal-state'
  cscEl.querySelector('[name="country"').dataset.id = 'journal-country'
  el.appendChild(cscEl)

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
      className: 'field w-100',
      placeholder: 'Add details...',
    })
  )

  return el
}

/**
 *
 */
function listen() {}
