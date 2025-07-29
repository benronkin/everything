import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createBookGroup } from './book.group.js'
import { dangerZone } from './dangerZone.js'
import { debounce } from '../../assets/js/utils.js'
import { removeToasts } from '../../assets/partials/toast.js'
import { updateBook } from '../books.api.js'
import { setMessage } from '../../assets/js/ui.js'

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

}
#main-panel.hidden {
  display: none;
}
#main-panel input.field,
#main-panel textarea.field {
  padding: 0;
  margin: 0;
  border-bottom: 1px dotted var(--gray1);
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)
  listen(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(createBookGroup())

  el.appendChild(dangerZone())
}

function react(el) {
  state.on('app-mode', 'mainPanel', async (appMode) => {
    el.classList.toggle('hidden', appMode !== 'main-panel')
  })
}

function listen(el) {
  el.querySelector('#book-note').addEventListener('keyup', () => {
    removeToasts()
    persistNote()
  })
}

function persistNote() {
  const now = Date.now()
  const last = state.get('mainPanel:last-save') || 1

  if (last && now - last >= 15000) {
    // force update after 15 seconds of no-save
    executeNoteUpdate()
  } else {
    debouncedUpdate()
  }
}

const debouncedUpdate = debounce(executeNoteUpdate, 3000)

function executeNoteUpdate() {
  const elem = document.querySelector('#book-note')
  const section = elem.name
  let value = elem.value

  const id = state.get('active-doc')
  const docs = state.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  updateBook({ id, section, value }).then(() =>
    setMessage({ message: 'saved', type: 'quiet' })
  )

  // used to force save after 15 seconds of no-save
  state.set('mainPanel:last-save', Date.now())
}
