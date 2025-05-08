let cssInjected = false

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-horizontal-wrapper {
  width: 100%;
}
.form-horizontal {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}
.form-horizontal input {
  margin: 0;
  width: 100%;
}
.form-horizontal-wrapper .message {
  padding: 10px;
  font-size: 0.75rem;
}
`

const formString = `
<div class="form-horizontal-wrapper">
  <form class="form-horizontal">
      <div class="input-icon-group">
        <i class="fa-solid"></i>
        <input  />
      </div>
      <button class="primary" type="submit"></button>
  </form>
  <span class="message"></span>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFormHorizontal({
  formId,
  inputType,
  inputName,
  inputPlaceholder,
  inputAutoComplete,
  iClass,
  submitText,
} = {}) {
  injectStyle(css)
  return createElement({
    formId,
    inputType,
    inputName,
    inputPlaceholder,
    inputAutoComplete,
    iClass,
    submitText,
  })
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function injectStyle(css) {
  if (cssInjected || !css) return
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

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
}) {
  const formEl = document.createElement('form')
  formEl.innerHTML = formString
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

  const iEl = formEl.querySelector('i')
  iEl.classList.add(iClass)

  const submitEl = formEl.querySelector('[type="submit"]')
  if (submitText) {
    submitEl.textContent = submitText
  } else {
    submitEl.remove()
  }

  return formEl
}
