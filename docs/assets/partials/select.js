import { injectStyle } from '../js/ui.js'
import { createIcon } from './icon.js'
import { state } from '../js/state.js'

const css = `
select {
  padding: 0.5rem 0.75rem;
}
select option {
  background-color: var(--gray2);
  color: var(--gray6);
}
.select-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  border-radius: var(--border-radius);
  padding: 7px;
  height: 20px;
  cursor: pointer;
  background-color: var(--gray1);
}
.select-wrapper.disabled {
  background-color: var(--gray3);
}

.custom-select {
  appearance: none;
  background-color: transparent;
  border-radius: var(--border-radius);
  color: var(--gray6);
  border: none;
  font-size: 1rem !important;
  z-index: 2;
  width: 100%;
  padding-right: 24px;
}
.custom-select:disabled,
.select-wrapper.disabled,
.select-wrapper.disabled i {
  color: var(--gray6);
}

.custom-select:focus {
  outline: none;
}

.caret-wrapper {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  margin-left: 0;
  pointer-events: none;
}

.caret-wrapper i {
  color: var(--gray4);
  font-size: 0.8rem;
}
`

export function createSelect({
  id = '',
  value = '',
  className = '',
  name = '',
  options = [],
  setUpdateState = true
} = {}) {
  injectStyle(css)
  const el = document.createElement('div')

  addElementParts({ el, name })

  el.setDisabled = setDisabled.bind(el)
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

  el.dataset.updating = setUpdateState

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
  return this.querySelector('select').selectedOptions[0] || null
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
  const option = this.getOptionByValue(value) || this.querySelector('option')
  if (!option) return

  this.querySelector('select').value = option.value
}

function setDisabled(value) {
  this.classList.toggle('disabled', value)
  this.querySelector('select').disabled = value
  this.querySelector('i').disabled = value
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
  this.querySelector('select').selectedIndex = -1
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

    if (el.dataset.updating === 'false') {
      console.log('skipping update')
      return
    }
    state.set('field-changed', e.target)
  })

  el.addEventListener('click', handleSelectClick)
}

function handleSelectClick(e) {
  if (e.target.closest('select')) return

  const parent = e.target.closest('.select-wrapper')
  const selectEl = parent.querySelector('.custom-select')

  if (
    parent.classList.contains('disabled') ||
    parent.classList.contains('hidden')
  ) {
    console.log('Select is not in play, ignoring')
    return
  }

  if (typeof selectEl.showPicker === 'function') {
    // Chrome 118+ opens native dropdown
    selectEl.showPicker()
  } else {
    // fallback for Safari / Firefox / older Chromium
    selectEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    selectEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    selectEl.focus() // keeps keyboard / VoiceOver happy
  }

  state.set(`select-click:${parent.id}`, parent)
}
