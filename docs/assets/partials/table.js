import { injectStyle } from '../js/ui.js'
import { createTableHeader } from './tableHeader.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: var(--gray6);
  table-layout: fixed;
}

table th,
table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--gray2);
}

table thead {
  background: var(--gray1);
  border-bottom: 2px solid var(--purple2);
}

table tbody tr:nth-child(even) {
  background: var(--gray0);
}

table tbody tr:nth-child(odd) {
  background: var(--gray1);
}

table tbody tr:hover {
  background: var(--blue0);
}

table select,
table input {
  font-family: inherit;
  font-size: inherit;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid var(--gray3);
  background: var(--gray2);
  color: var(--gray6);
  width: 100%;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createTable({
  id = '',
  className = '',
  headers = [],
  events = { 'header-click': () => {} },
} = {}) {
  injectStyle(css)

  const el = document.createElement('table')

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
        el.dataset.testId = `id-span`
      },
    },
    headers: {
      get() {
        return [...el.querySelectorAll('th')]
      },
      set(headers) {
        if (!headers.length) {
          return
        }
        let theadEl = this.querySelector('thead')
        if (theadEl) {
          theadEl.innerHTML = ''
        } else {
          theadEl = document.createElement('thead')
          this.prepend(theadEl)
        }

        const trEl = document.createElement('tr')
        theadEl.append(trEl)
        for (const { label, name } of headers) {
          const thEl = createTableHeader({ label, name })
          trEl.appendChild(thEl)
        }
      },
    },
    rows: {
      set(rows) {
        let tbody = this.querySelector('tbody')
        if (tbody) {
          tbody.innerHTML = ''
        } else {
          tbody = document.createElement('tbody')
          this.appendChild(tbody)
        }
        if (!rows.length) {
          return
        }
        for (const row of rows) {
          this.addRow(row)
        }
      },
    },
    sort: {
      get() {
        const sorter = this.getSorter()
        if (!sorter) {
          console.log('sorter has not been set')
          return null
        }
        return { field: sorter.label, direction: sorter.order }
      },
      set({ name, direction }) {
        const sorter = this.getHeaderByName(name)
        sorter.order = direction
        sorter.querySelector('i').classList.remove('hidden')
      },
    },
  })

  el.addRow = addRow.bind(el)
  el.clear = clear.bind(el)
  el.clearRows = clearRows.bind(el)
  el.getHeaderByName = getHeaderByName.bind(el)
  el.getSorter = getSorter.bind(el)
  el.hideHeaderSorters = hideHeaderSorters.bind(el)

  addEventHandlers(el, events)

  el.className = className
  el.id = id
  el.dataset.id = id
  el.dataset.testId = id
  el.headers = headers

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

function handleHeaderClick(e) {
  e.target.closest('table').hideHeaderSorters(e)
  return
}

// -------------------------------
// Object methods
// -------------------------------

function addRow({ id, fields }) {
  const tr = document.createElement('tr')
  tr.dataset.id = id
  for (const field of fields) {
    const td = document.createElement('td')
    td.appendChild(field)
    tr.appendChild(td)
  }
  this.querySelector('tbody').appendChild(tr)
}

/**
 * Remove thead and tbody
 */
function clear() {
  this.innerHTML = ''
  return this // for chaining
}

/**
 * Remove all rows
 */
function clearRows() {
  const tbody = this.querySelector('tbody')
  tbody && (tbody.innerHTML = '')
  return this // for chaining
}

function getHeaderByName(name) {
  const headers = this.headers
  const header = headers.find((h) => h.dataset.name === name)
  return header
}

/**
 * Get the sorting header
 */
function getSorter() {
  const headers = this.headers
  const sorter = headers.find(
    (h) => !h.querySelector('i').classList.includes('hidden')
  )
  return sorter
}

function hideHeaderSorters(e) {
  const otherHeaders = this.headers.filter((h) => h.label !== e.detail.label)
  otherHeaders.forEach((h) => (h.order = null))
}

/**
 * Add the various event handlers for the element
 */
function addEventHandlers(el, events) {
  for (const [k, v] of Object.entries(events)) {
    if (k === 'header-click') {
      el.addEventListener('header-click', (e) => {
        handleHeaderClick(e)
        v && v(e)
      })
    } else {
      el.addEventListener(k, v)
    }
  }
}
