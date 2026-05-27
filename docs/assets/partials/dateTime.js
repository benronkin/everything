import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'
import { createDiv } from './div.js'

// it's best to style the component
// inside its consumer using .date-time
const css = `
input[name="date"] {
  margin-right: 20px;
}
`
/**
 * Returns a div containing two inputs for date and time.
 * The name property is used in setting field-changed in state.
 * You can pass the value as ISO or Date either as value, or by
 * setting it after the div is structured by callign setDateTime().
 * The component will split to the date and time fields.
 * The component sets field-changed only when the date field has a value.
 */
export function createDateTime({ name, value }) {
  injectStyle(css)

  const el = createDiv({ className: 'date-time' })

  build(el)
  listen(el)

  el.setDateTime = setDateTime.bind(el)

  if (name) {
    el.dataset.name = name
    el.classList.add(name)
  }

  if (value) el.setDateTime(value)

  return el
}

/**
 *
 */
function build(el) {
  const dateEl = document.createElement('input')
  dateEl.type = 'date'
  dateEl.name = 'date'
  el.appendChild(dateEl)

  const timeEl = document.createElement('input')
  timeEl.type = 'time'
  timeEl.name = 'time'
  el.appendChild(timeEl)
}

/**
 *
 */
function listen(el) {
  el.querySelectorAll('input').forEach((i) =>
    i.addEventListener('change', handleInputChange)
  )
}

/**
 * value is ISOString or Date
 */
function setDateTime(value) {
  const { dateString, error } = badDateTimeValue(value)
  if (error) throw new Error(error)

  dateString && (value = dateString)

  const valString = typeof value !== 'string' ? value.toISOString() : value
  const [datePart, fullTimePart] = valString.split('T')
  const timePart = fullTimePart.substring(0, 5)
  this.querySelector('[name="date"]').value = datePart
  this.querySelector('[name="time"]').value = timePart
}

/**
 *
 */
export function badDateTimeValue(value) {
  if (!value) {
    return { error: 'Oops, dateTime.set() did not receive a value' }
  }
  if (value instanceof Date) {
    return {
      dateString: value.toISOString()
    }
  }
  if (typeof value == 'string' && !value.includes('T')) {
    const date = new Date(value)
    const dateString = date.toISOString()
    return { dateString }
  }
  return {}
}

/**
 *
 */
function handleInputChange(e) {
  const el = e.target.closest('.date-time')
  const dateString = el.querySelector('[name="date"]').value
  const timeString = el.querySelector('[name="time"]').value

  if (!dateString) {
    console.log('No date value')
    return
  }

  const value = timeString
    ? new Date(`${dateString}T${timeString}Z`)
    : new Date(`${dateString}T00:00:00Z`)
  const valueString = value.toISOString()
  state.set('field-changed', { name: el.dataset.name, value: valueString })
}
