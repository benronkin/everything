import { state } from '../js/state.js'
import { getEl, setMessage } from '../js/ui.js'
import { setEvents } from './events.js'
import { createNav } from '../sections/nav.js'
import { createFileInput } from '../partials/fileInput.js'
import { createFooter } from '../sections/footer.js'
import { createForm } from '../partials/form.js'
import { createIcon } from '../partials/icon.js'
import { createInput } from '../partials/input.js'
import { createList } from '../partials/list.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createModalDelete } from '../sections/modalDelete.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { createSearch } from '../partials/search.js'
import { handleTokenQueryParam, getWebApp } from '../js/io.js'

// ----------------------
// Event handlers
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  setMessage({ message: 'Loading...' })

  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  const { journal } = await getWebApp(`${state.getWebAppUrl()}/journal/read`)

  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({ title: '<i class="fa-solid fa-book"></i> Journal' })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'journal' })
  document.querySelector('main').prepend(rightDrawerEl)

  const mainIconGroup = createMainIconGroup({
    shouldAllowCollapse: {
      message: 'Select a jounral entry first',
      cb: () => !!state.get('active-journal'),
    },
    children: [createIcon({ id: 'add-journal', className: 'fa-plus' })],
  })
  getEl('main-icon-group-wrapper').appendChild(mainIconGroup)

  getEl('left-panel').prepend(
    createSearch({
      iconClass: 'fa-magnifying-glass',
      placeholder: 'Search journals',
      searchCb: searchJournal,
      searchResultsCb: handleSearchResult,
    })
  )

  getEl('left-panel').appendChild(
    createList({
      id: 'left-panel-list',
      itemClass: 'menu-item',
    })
  )

  getEl('photos-header-wrapper').appendChild(
    createIcon({
      id: 'add-photo-toggle',
      className: 'fa-camera primary',
    })
  )
  getEl('upload-photo-wrapper').appendChild(
    createForm({
      id: 'add-photo-form',
      className: 'hidden',
      submitText: 'Upload',
      disabled: true,
      children: [
        createFileInput({
          id: 'photo-file-input',
          label: 'Select image',
          accept: 'image/*',
          iconClass: 'fa-camera',
        }),
        createInput({
          id: 'photo-caption-input',
          className: 'bb-white',
          name: 'caption',
          type: 'text',
          placeholder: 'Describe this photo...',
          maxLength: '200',
        }),
        createInput({
          id: 'photo-entry-id',
          type: 'hidden',
          name: 'entry',
        }),
      ],
      events: {
        // set the form's button's disabled
        // based on file input contents
        change: () => {
          const el = getEl('add-photo-form')
          const fileInput = el.querySelector('input[type="file"]')
          el.disabled = !(fileInput?.files?.length > 0)
        },
      },
    })
  )

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  document.querySelector('body').appendChild(
    createModalDelete({
      header: 'Delete entry',
      id: 'modal-delete',
      password: true,
    })
  )

  // imported from the events.js module
  setEvents()

  // must run after journal-state-changed EH is added
  // so as to trigger journal list population
  state.set('journal', journal)
  state.setDefaultPage('journal')

  setMessage()
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Get the searched journals
 */
async function searchJournal(q) {
  const data = await getWebApp(
    `${state.getWebAppUrl()}/journal/search?q=${q.trim().toLowerCase()}`
  )

  const { journal, message } = data
  if (message) {
    console.log(`searchJournal error: ${message}`)
    return message
  }
  return journal
}

/**
 * Handle results coming from the search partial
 */
async function handleSearchResult(results) {
  state.set('journa', results)
}
