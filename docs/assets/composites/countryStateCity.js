import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createSpanGroup } from '../partials/spanGroup.js'
import { createInputGroup } from '../partials/inputGroup.js'
import { createIcon } from '../partials/icon.js'
import { createHeader } from '../partials/header.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.country-state-city {
  width: 100%;
}
.country-state-city .edit-panel {
  display: flex;
  flex-direction: column;
}
.country-state-city .edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gray0);
  padding: 10px 0;
  margin-bottom: 30px;
}
`

// -------------------------------
// Exports
// -------------------------------

export function createCountryStateCity({ id, className } = {}) {
  injectStyle(css)

  const el = createDiv({ className: 'country-state-city' })

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  className && (el.className = className)

  el.querySelectorAll('.field').forEach((input) => (input.disabled = true))

  return el
}

// -------------------------------
// Helpers
// -------------------------------

function build(el) {
  viewPanel(el)
  editPanel(el)
}

function react(el) {
  state.on('country-state-city-page', 'countryStateCity', (page) => {
    const pages = ['country', 'state', 'city']
    pages.forEach((name, idx) => {
      const group = el
        .querySelector(`.edit-panel input[name="${name}"]`)
        ?.closest('.input-group')
      group.classList.toggle('hidden', idx !== page)
    })

    el.querySelector('.fa-chevron-left')?.classList.toggle('hidden', page === 0)
    el.querySelector('.fa-chevron-right')?.classList.toggle(
      'hidden',
      page === 2
    )
    el.querySelector('.fa-close')?.classList.toggle('hidden', page !== 2)
    el.querySelector('.edit-header h5').textContent = pages[page].toUpperCase()
  })
}

function listen(el) {
  el.querySelector('.view-panel').addEventListener('click', () => {
    el.querySelector('.view-panel').classList.add('hidden')
    el.querySelector('.edit-panel').classList.remove('hidden')
  })

  el.querySelector('.fa-chevron-left')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', page - 1)
  })

  el.querySelector('.fa-chevron-right')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', page + 1)
  })

  el.querySelector('.fa-close')?.addEventListener('click', () => {
    el.querySelector('.view-panel').classList.remove('hidden')
    el.querySelector('.edit-panel').classList.add('hidden')
    state.set('country-state-city-page', 0)
  })
}

function viewPanel(el) {
  const viewPanel = createDiv({ className: 'view-panel' })
  el.appendChild(viewPanel)

  viewPanel.appendChild(
    createInputGroup({
      name: 'city',
      placeholder: 'City',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-city' },
    })
  )

  viewPanel.appendChild(
    createInputGroup({
      name: 'state',
      placeholder: 'State',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-map' },
    })
  )

  viewPanel.appendChild(
    createInputGroup({
      name: 'country',
      placeholder: 'Country',
      classes: { input: 'field', icon: 'fa-flag' },
    })
  )
}

function editPanel(el) {
  const editPanel = createDiv({ className: 'edit-panel outer-wrapper hidden' })
  el.appendChild(editPanel)

  const headerEl = createDiv({
    className: 'edit-header',
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
  editPanel.appendChild(headerEl)

  const bodyEl = createDiv({ className: 'edit-body' })
  editPanel.appendChild(bodyEl)

  bodyEl.appendChild(
    createInputGroup({
      name: 'country',
      placeholder: 'Country',
      classes: {
        input: 'field',
        icon: 'fa-flag',
      },
    })
  )

  bodyEl.appendChild(
    createInputGroup({
      name: 'state',
      placeholder: 'State',
      classes: {
        input: 'field',
        icon: 'fa-map',
      },
    })
  )

  bodyEl.appendChild(
    createInputGroup({
      name: 'city',
      placeholder: 'City',
      classes: {
        input: 'field',
        icon: 'fa-city',
      },
    })
  )
}
