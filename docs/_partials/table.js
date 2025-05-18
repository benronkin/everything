import { injectStyle } from '../js/ui.js'

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

const html = `
<table>
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <!-- Dynamically filled rows -->
  </tbody>
</table>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createTable(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ className, headers = [] } = {}) {
  const el = document.createElement('table')
  el.className = className
  el.innerHTML = html

  el.addHeaders = addHeaders.bind(el)
  el.addRow = addRow.bind(el)

  el.addHeaders(headers)
  return el
}

/**
 * Add the supplied headers
 */
function addHeaders(headers) {
  if (!headers.length) {
    return
  }
  const thead = this.querySelector('thead')
  const tr = thead.querySelector('tr')
  for (const headerText of headers) {
    const th = document.createElement('th')
    th.textContent = headerText
    tr.appendChild(th)
  }
}

/**
 *
 */
function addRow({ id, fields }) {
  const tbody = this.querySelector('tbody')
  const tr = document.createElement('tr')
  tr.dataset.id = id
  for (const field of fields) {
    const td = document.createElement('td')
    td.appendChild(field)
    tr.appendChild(td)
  }
  tbody.appendChild(tr)
}
