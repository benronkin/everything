import { injectStyle } from '../_assets/js/ui.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
th {
  cursor: pointer;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createTableHeader({
  id = '',
  className = '',
  label = '',
  name = '',
} = {}) {
  injectStyle(css)

  const el = document.createElement('th')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = `${newValue}`.trim()
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = newValue
      },
    },
    label: {
      get() {
        return el.querySelector('span').value
      },
      set(newValue) {
        el.querySelector('span').value = newValue
      },
    },
    name: {
      get() {
        return el.dataset.name
      },
      set(newValue) {
        el.dataset.name = newValue
      },
    },
    order: {
      get() {
        return el.dataset.sortOrder
      },
      set(newValue) {
        if (!newValue) {
          el.querySelector('i').classList.add('hidden')
          delete el.dataset.sortOrder
          return
        }
        el.dataset.sortOrder = newValue
        const iconEl = el.querySelector('i')
        iconEl.classList.remove('hidden')
        if (newValue === 'ASC') {
          iconEl.classList.add('fa-arrow-up-short-wide')
          iconEl.classList.remove('fa-arrow-down-wide-short')
        } else {
          iconEl.classList.remove('fa-arrow-up-short-wide')
          iconEl.classList.add('fa-arrow-down-wide-short')
        }
      },
    },
    toggle: {
      value: function () {
        el.dataset.sortOrder = el.dataset.sortOrder === 'ASC' ? 'DESC' : 'ASC'
        const iconEl = el.querySelector('i')
        iconEl.classList.toggle(
          'fa-arrow-down-wide-short',
          el.dataset.sortOrder === 'DESC'
        )
        iconEl.classList.toggle(
          'fa-arrow-up-short-wide',
          el.dataset.sortOrder === 'ASC'
        )
        iconEl.classList.remove('hidden')
      },
    },
  })

  addElementParts({ el })
  addEventHandlers({ el })

  id && (el.dataId = id)
  className && (el.classes = className)
  el.label = label
  el.name = name

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Toggle the header icon.
 * Table.js handles the header click
 */
function handleHeaderClick(e) {
  const el = e.target.closest('th')
  el.toggle()

  localStorage.setItem('note-sort-field', el.dataset.name)
  localStorage.setItem('note-sort-direction', el.order)

  el.closest('table').dispatchEvent(
    new CustomEvent('header-click', {
      detail: { label: el.label, order: el.order },
    })
  )
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts({ el }) {
  el.appendChild(createSpan({}))
  el.appendChild(createIcon({ className: 'hidden' }))
}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers({ el }) {
  el.addEventListener('click', handleHeaderClick)
}
