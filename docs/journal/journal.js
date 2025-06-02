import { setStateBeforePartials } from './stateBeforePartials.js'
import { setStateAfterPartials } from './stateAfterPartials.js'
import { makeReactive } from './reactivity.js'
import { setEvents } from './events.js'
import { newState } from '../js/newState.js'
import { getEl, setMessage } from '../js/ui.js'
import { createDangerZone } from '../sections/dangerZone.js'
import { createNav } from '../sections/nav.js'
import { createFooter } from '../sections/footer.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createMainPanel } from '../sections/mainPanel.js'
import { createDelete } from '../sections/delete.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { createFileInput } from '../partials/fileInput.js'
import { createForm } from '../partials/form.js'
import { createIcon } from '../partials/icon.js'
import { createInput } from '../partials/input.js'
import { createMainDocumentsList } from '../partials/MainDocumentslist.js'
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

  // setStateBeforePartials() must run before any partials
  // are created, so that they can set their reactivity during
  // their construction
  setStateBeforePartials()

  // makeReactive registers the callbacks for the paritals.
  // can run before or after partial construction, but
  // definitely before setStateAfterPartials
  makeReactive()

  createSectionsAndPartials()

  // imported from the events.js module
  setEvents()

  // setStateAfterPartials() must run aftr all partials
  // are created and instrumented with state and event
  // listeners
  const { journal } = await getWebApp(`${newState.getAppUrl()}/journal/read`)
  setStateAfterPartials(journal)

  setMessage()
}

// ------------------------
// Helper functions
// ------------------------

/**
 *
 */
function createSectionsAndPartials() {
  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({ title: '<i class="fa-solid fa-book"></i> Journal' })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'journal' })
  document.querySelector('main').prepend(rightDrawerEl)

  const mainIconGroup = createMainIconGroup({
    shouldAllowCollapse: {
      message: 'Select a jounral entry first',
      cb: () => !!newState.get('active-journal'),
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
    createMainDocumentsList({
      id: 'left-panel-list',
    })
  )

  getEl('columns-container').appendChild(
    createMainPanel({
      html: `
      <h5>Location</h5>
      <input name="location" data-id="journal-location" class="field" />
      <h5>Visted on</h5>
      <div class="date-input-wrapper">
        <input
          name="visit_date"
          data-id="journal-visit-date"
          class="field"
          type="date"
        />
      </div>
      <h5>Notes</h5>
      <textarea
        name="notes"
        data-id="journal-notes"
        class="field"
      ></textarea>
      <h5>City</h5>
      <input name="city" data-id="journal-city" class="field" />
      <h5>State</h5>
      <input name="state" data-id="journal-state" class="field" />
      <h5>Country</h5>
      <input name="country" data-id="journal-country" class="field" />
      <div data-id="photos-header-wrapper" class="flex u-mt-20">
        <h4>Photos</h4>
      </div>
      <div data-id="upload-photo-wrapper"></div>
      <div id="image-gallery" data-id="image-gallery"></div>
      <h5>Id</h5>
      <p data-id="journal-id" class="smaller"></p>
    `,
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

  getEl('main-panel').appendChild(
    createDelete({
      id: 'modal-delete',
    })
  )

  wrapperEl.appendChild(createFooter())
}

/**
 * Get the searched journals
 */
async function searchJournal(q) {
  const data = await getWebApp(
    `${newState.getAppUrl()}/journal/search?q=${q.trim().toLowerCase()}`
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
  newState.set('journa', results)
}
