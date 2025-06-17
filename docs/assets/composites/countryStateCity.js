import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createComboGroup } from '../partials/comboGroup.js'
import { createIcon } from '../partials/icon.js'
import { createHeader } from '../partials/header.js'
import { createSpan } from '../partials/span.js'
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
.combo-group .combo-option .fa-close {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.combo-group .combo-option:hover .fa-close {
  opacity: 1;
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
    createComboGroup({
      name: 'country',
      placeholder: 'Country',
      autocomplete: 'off',
      classes: {
        combo: 'combo-country mb-40',
        input: 'field',
        icon: 'fa-flag',
      },
    })
  )

  el.appendChild(
    createComboGroup({
      name: 'state',
      autocomplete: 'off',
      placeholder: 'State',
      classes: {
        combo: 'combo-state mb-40',
        input: 'field',
        icon: 'fa-map',
      },
    })
  )

  el.appendChild(
    createComboGroup({
      name: 'city',
      autocomplete: 'off',
      placeholder: 'City',
      classes: {
        combo: 'combo-city mb-40',
        input: 'field',
        icon: 'fa-city',
      },
    })
  )

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

      createDiv({
        html: [
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
      }),
    ],
  })
  el.appendChild(headerEl)
}

function react(el) {
  state.on('country-state-city-page', 'countryStateCity', (page) =>
    setPageUi({ el, page })
  )
}

function listen(el) {
  const countryEl = el.querySelector('input[name="country"]')
  const stateEl = el.querySelector('input[name="state"]')
  const cityEl = el.querySelector('input[name="city"]')

  countryEl.addEventListener('click', () =>
    state.set('country-state-city-page', 1)
  )

  el.querySelector('input[name="state"').addEventListener('click', () =>
    state.set('country-state-city-page', getPage(2))
  )

  el.querySelector('input[name="city"').addEventListener('click', () =>
    state.set('country-state-city-page', getPage(3))
  )

  el.querySelector('.fa-chevron-left')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', getPage(page - 1))
  })

  el.querySelector('.fa-chevron-right')?.addEventListener('click', () => {
    const page = state.get('country-state-city-page')
    state.set('country-state-city-page', getPage(page + 1))
  })

  el.querySelector('.fa-close')?.addEventListener('click', () => {
    state.set('country-state-city-page', 0)
  })

  el.querySelectorAll('input').forEach((inputEl, idx) => {
    inputEl.addEventListener('focusin', (e) => {
      const input = e.target
      const name = input.name

      const tree = state.get('country-state-city-tree')
      const countryVal = countryEl.value.trim()
      const stateVal = stateEl.value.trim()

      let labels = []
      if (name === 'country') {
        labels = Object.keys(tree).sort()
      } else if (name === 'state' && tree[countryVal]) {
        labels = Object.keys(tree[countryVal]).sort()
      } else if (name === 'city' && tree[countryVal]?.[stateVal]) {
        labels = tree[countryVal][stateVal].sort()
      }

      const options = labels.map((label) => {
        const spanEl = createSpan({ html: label })
        spanEl.value = label
        return createDiv({
          className: 'combo-option',
          html: [spanEl, createIcon({ classes: { primary: 'fa-close' } })],
        })
      })

      input.closest('.combo-group').setOptions(options)
    })

    inputEl.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        setPageUi({ el, page: 0 })
        inputEl
          .closest('.combo-group')
          .querySelector('.combo-options')
          .classList.add('hidden')
      } else {
        setPageUi({ el, page: idx + 1 })
        refreshOptions({ inputEl: countryEl, el })
      }
    })

    inputEl.addEventListener('change', () => {
      const name = inputEl.name
      if (name === 'country') {
        stateEl.value = ''
        cityEl.value = ''
      } else if (name === 'state') {
        cityEl.value = ''
      }
      setPageUi({ el, page: idx + 1 })
    })
  })
}

function getPage(desiredPage, el) {
  if (desiredPage === 0 || desiredPage === 1) return desiredPage
  const country = hasValue('country', el)
  const state = hasValue('state', el)

  if (desiredPage === 2) return country ? 2 : 1
  if (desiredPage === 3) return country ? (state ? 3 : 2) : 1
}

function setPageUi({ el, page }) {
  const comboEls = el.querySelectorAll('.combo-group')
  comboEls.forEach((i) => i.classList.add('hidden'))

  const iEls = el.querySelectorAll('.edit-header i')
  iEls.forEach((i) => i.classList.add('hidden'))

  const headerEl = el.querySelector('.edit-header')
  headerEl.classList.remove('hidden')

  const locationEl = el.querySelector('.edit-header h5')
  const prevEl = el.querySelector('.edit-header .fa-chevron-left')
  const nextEl = el.querySelector('.edit-header .fa-chevron-right')
  const endEl = el.querySelector('.edit-header .fa-close')

  switch (page) {
    case 0:
      comboEls.forEach((i) => i.classList.remove('hidden'))
      headerEl.classList.add('hidden')
      break
    case 1:
      el.querySelector('.combo-country').classList.remove('hidden')
      if (hasValue('country')) nextEl.classList.remove('hidden')
      locationEl.textContent = 'COUNTRY'
      break
    case 2:
      el.querySelector('.combo-state').classList.remove('hidden')
      prevEl.classList.remove('hidden')
      if (hasValue('state')) nextEl.classList.remove('hidden')
      locationEl.textContent = 'STATE'
      break
    case 3:
      el.querySelector('.combo-city').classList.remove('hidden')
      prevEl.classList.remove('hidden')
      if (hasValue('city')) endEl.classList.remove('hidden')
      locationEl.textContent = 'CITY'
      break
  }
}

function hasValue(name) {
  const inputEl = document.querySelector(`input[name="${name}"]`)
  if (!inputEl)
    throw new Error(`hasValue cannot find an input with name "${name}"`)
  return inputEl.value.trim().length
}

function refreshOptions({ inputEl, el }) {
  const value = inputEl.value.trim()
  const dropdownEl = el.querySelector('.combo-options')
  dropdownEl.classList.add('hidden')
  if (!value.length) return

  const options = [...dropdownEl.querySelectorAll('.combo-option')]
  const relevantOptions = options.filter((opt) =>
    opt.textContent.toLowerCase().includes(value.toLowerCase())
  )
  if (!relevantOptions.length) return

  options.forEach((opt) => opt.classList.add('hidden'))
  relevantOptions.forEach((opt) => opt.classList.remove('hidden'))
  dropdownEl.classList.remove('hidden')
}
