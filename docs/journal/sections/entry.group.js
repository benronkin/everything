import { state } from '../../assets/js/state.js'
import { createMarkdown } from '../../assets/composites/markdown.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDateTimeGroup } from '../../assets/partials/dateTimeGroup.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createRating } from '../../assets/partials/rating.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'

const css = `
#edit-note-toggle {
  width: 25px;
  text-align: center;
}
#note-header {
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}
#note-header h5 {
  margin: 0;
}
`

export function createEntryGroup() {
  injectStyle(css)

  const el = createDiv({ id: 'entry-group' })

  build(el)
  react(el)

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
    }),
  )

  el.appendChild(
    // createInputGroup({
    //   name: 'visit_date',
    //   id: 'journal-visit_date',
    //   type: 'date',
    //   classes: { group: 'mb-40', icon: 'fa-calendar' },
    //   value: new Date().toISOString().split('T')[0],
    // }),
    createDateTimeGroup({
      name: 'visit_date',
      id: 'journal-visit_date',
      classes: { group: 'mb-40', icon: 'fa-calendar' },
    }),
  )

  el.appendChild(
    createInputGroup({
      name: 'street',
      id: 'journal-street',
      placeholder: 'Street address',
      classes: { group: 'mb-40', icon: 'fa-road' },
    }),
  )

  el.appendChild(
    createInputGroup({
      name: 'city',
      id: 'journal-city',
      placeholder: 'City',
      classes: { group: 'mb-40', icon: 'fa-city' },
    }),
  )

  el.appendChild(
    createInputGroup({
      name: 'state',
      id: 'journal-state',
      placeholder: 'State',
      classes: { group: 'mb-40', icon: 'fa-map' },
    }),
  )

  el.appendChild(
    createInputGroup({
      name: 'country',
      id: 'journal-country',
      placeholder: 'Country',
      classes: { group: 'mb-40', icon: 'fa-flag' },
    }),
  )

  el.appendChild(
    createInputGroup({
      name: 'phone',
      id: 'journal-phone',
      placeholder: 'Phone',
      classes: { group: 'mb-40', icon: 'fa-phone' },
    }),
  )

  el.appendChild(createRating({ id: 'journal-rating' }))

  el.appendChild(
    createDiv({
      id: 'note-header',
      html: [
        createHeader({ html: 'NOTE', type: 'h5' }),
        createIcon({
          id: 'edit-note-toggle',
          classes: {
            primary: 'fa-pencil',
            secondary: 'fa-close',
            other: ['primary'],
          },
        }),
      ],
    }),
  )

  el.appendChild(
    createMarkdown({ id: 'journal-notes', name: 'notes', iconsVisible: false }),
    // createTextarea({
    //   name: 'notes',
    //   id: 'journal-notes',
    //   className: 'w-100',
    //   placeholder: 'Add details...',
    // }),
  )
}

/**
 *
 */
function react(el) {
  state.on('icon-click:edit-note-toggle', 'entry.group', () => {
    document.querySelector('.markdown-wrapper').toggle()
  })
}
