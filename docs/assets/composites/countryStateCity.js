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
        combo: 'combo-country',
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
        combo: 'combo-state',
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
        combo: 'combo-city',
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
  el.querySelector('input[name="country"').addEventListener('click', () =>
    state.set('country-state-city-page', 1)
  )

  el.querySelector('input[name="state"').addEventListener('click', () =>
    state.set('country-state-city-page', getPage(2))
  )

  el.querySelector('input[name="city"').addEventListener('click', () =>
    state.set('country-state-city-page', getPage(3))
  )

  /* return to page 0 on Escape */
  el.addEventListener(
    'keyup',
    (e) => {
      if (e.key === 'Escape') {
        state.set('country-state-city-page', 0)
      }
    },
    true
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

  /* input focus */
  el.querySelectorAll('input').forEach((inputEl) =>
    inputEl.addEventListener('focusin', (e) => {
      const input = e.target
      const name = input.name

      const tree = state.get('country-state-city-tree')
      const countryVal = el.querySelector('input[name="country"]').value.trim()
      const stateVal = el.querySelector('input[name="state"]').value.trim()

      let labels = []
      if (name === 'country') {
        labels = Object.keys(tree).sort()
      } else if (name === 'state' && tree[countryVal]) {
        labels = Object.keys(tree[countryVal])
      } else if (name === 'city' && tree[countryVal]?.[stateVal]) {
        labels = tree[countryVal][stateVal]
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
  )

  /* refresh options */
  el.querySelectorAll('input').forEach((inputEl) =>
    inputEl.addEventListener('keyup', (e) => {
      const value = e.target.value.trim()
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
    })
  )

  /* set pageUi */
  el.querySelector('input[name="country"]').addEventListener('keyup', () =>
    setPageUi({ el, page: 1 })
  )

  el.querySelector('input[name="state"]').addEventListener('keyup', () =>
    setPageUi({ el, page: 2 })
  )

  el.querySelector('input[name="city"]').addEventListener('keyup', () =>
    setPageUi({ el, page: 3 })
  )
  el.querySelector('input[name="country"]').addEventListener('change', () =>
    setPageUi({ el, page: 1 })
  )

  el.querySelector('input[name="state"]').addEventListener('change', () =>
    setPageUi({ el, page: 2 })
  )

  el.querySelector('input[name="city"]').addEventListener('change', () =>
    setPageUi({ el, page: 3 })
  )

  /* reset next inputs */
  el.querySelectorAll('input').forEach((inputEl) =>
    inputEl.addEventListener('change', () => {
      // empty subsequent inputs
      const name = inputEl.name
      const stateEl = el.querySelector('input[name="state"]')
      const cityEl = el.querySelector('input[name="city"]')
      if (name === 'country') {
        stateEl.value = ''
        cityEl.value = ''
      } else if (name === 'state') {
        cityEl.value = ''
      }
    })
  )
}

function getPage(desiredPage) {
  if ([0, 1].includes(desiredPage)) return desiredPage

  const hasCountry = document
    .querySelector('input[name="country"]')
    .textContent.trim().length
  const hasState = document
    .querySelector('input[name="state"]')
    .textContent.trim().length

  switch (desiredPage) {
    case 2:
      if (hasValue('country')) {
        return 2
      } else {
        return 1
      }
    case 3:
      if (hasValue('country') && hasValue('state')) {
        return 3
      } else if (hasValue('country')) {
        return 2
      } else {
        return 1
      }
  }
}

function setPageUi({ el, page }) {
  const comboEls = el.querySelectorAll('.combo-group')
  comboEls.forEach((i) => i.classList.add('invisible'))

  const iEls = el.querySelectorAll('.edit-header i')
  iEls.forEach((i) => i.classList.add('invisible'))

  const headerEl = el.querySelector('.edit-header')
  headerEl.classList.remove('invisible')

  const locationEl = el.querySelector('.edit-header h5')
  const prevEl = el.querySelector('.fa-chevron-left')
  const nextEl = el.querySelector('.fa-chevron-right')
  const endEl = el.querySelector('.fa-close')

  switch (page) {
    case 0:
      comboEls.forEach((i) => i.classList.remove('invisible'))
      headerEl.classList.add('invisible')
      break
    case 1:
      log(headerEl.className)
      el.querySelector('.combo-country').classList.remove('invisible')
      if (hasValue('country')) nextEl.classList.remove('invisible')
      locationEl.textContent = 'COUNTRY'
      break
    case 2:
      el.querySelector('.combo-state').classList.remove('invisible')
      prevEl.classList.remove('invisible')
      if (hasValue('state')) nextEl.classList.remove('invisible')
      locationEl.textContent = 'STATE'
      break
    case 3:
      el.querySelector('.combo-city').classList.remove('invisible')
      prevEl.classList.remove('invisible')
      if (hasValue('city')) endEl.classList.remove('invisible')
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
