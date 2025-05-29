import { state } from '../js/state.js'
import { handleTokenQueryParam, getWebApp, postWebAppJson } from '../js/io.js'
import { getEl, setMessage } from '../js/ui.js'
import { createFooter } from '../sections/footer.js'
import { createNav } from '../sections/nav.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { createMainIconGroup } from '../sections/mainIconGroup.js'
import { createDivQuill } from '../partials/divQuill.js'
import { createButton } from '../partials/button.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createInput } from '../partials/input.js'

// ---------------------------------------
// Globals
// ---------------------------------------

let quill

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

  const id = new URLSearchParams(window.location.search).get('id')
  if (!id?.trim().length) {
    setMessage({ message: 'No id search param found', type: 'danger' })
    return
  }

  const { note, error } = await getWebApp(
    `${state.getWebAppUrl()}/notes/read-one?&id=${id}`
  )

  if (error) {
    setMessage({ message: error, type: 'danger' })
    return
  }

  if (!note) {
    window.location.href = 'index.html'
  }

  if (!note.id?.trim().length) {
    setMessage({
      message: `Didn't receive note data from server`,
      type: 'danger',
    })
    return
  }

  populateSinglePanel(note)

  setMessage()

  state.setDefaultPage('notes')
}

/**
 * When the user hits the save-note button
 */
async function handleSaveClick() {
  const id = state.get('active-note').id
  const title = getEl('note-title').value
  const note = quill.value
  state.set('active-note', { id, title, note })
  const { error } = await postWebAppJson(
    `${state.getWebAppUrl()}/notes/update`,
    {
      id,
      title,
      note,
    }
  )
  if (error) {
    setMessage({ message: error })
  }
  getEl('save-btn').disabled = true
}

/**
 * Send to server note updates
 */
function handleCheckChanges() {
  const { title: originalTitle, note: originalNote } = state.get('active-note')
  const titleChanged = getEl('note-title').value !== originalTitle
  const noteChanged = quill.value !== originalNote
  getEl('save-btn').disabled = !(titleChanged || noteChanged)
}

/**
 * Send user back to note list
 */
function handleBackClick() {
  window.location.href = 'index.html'
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
function populateSinglePanel({ id, title, note = '' } = {}) {
  document.title = `${title} | Ben Ronkin`
  getEl('single-panel').value = ''

  getEl('single-panel').appendChild(
    createDiv({ id: 'flex-div', className: 'flex' })
  )

  getEl('flex-div').appendChild(
    createMainIconGroup({
      collapsable: false,
      children: [
        createIcon({
          id: 'back-btn',
          className: 'fa-chevron-left',
          events: { click: handleBackClick },
        }),
      ],
    })
  )
  getEl('flex-div').appendChild(
    createInput({
      id: 'note-title',
      placeholder: 'Note title...',
      value: title,
      className: 'u-m-0',
      events: { input: handleCheckChanges },
    })
  )

  getEl('flex-div').appendChild(
    createButton({
      id: 'save-btn',
      value: 'Save',
      disabled: true,
      events: { click: handleSaveClick },
    })
  )

  const divEl = createDiv({ id: 'editor' })
  divEl.value = note
  getEl('single-panel').appendChild(divEl)
  quill = createDivQuill({
    div: divEl,
    events: { 'text-change': handleCheckChanges },
  })

  state.set('active-note', { id, title, note: quill.value })
}
