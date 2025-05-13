import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-horizontal-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.form-horizontal-wrapper button {
  margin-left: 20px;
}
.form-horizontal-wrapper button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.form-horizontal-wrapper .form-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}
.form-horizontal-wrapper .form-horizontal input {
  margin: 0;
  width: 100%;
}
.form-horizontal-wrapper .message {
  padding: 10px;
  font-size: 0.75rem;
}
`

const html = `
  <form class="form-horizontal">
      <div class="input-icon-group">
        <i class="fa-solid"></i>
        <input  />
      </div>
      <button class="primary hidden" type="submit"></button>
  </form>
  <span class="message"></span>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFormHorizontal(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({
  formId,
  inputType,
  inputName,
  inputPlaceholder,
  inputAutoComplete,
  iClass,
  submitText,
  value,
  disabled = false,
  events,
}) {
  const wrapperEl = document.createElement('div')
  wrapperEl.className = 'form-horizontal-wrapper'
  wrapperEl.innerHTML = html

  const formEl = wrapperEl.querySelector('form')
  formEl.classList.add('form-horizontal')
  if (formId) {
    formEl.setAttribute('id', formId)
  }

  const inputEl = formEl.querySelector('input')
  inputEl.setAttribute('type', inputType)
  inputEl.setAttribute('name', inputName)
  inputEl.setAttribute('placeholder', inputPlaceholder)
  if (inputAutoComplete) {
    inputEl.setAttribute('autocomplete', inputAutoComplete)
  }
  if (value) {
    inputEl.value = value
  }

  const iEl = formEl.querySelector('i')
  iEl.classList.add(iClass)

  const submitEl = formEl.querySelector('[type="submit"]')
  if (submitText) {
    submitEl.classList.remove('hidden')
    submitEl.textContent = submitText
  }

  if (disabled) {
    submitEl.disabled = true
  }

  if (events) {
    for (const [k, v] of Object.entries(events)) {
      if (k === 'submit') {
        formEl.addEventListener('submit', (e) => {
          if (!submitEl.disabled) {
            v(e)
          }
        })
      } else {
        formEl.addEventListener(k, v)
      }
    }
  }

  wrapperEl.disable = disable.bind(wrapperEl)
  wrapperEl.enable = enable.bind(wrapperEl)
  wrapperEl.getValue = getValue.bind(wrapperEl)
  wrapperEl.message = message.bind(wrapperEl)
  wrapperEl.setSubmit = setSubmit.bind(wrapperEl)
  wrapperEl.setValue = setValue.bind(wrapperEl)

  return wrapperEl
}

// -------------------------------
// Element methods
// -------------------------------

/**
 *
 */
function disable() {
  this.querySelector('button')?.setAttribute('disabled', 'true')
}

/**
 *
 */
function enable() {
  this.querySelector('button')?.removeAttribute('disabled')
}

/**
 *
 */
function getValue() {
  return this.querySelector('input').value
}

/**
 *
 */
function message(msg) {
  this.querySelector('.message').textContent = msg
}

/**
 *
 */
function setSubmit({ text } = {}) {
  this.querySelector('button').textContent = text
}

/**
 *
 */
function setValue(value) {
  return (this.querySelector('input').value = value)
}
