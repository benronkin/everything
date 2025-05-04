// -------------------------------
// Globals
// -------------------------------

const formString = `
 <form id="" class="form-horizontal">
    <div class="input-icon-group">
      <i class="fa-solid fa-envelope"></i>
      <input type="email" name="email" placeholder="Email" value="" />
    </div>
    <button id="login-btn" class="primary" type="submit">Submit</button>
  </form>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFormHorizontal({ formId, inputType, inputName, inputPlaceholder, inputAutoComplete, iClass, submitText } = {}) {
  const formEl = document.createElement('form')
  formEl.innerHTML = formString
  formEl.classList.add('form-horizontal')
  formEl.setAttribute('id', formId)

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

// -------------------------------
// Helpers
// -------------------------------
