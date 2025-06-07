import { injectStyle } from '../_assets/js/ui.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--purple2); 
  box-shadow: var(--shadow-small);
  border-radius: 12px;
  padding: 5px 10px;
}

.custom-select {
  appearance: none;
  background-color: transparent;
  color: var(--gray5);
  border: none;
  font-size: 0.9rem; 
  padding: 0 1.5rem 0 0.8rem;
  z-index: 2;
  width: 100%;
}

.custom-select:focus {
  outline: none;
}

.caret-wrapper {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.caret-wrapper i {
  color: var(--gray5);
  font-size: 0.8rem;
}
`

// -------------------------------
// Exported
// -------------------------------

/**
 *
 */
export function createSelect({
  id = '',
  value = '',
  className = '',
  name = '',
  options = [],
  events = { change: () => {} },
}) {
  injectStyle(css)

  const el = document.createElement('div')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = `select-wrapper ${newValue}`.trim()
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = `${id}-select-wrapper`
      },
    },
  })

  addElementParts({ el, name, events })

  el.getOptionByLabel = getOptionByLabel.bind(el)
  el.getOptionByValue = getOptionByValue.bind(el)
  el.getSelected = getSelected.bind(el)
  el.hasOptionLabel = hasOptionLabel.bind(el)
  el.hasOptionValue = hasOptionValue.bind(el)
  el.selectByLabel = selectByLabel.bind(el)
  el.selectByValue = selectByValue.bind(el)
  el.setOptions = setOptions.bind(el)
  el.unselect = unselect.bind(el)

  el.setOptions(options)

  el.value = value
  el.selectByValue(value)
  el.dataId = id
  el.classes = className

  return el
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function getOptionByLabel(label) {
  return [...this.querySelectorAll('option')].find((opt) => opt.label === label)
}

/**
 *
 */
function getOptionByValue(value) {
  value = value?.trim()
  if (!value) {
    return null
  }
  return [...this.querySelectorAll('option')].find((opt) => opt.value === value)
}

/**
 *
 */
function getSelected() {
  return this.querySelector('option[selected="true"]')
}

/**
 *
 */
function hasOptionLabel(label) {
  return !!this.getOptionByLabel(label)
}

/**
 *
 */
function hasOptionValue(value) {
  if (!value?.trim()) {
    return false
  }
  return !!this.getOptionByValue(value)
}

/**
 *
 */
function selectByLabel(label) {
  // remove prior select
  this.unselect()
  const option = this.getOptionByLabel(label)
  if (option) {
    option.setAttribute('selected', true)
    this.querySelector('select').value = option.value
  }
}

/**
 *
 */
function selectByValue(value) {
  // remove prior select
  this.unselect()
  const option = this.getOptionByValue(value)
  if (option) {
    option.setAttribute('selected', true)
    this.querySelector('select').value = value
  }
}

/**
 *
 */
function setOptions(options) {
  options.forEach((opt) => {
    const optEl = document.createElement('option')
    optEl.value = opt.value
    optEl.textContent = opt.label
    if (opt.selected) {
      optEl.setAttribute('selected', true)
    }
    this.querySelector('select').appendChild(optEl)
  })
}

/**
 *
 */
function unselect() {
  const oldSelected = this.getSelected()
  if (oldSelected) {
    oldSelected.setAttribute('selected', null)
  }
  this.querySelector('select').value = ''
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function addElementParts({ el, name, events }) {
  const selectEl = document.createElement('select')
  selectEl.className = 'custom-select'
  selectEl.name = name
  el.appendChild(selectEl)
  const divEl = document.createElement('div')
  divEl.className = 'caret-wrapper'
  el.appendChild(divEl)
  const iconEl = createIcon({ classes: { primary: 'fa-caret-down' } })
  divEl.appendChild(iconEl)

  for (const [k, v] of Object.entries(events)) {
    selectEl.addEventListener(k, v)
  }
}
