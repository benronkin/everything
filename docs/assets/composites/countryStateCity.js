import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createInputGroup } from '../partials/inputGroup.js'
import { createIcon } from '../partials/icon.js'
import { createHeader } from '../partials/header.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.country-state-city {
  width: 100%;
}
.country-state-city .edit-panel {
  display: flex;
  flex-direction: column;
}
.country-state-city .edit-header {
  background: var(--gray1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gray0);
  margin-top: 10px;
  height: 11px;
}
`

export function createCountryStateCity({ id, className } = {}) {
  injectStyle(css)

  const el = createDiv({ className: 'country-state-city' })

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  className && (el.className = className)
  return el
}

function build(el) {
  el.appendChild(
    createInputGroup({
      name: 'country',
      placeholder: 'Country',
      autocomplete: 'off',
      classes: {
        input: 'field',
        icon: 'fa-flag',
      },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'state',
      autocomplete: 'off',
      placeholder: 'State',
      classes: {
        input: 'field',
        icon: 'fa-map',
      },
    })
  )

  el.appendChild(
    createInputGroup({
      name: 'city',
      autocomplete: 'off',
      placeholder: 'City',
      classes: {
        input: 'field',
        icon: 'fa-city',
      },
    })
  )

  el.appendChild(createDiv({ className: 'autocomplete hidden' }))

  const headerEl = createDiv({
    className: 'edit-header hidden',
    html: [
      // div needed here for flex parent to keep header centered
      createDiv({
        html: createIcon({
          classes: {
            primary: 'fa-chevron-left',
          },
        }),
      }),

      createHeader({ type: 'h5' }),

      createIcon({
        classes: {
          primary: 'fa-chevron-right',
        },
      }),

      createIcon({
        classes: {
          primary: 'fa-close',
        },
      }),
    ],
  })
  el.appendChild(headerEl)
}

function react(el) {
  state.on('country-state-city-page', 'countryStateCity', (page) => {
    const pages = ['', 'country', 'state', 'city']
    for (let i = 0; i < 4; i++) {
      if (i == 0) continue
      const name = pages[i]
      const group = el
        .querySelector(`input[name="${name}"]`)
        ?.closest('.input-group')
      group.classList.toggle('hidden', i !== page && page > 0)
    }

    el.querySelector('.fa-chevron-left')?.classList.toggle('hidden', page < 2)
    el.querySelector('.fa-chevron-right')?.classList.toggle(
      'hidden',
      page === 0 || page === 3
    )
    el.querySelector('.fa-close')?.classList.toggle('hidden', page !== 3)

    el.querySelector('.edit-header h5').textContent = pages[page].toUpperCase()
    el.querySelector('.edit-header').classList.toggle('hidden', page === 0)
  })
}

function listen(el) {
  /* navigate to the right page after a click */
  el.addEventListener(
    'click',
    (e) => {
      // ignore clicks while on edit pages 1-3
      if (state.get('country-state-city-page') !== 0) return

      let page = 0

      const countryValue = el
        .querySelector('input[name="country"]')
        .value.trim()
      const stateValue = el.querySelector('input[name="state"]').value.trim()

      if (!countryValue.length) {
        // country value is needed
        page = 1
      } else if (!stateValue.length) {
        // state value is needed
        page = 2
      } else {
        // pick the page based on the element that was clicked on
        // a non-input element will not have a name property
        const pages = {
          none: 1,
          country: 1,
          state: 2,
          city: 3,
        }
        page = pages[e.target.name || 'none']
        state.set('country-state-city-page', page)
      }

      const tree = state.get('country-state-city-tree')
      const dropdownOptions =
        page === 1
          ? Object.keys(tree)
          : page === 2
          ? Object.keys(tree[countryValue])
          : tree[countryValue][stateValue]

      el.querySelector('.autocomplete').insertHtml(dropdownOptions)
      el.querySelector('.autocomplete').classList.remove('hidden')
    },
    true
  )

  /* return to page 0 */
  el.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') state.set('country-state-city-page', 0)
    },
    true
  )

  el.querySelector('.fa-chevron-left')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', page - 1)
  })

  el.querySelector('.fa-chevron-right')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', page + 1)
  })

  el.querySelector('.fa-close')?.addEventListener('click', () => {
    state.set('country-state-city-page', 0)
  })
}
