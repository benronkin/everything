import { injectStyle } from '../js/ui.js'
import { createIcon } from './icon.js'
import { state } from '../js/state.js'

const css = `
.select-wrapper {
  display: flex;
  align-items: center;
  border-radius: var(--border-radius);
  padding: 5px 10px;
  height: 20px;
  cursor: pointer;
}

.custom-select {
  appearance: none;
  background-color: transparent;
  border-radius: var(--border-radius);
  color: var(--gray5);
  border: none;
  font-size: 0.9rem; 
  z-index: 2;
  width: 100%;
}

.custom-select:focus {
  outline: none;
}

.caret-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  margin-left: 10px;
}

.caret-wrapper i {
  color: var(--gray5);
  font-size: 0.8rem;
}
`

export function createSelect({
  id = '',
  value = '',
  className = '',
  name = '',
  options = [],
} = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  addElementParts({ el, name })

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

  id && (el.id = id)
  el.className = `select-wrapper  ${className}`.trim()

  if (value) {
    el.value = value
    el.selectByValue(value)
  } else {
    const opt = el.getSelected()
    if (opt) {
      el.selectByValue(opt.value)
    }
  }

  listen(el)

  return el
}

function getOptionByLabel(label) {
  return [...this.querySelectorAll('option')].find((opt) => opt.label === label)
}

function getOptionByValue(value) {
  value = value?.trim()
  // if (!value) {
  //   return null
  // }
  return [...this.querySelectorAll('option')].find((opt) => opt.value === value)
}

function getSelected() {
  return this.querySelector('option[selected="true"]')
}

function hasOptionLabel(label) {
  return !!this.getOptionByLabel(label)
}

function hasOptionValue(value) {
  if (!value?.trim()) {
    return false
  }
  return !!this.getOptionByValue(value)
}

function selectByLabel(label) {
  // remove prior select
  this.unselect()
  const option = this.getOptionByLabel(label)
  if (option) {
    option.setAttribute('selected', true)
    this.querySelector('select').value = option.value
  }
}

function selectByValue(value) {
  // remove prior select
  this.unselect()
  const option = this.getOptionByValue(value) || this.querySelector('option')
  option.setAttribute('selected', true)
  this.querySelector('select').value = value
}

function setOptions(options) {
  this.querySelector('select').innerHTML = ''
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

function unselect() {
  const oldSelected = this.getSelected()
  if (oldSelected) {
    oldSelected.setAttribute('selected', null)
  }
  this.querySelector('select').value = ''
}

function addElementParts({ el, name }) {
  const selectEl = document.createElement('select')
  selectEl.className = 'custom-select'
  selectEl.name = name
  el.appendChild(selectEl)
  const divEl = document.createElement('div')
  divEl.className = 'caret-wrapper'
  el.appendChild(divEl)
  const iconEl = createIcon({ classes: { primary: 'fa-caret-down' } })
  divEl.appendChild(iconEl)
}

function listen(el) {
  el.querySelector('.custom-select').addEventListener('change', (e) => {
    el.selectByValue(e.target.value)
    state.set(`select-click:${el.id || el.name}`, e.target.value)

    state.set('field-changed', e.target)
  })

  el.querySelector('.caret-wrapper i').addEventListener(
    'click',
    handleSelectClick
  )
  el.addEventListener('click', handleSelectClick)
}

function handleSelectClick(e) {
  const parent = e.target.closest('.select-wrapper')
  const selectEl = parent.querySelector('.custom-select')

  if (typeof selectEl.showPicker === 'function') {
    // Chrome 118+ opens native dropdown
    selectEl.showPicker()
  } else {
    // fallback for Safari / Firefox / older Chromium
    selectEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    selectEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    selectEl.focus() // keeps keyboard / VoiceOver happy
  }
}
