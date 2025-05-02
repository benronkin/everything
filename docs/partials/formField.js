// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `
.form-field {
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-field.column {
  flex-direction: column;
  justify-content: center;
}
.form-field label {
  font-size: 0.9rem;
}

`

// -------------------------------
// Exported functions
// -------------------------------

export function createField({ element, label, labelPosition = 'left', classList = [], labelFor } = {}) {
  injectStyle(css)
  const el = createElement({ element, label, labelPosition, classList, labelFor })
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Inject style sheet once
 */
function injectStyle(css) {
  if (cssInjected) {
    return
  }
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

/**
 * Create the HTML element.
 * labelFor allows you to target elements nested in wrappers, dynamic elements, etc
 */
function createElement({ element, label, labelPosition, classList, labelFor }) {
  const fieldEl = document.createElement('div')
  fieldEl.className = 'form-field'
  if (classList.length) {
    fieldEl.classList.add(...classList)
  }

  fieldEl.appendChild(element)
  if (!label) {
    return fieldEl
  }

  const labelEl = document.createElement('label')
  const forId = labelFor || element.getAttribute('id')
  if (forId) {
    labelEl.setAttribute('for', forId)
  }
  labelEl.className = labelPosition
  labelEl.appendChild(document.createTextNode(label))

  switch (labelPosition) {
    case 'top':
      fieldEl.prepend(labelEl)
      fieldEl.classList.add('column')
      break
    case 'right':
      fieldEl.appendChild(labelEl)
      break
    case 'bottom':
      fieldEl.appendChild(labelEl)
      fieldEl.classList.add('column')
      break
    case 'left':
      fieldEl.prepend(labelEl)
      break
  }
  return fieldEl
}
