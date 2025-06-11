import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-field {
  display: flex;
  gap: 10px;
  align-items: center;
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

/**
 * Constructor for a custom field element.
 * labelFor allows you to target elements
 * nested in wrappers, dynamic elements, etc
 * @param {Object} config
 * @param {Element} config.element - The custom or DOM element to wrap
 * @param {String} config.label - Text for the label
 * @param {String} [config.labelPosition='left'] - Position of label: top, right, bottom, left
 * @param {Array<String>} [config.fieldClasses] - Extra classes for field wrapper
 * @param {Array<String>} [config.labelClasses] - Extra classes for the label
 * @param {String} [config.labelFor] - ID the label should target
 
 */
export function createFormField({
  element,
  label,
  labelPosition = 'left',
  fieldClasses,
  labelClasses,
  labelFor,
}) {
  injectStyle(css)
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
