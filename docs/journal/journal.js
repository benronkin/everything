import { newState } from '../_assets/js/newState.js'
import { nav } from './tiles/nav.js'
import { toolbar } from './tiles/toolbar.js'
import { rightDrawer } from './tiles/rightDrawer.js'
import { leftPanel } from './tiles/leftPanel.js'
import { mainPanel } from './tiles/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_sections/footer.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import { fetchMainDocuments } from './journal.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    handleTokenQueryParam()

    build()
  } catch (error) {
    console.trace(error)
    // window.location.href = `../index.html?error=${error.message}`
  }
})

// ------------------------
// Helper functions
// ------------------------

/**
 *
 */
async function build() {
  document.head.title = 'Journal | Ben'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })

  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())
  wrapperEl.appendChild(columnsWrapperEl)
  wrapperEl.appendChild(createFooter())

  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  newState.set('main-documents', await fetchMainDocuments())
  return

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
