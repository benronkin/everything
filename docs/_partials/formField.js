import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

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

export function createField(config) {
  injectStyle(css)
  const el = createElement(config)
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Create the HTML element.
 * labelFor allows you to target elements
 * nested in wrappers, dynamic elements, etc
 */
function createElement({
  element,
  label,
  labelPosition = 'left',
  fieldClasses,
  labelClasses,
  labelFor,
}) {
  const fieldEl = document.createElement('div')
  fieldEl.className = 'form-field'
  fieldEl.appendChild(element)
  if (!label) {
    return fieldEl
  }
  if (fieldClasses) {
    fieldEl.className += ` ${fieldClasses.join(', ')}`
  }

  const labelEl = document.createElement('label')
  const forId = labelFor || element.getAttribute('id')
  if (forId) {
    labelEl.setAttribute('for', forId)
  }
  labelEl.className = labelPosition
  if (labelClasses) {
    labelEl.className += ` ${labelClasses.join(', ')}`
  }

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
