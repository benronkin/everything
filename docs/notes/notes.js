import { state } from '../js/state.js'
import { handleTokenQueryParam, getWebApp } from '../js/io.js'
import { getEl, isoToReadable, setMessage } from '../js/ui.js'
import { createFooter } from '../sections/footer.js'
import { createNav } from '../sections/nav.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createAnchor } from '../partials/anchor.js'
import { createIcon } from '../partials/icon.js'
import { createTable } from '../partials/table.js'
import { createSelect } from '../partials/select.js'
import { createSpan } from '../partials/span.js'

// ---------------------------------------
// Event listeners
// ---------------------------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  setMessage({ message: 'Loading...' })

  handleTokenQueryParam()

  addPageElements()

  populateSinglePanel()

  await fetchNotes()

  state.setDefaultPage('notes')
}

/**
 *
 */
function handleSortSelectChange(e) {
  const sort = e.target.value
  localStorage.setItem('note-sort-field', sort)
  fetchNotes()
}

/**
 *
 */
async function handleAddNoteClick() {
  setMessage({ message: 'Creating...' })
  const { id, error } = await getWebApp(`${state.getWebAppUrl()}/notes/create`)

  if (error) {
    setMessage({ message: error, type: 'danger' })
    return
  }

  window.location.href = `note.html?id=${id}`
}

/**
 *
 */
function handleTableHeaderClick() {
  fetchNotes()
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Set nav, footer and other page elements
 */
function addPageElements() {
  // create nav and footer
  const wrapperEl = document.querySelector('.wrapper')
  const navEl = createNav({
    title: '<i class="fa-solid fa-note-sticky"></i> notes',
    active: 'notes',
  })
  wrapperEl.prepend(navEl)
  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  const rightDrawerEl = createRightDrawer({ active: 'notes' })
  document.querySelector('main').prepend(rightDrawerEl)
}

/**
 *
 */
function populateSinglePanel() {
  const sort = localStorage.getItem('note-sort-field') || 'title'

  getEl('single-panel').value = ''

  getEl('single-panel').appendChild(
    createMainIconGroup({
      collapsable: false,
      children: [
        createSelect({
          id: 'sort-select',
          options: [
            { label: 'Title', value: 'title' },
            { label: 'Recent', value: 'accessed_at' },
            { label: 'Updated', value: 'updated_at' },
            { label: 'Created', value: 'created_at' },
          ],
          value: sort,
          events: { change: handleSortSelectChange },
        }),
        createIcon({
          id: 'add-btn',
          className: 'fa-plus',
          events: { click: handleAddNoteClick },
        }),
      ],
    })
  )

  getEl('single-panel').appendChild(
    createTable({
      id: 'notes-table',
      events: {
        'header-click': handleTableHeaderClick,
      },
    })
  )
}

/**
 *
 */
async function fetchNotes() {
  const sortField = localStorage.getItem('note-sort-field') || 'title'
  const sortDirection = localStorage.getItem('note-sort-direction') || 'ASC'

  const endpoint = `${state.getWebAppUrl()}/notes/read?sort=${sortField}&direction=${sortDirection}`
  const { notes, error } = await getWebApp(endpoint)

  if (error) {
    setMessage({ message: error, type: 'danger' })
    return
  }

  let headers

  switch (sortField) {
    case 'title':
    case 'accessed_at':
      headers = [
        { label: 'title', name: 'title' },
        { label: 'accessed', name: 'accessed_at' },
      ]
      break
    case 'created_at':
      headers = [
        { label: 'title', name: 'title' },
        { label: 'created', name: 'created_at' },
      ]
      break
    case 'updated_at':
      headers = [
        { label: 'title', name: 'title' },
        { label: 'updated', name: 'updated_at' },
      ]
      break
  }

  if (!notes.length) {
    setMessage({ message: 'No notes found' })
    return
  } else {
    setMessage()
  }

  getEl('notes-table').clear().headers = headers

  getEl('notes-table').rows = notes.map((note) => ({
    id: note.id,
    fields: [
      createAnchor({ html: note.title, url: `./note.html?id=${note.id}` }),
      createSpan({
        html: isoToReadable(note[sortField]),
      }),
    ],
  }))

  getEl('notes-table').sort = { name: sortField, direction: sortDirection }
}
