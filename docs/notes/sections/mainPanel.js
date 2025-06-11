import { injectStyle } from '../../assets/js/ui.js'
import { createDivQuill } from '../../assets/composites/divQuill.js'
import { createDiv } from '../../assets/partials/div.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { dangerZone } from './dangerZone.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { fetchNote, updateNote } from '../notes.api.js'
import { setMessage } from '../../assets/js/ui.js'
import { debounce } from '../../assets/js/utils.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-height: 83vh;
}
#main-panel.hidden {
  display: none;
}
#main-panel form {
  gap: 0 !important;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)
  listen(el)

  el.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'note-title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: { group: 'mb-20', input: 'field', icon: 'fa-note-sticky' },
    })
  )

  const divEl = createDiv({ id: 'editor' })
  el.appendChild(divEl)

  state.set(
    'quill',
    createDivQuill({
      div: divEl,
    })
  )

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'note-id', className: 'smaller' }))
}

/**
 *
 */
function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      log(`mainPanel is hiding itself on app-mode: ${appMode}`)
      return
    }
    reactAppMode(el)
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('#note-title').addEventListener('keyup', handleUpdateNote)

  const quill = state.get('quill')

  quill.on('text-change', (delta, oldDelta, source) => {
    // source === 'user' if the user typed or edited
    // source === 'api' if you called quill.setContents(), insertText(), etc.
    handleUpdateNote()
  })
}

/**
 *
 */
async function reactAppMode(el) {
  const doc = state.get('active-doc')

  if (!doc.note) {
    const { note: noteDoc } = await fetchNote(doc.id)
    doc.note = noteDoc.note
    state.set('active-doc', doc)
  }

  el.classList.remove('hidden')
  log('mainPanel is showing itself on active-doc')

  el.querySelector('#note-title').value = doc.title

  const quill = state.get('quill')
  const delta = quill.clipboard.convert({ html: doc.note })
  quill.setContents(delta, 'silent')
  el.querySelector('#note-id').insertHtml(doc.id)
}

/**
 *
 */
async function handleUpdateNote() {
  debouncedUpdate()
}

const debouncedUpdate = debounce(async () => {
  setMessage({ message: 'saving...', type: 'quiet' })
  const note = state.get('quill').root.innerHTML
  const id = state.get('active-doc').id
  const title = document.querySelector('#note-title').value
  const { message } = await updateNote({ id, title, note })
  setMessage({ message: 'saved', type: 'quiet' })
}, 2000)
