import { injectStyle } from '../js/ui.js'

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

const html = `
<select class="custom-select"></select>
<div class="caret-wrapper">
  <i class="fa-solid fa-caret-down"></i>
</div>
`

// -------------------------------
// Exported
// -------------------------------

/**
 *
 */
export function createSelect(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ id, className, name, options = [] }) {
  const el = document.createElement('div')
  el.className = 'select-wrapper'
  el.innerHTML = html
  const selectEl = el.querySelector('select')
  if (id) {
    selectEl.setAttribute('id', id)
  }

  if (name) {
    selectEl.setAttribute('name', name)
  }

  if (className) {
    selectEl.className = className
  }

  el.getName = getName.bind(el)
  el.getOptionByLabel = getOptionByLabel.bind(el)
  el.getOptionByValue = getOptionByValue.bind(el)
  el.getSelected = getSelected.bind(el)
  el.getValue = getValue.bind(el)
  el.hasOptionLabel = hasOptionLabel.bind(el)
  el.hasOptionValue = hasOptionValue.bind(el)
  el.selectByLabel = selectByLabel.bind(el)
  el.selectByValue = selectByValue.bind(el)
  el.setOptions = setOptions.bind(el)
  el.unselect = unselect.bind(el)

  el.setOptions(options)

  return el
}

/**
 *
 */
function getName() {
  return this.querySelector('select').getAttribute('name')
}

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
function getValue() {
  return this.querySelector('select').value
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
  const selectEl = this.querySelector('select')
  options.forEach((opt) => {
    const optEl = document.createElement('option')
    optEl.value = opt.value
    optEl.textContent = opt.label
    if (opt.selected) {
      optEl.setAttribute('selected', true)
    }

    selectEl.appendChild(optEl)
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
}
