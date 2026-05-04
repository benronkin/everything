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

export function createDateTime({ name }) {
  injectStyle(css)

  const el = createDiv({ className: 'date-time' })

  build(el)
  listen(el)

  el.setDateTime = setDateTime.bind(el)
  if (name) {
    el.dataset.name = name
    el.classList.add(name)
  }

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
    i.addEventListener('change', handleInputChange),
  )
}

/**
 * value is ISOString or Date
 */
function setDateTime(value) {
  const isBad = badDateTimeValue(value)
  if (isBad) throw new Error(isBad)

  const valString = typeof value !== 'string' ? value.toISOString() : value
  const [datePart, fullTimePart] = valString.split('T')
  const timePart = fullTimePart.substring(0, 5)
  this.querySelector('[name="date"]').value = datePart
  this.querySelector('[name="time"]').value = timePart
}

/**
 *
 */
function badDateTimeValue(value) {
  if (!value) {
    return 'Oops, dateTime.set() did not receive a value'
  }
  if (typeof value !== 'string' && value instanceof Date) {
    return 'Oops, dateTime.set() did not receive an ISO date string or a Date object'
  }
  if (typeof value == 'string' && !value.includes('T')) {
    return 'Oops, dateTime.set() did not receive an ISO date string'
  }
  return null
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
