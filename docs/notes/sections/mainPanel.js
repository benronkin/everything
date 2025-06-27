import { injectStyle } from '../../assets/js/ui.js'
import { createEditor } from '../../assets/composites/editor.js'
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
import { removeToasts } from '../../assets/partials/toast.js'

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
#main-panel input {
  border-bottom: 1px solid var(--gray0);
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)
  listen(el)

  el.id = 'main-panel'

  return el
}

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

  // const divEl = createDiv({ id: 'editor' })
  // el.appendChild(divEl)

  // state.set(
  //   'quill',
  //   createDivQuill({
  //     div: divEl,
  //   })
  // )

  el.appendChild(createEditor())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'note-id', className: 'smaller' }))
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode === 'main-panel') {
      el.classList.remove('hidden')
      // log('mainPanel is showing itself on active-doc')
    } else {
      el.classList.add('hidden')
      // log(`mainPanel is hiding itself on app-mode: ${appMode}`)
    }
  })

  state.on('active-doc', 'mainPanel', async (id) => {
    if (!id) return

    const doc = { ...state.get('main-documents').find((d) => d.id === id) }
    if (!doc.note) {
      const { note: noteDoc } = await fetchNote(doc.id)
      doc.note = noteDoc.note
    }

    el.querySelector('#note-title').value = doc.title
    el.querySelector('.editor').value = doc.note
    el.querySelector('.viewer').insertHtml(doc.note)

    const codeEls = el.querySelectorAll('pre code')
    codeEls.forEach(hljs.highlightElement)

    el.querySelector('#note-id').insertHtml(doc.id)

    if (doc.role === 'peer') document.querySelector('.danger-zone')?.remove()
  })
}

function listen(el) {
  const titleEl = el.querySelector('#note-title')
  titleEl.addEventListener('keyup', () => {
    removeToasts()
    handleUpdateNote()
  })

  titleEl.addEventListener('change', () => {
    if (!titleEl.value.trim().length) titleEl.value = 'Untitled'
  })

  const editorEl = el.querySelector('.editor')
  const viewerEl = el.querySelector('.viewer')

  document
    .querySelector('#toolbar .fa-pencil')
    .addEventListener('click', (e) => {
      e.target.classList.toggle('on')
      viewerEl.classList.toggle('hidden')
      viewerEl.insertHtml(editorEl.value)
      editorEl.classList.toggle('hidden')
      editorEl.resize()

      document
        .querySelectorAll('.ta-icon')
        .forEach((i) =>
          i.classList.toggle('hidden', !e.target.classList.contains('on'))
        )
    })

  document.querySelectorAll('.ta-icon').forEach((i) => {
    i.addEventListener('mousedown', saveSelectedRange)

    i.addEventListener('mouseup', (e) => {
      const snippet = e.currentTarget.dataset.snippet || '--snippet missing--'
      insertBlock(snippet)
      editorEl.focus()
    })
  })

  editorEl.addEventListener('change', () => {
    removeToasts()
    handleUpdateNote()
  })
}

async function handleUpdateNote() {
  debouncedUpdate()
}

const debouncedUpdate = debounce(async () => {
  document.querySelectorAll('.rte-editor pre code').forEach((code) => {
    if (code.dataset.highlighted === 'yes') {
      delete code.dataset.highlighted
    }
  })
  const note = document.querySelector('.editor').value
  const id = state.get('active-doc')
  const title = document.querySelector('#note-title').value
  const { message } = await updateNote({ id, title, note })
  setMessage({ message: 'saved', type: 'quiet' })
}, 2000)

/**
 * Save the selection inside the textarea
 * before it disappears due to icon click
 */
export function saveSelectedRange() {
  const editor = document.querySelector('.editor')

  state.set('editor-selection', {
    start: editor.selectionStart,
    end: editor.selectionEnd,
  })
}

/**
 * Insert a block of markup into the textarea
 * at the caret's position
 * @param {string} block - The DOM element to insert
 */
function insertBlock(block) {
  const selection = state.get('editor-selection')
  if (!selection) {
    console.log('No editor selection saved')
    return
  }

  const editorEl = document.querySelector('.editor')
  const start = editorEl.selectionStart
  const end = editorEl.selectionEnd
  // const { start, end } = selection
  const value = editorEl.value
  const placeholder = '$1'

  let caretOffset = block.indexOf(placeholder)
  if (caretOffset !== -1) {
    block = block.replace(placeholder, '')
  } else {
    caretOffset = block.length
  }

  editorEl.value = value.slice(0, start) + block + value.slice(end)

  const caretPos = start + caretOffset
  editorEl.setSelectionRange(caretPos, caretPos)
}
