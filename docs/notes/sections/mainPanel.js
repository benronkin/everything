import { injectStyle } from '../../assets/js/ui.js'
import { createEditor } from '../../assets/composites/editor.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
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
/* headline style for the title input */
#note-title {
  font-size: 1.8rem;      /* big, h2-ish */
  font-weight: 700;
  line-height: 1.2;
  border: none;           /* kill the input underline */
  background: transparent;
  width: 100%;
  padding: 4px 0 2px;
}

/* add a faint divider under the title so it still feels editable */
#note-title:focus,
#note-title:hover {
  border-bottom: 1px solid var(--gray3);
  outline: none;
}
#toc-list {
  position: fixed;
  top: var(--nav-height);
  right: 0;
  height: calc(100% - var(--nav-height));
  /* make the pane itself scrollable */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;   /* smooth momentum scroll on iOS */
  z-index: 1000;
  background: var(--gray1);
  width: 250px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transition: all 300ms ease;
  transform: translateX(100%);
}
#toc-list.open {
  transform: translateX(0);
}
.toc-header {
  position: sticky;
  top: 0;
  background: var(--teal2);
  color: black;
  font-weight: 700;
  padding: 10px;
  transition: all 0.2s ease-in-out;
}
.toc-item {
  cursor: pointer;
  padding: 10px;
}
.toc-item.p-left-0 {
  margin-top: 15px;
}
.toc-item:hover {
  background: var(--gray2);
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

export async function executeNoteUpdate() {
  const note = document.querySelector('.editor').value
  const id = state.get('active-doc')

  if (!id) return // timed-out call after active-doc became null

  const title =
    document.querySelector('#note-title').value.trim() || 'Untitled note'

  const docs = state.get('main-documents')
  const doc = docs.find((d) => d.id === id)
  doc.title = title
  doc.note = note
  state.set('main-documents', docs)

  await updateNote({ id, title, note })
  setMessage({ message: 'saved', type: 'quiet' })
  // used to force save after 15 seconds of no-save
  state.set('mainPanel:last-save', Date.now())
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

  el.appendChild(createEditor())

  el.appendChild(createDiv({ id: 'toc-list' }))

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'note-id', className: 'smaller' }))

  el.querySelector('#note-title').taxIndex = '0'
  el.querySelector('.editor').taxIndex = '1'
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    const inMainPanel = appMode === 'main-panel'

    el.classList.toggle('hidden', !inMainPanel)

    const classes = ['.ta-icon', '.ta-select']
    classes.forEach((c) =>
      document.querySelectorAll(c).forEach((e) => e.classList.add('hidden'))
    )

    const ids = ['#back', '#edit', '#toc']
    ids.forEach((id) => {
      document.querySelector(id).classList.toggle('hidden', !inMainPanel)
    })

    document.querySelector('#toc-list').classList.remove('open')
    document.querySelector('#toc').classList.remove('on')
    document.querySelector('#edit').classList.remove('on')
  })

  state.on('active-doc', 'mainPanel', async (id) => {
    el.querySelector('.editor-wrapper').setEditor('Loading...')
    if (!id) return

    const doc = { ...state.get('main-documents').find((d) => d.id === id) }
    if (!doc.note) {
      const { note: noteDoc } = await fetchNote(doc.id)
      doc.note = noteDoc.note
    }

    el.querySelector('#note-title').value = doc.title
    el.querySelector('.editor-wrapper').setEditor(doc.note)
    el.querySelector('.editor-wrapper').setViewer(doc.note)

    const codeEls = el.querySelectorAll('pre code')
    codeEls.forEach(hljs.highlightElement)

    el.querySelector('#note-id').insertHtml(doc.id)

    if (doc.role === 'peer') document.querySelector('.danger-zone')?.remove()
  })

  state.on('select-click:ta-header-select', 'mainPanel', (value) => {
    document.querySelector('.editor-wrapper').insertBlock(value)
    document.querySelector('#ta-header-select').selectByLabel('H')
    document.querySelector('.editor').focus()
  })

  state.on('right-drawer-toggle-click', 'mainPanel', () => {
    document.querySelector('#toc-list').classList.remove('open')
  })

  state.on('icon-click:edit', 'mainPanel', () => {
    const editEl = document.querySelector('#edit')
    const editorEl = el.querySelector('.editor')
    const viewerEl = el.querySelector('.viewer')

    // Save scroll position BEFORE changing anything
    const scrollY = window.scrollY

    editEl.classList.toggle('on')
    document.querySelector('#toc-list').classList.remove('open')

    viewerEl.classList.toggle('hidden')
    document.querySelector('.editor-wrapper').setViewer(editorEl.value)
    editorEl.classList.toggle('hidden')
    editorEl.resize()

    // Restore scroll AFTER layout shift
    window.scrollTo({ top: scrollY })

    const isEditOn = editEl.classList.contains('on')

    document
      .querySelectorAll('.ta-icon')
      .forEach((i) => i.classList.toggle('hidden', !isEditOn))

    document.querySelector('#toc').classList.toggle('hidden', isEditOn)

    document
      .querySelector('#ta-header-select')
      .classList.toggle('hidden', !isEditOn)
  })

  state.on('icon-click:toc', 'mainPanel', () => {
    document.querySelector('#toc').classList.toggle('on')

    const tocListEl = document.getElementById('toc-list')
    if (!tocListEl.classList.contains('open')) {
      updateTableOfContents()
    }
    tocListEl.classList.toggle('open')
  })

  state.on('icon-click:close-toc-list', 'mainPanel', () => {
    document.querySelector('#toc').classList.remove('on')
    document.getElementById('toc-list').classList.remove('open')
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

  document.querySelectorAll('i.ta-icon').forEach((i) => {
    i.addEventListener('mousedown', () => {
      document.querySelector('.editor-wrapper').saveSelectedRange()
    })

    i.addEventListener('mouseup', (e) => {
      const snippet = e.currentTarget.dataset.snippet || '--snippet missing--'
      document.querySelector('.editor-wrapper').insertBlock(snippet)
      editorEl.focus()
    })
  })

  document
    .querySelector('#ta-header-select')
    .addEventListener('mousedown', () => {
      document.querySelector('.editor-wrapper').saveSelectedRange()
    })

  editorEl.addEventListener('keydown', (e) => {
    if (e.metaKey && e.key === 'Enter') {
      e.preventDefault() // prevent the default Enter behavior

      const editor = e.currentTarget
      const { selectionEnd, value } = editor

      // find the index of the next newline after the caret
      const lineEnd = value.indexOf('\n', selectionEnd)

      // if no newline is found, we’re at the last line → insert at end
      // otherwise, insert just after the current line
      const insertPos = lineEnd === -1 ? value.length : lineEnd + 1

      const before = value.slice(0, insertPos) // content before the insertion point
      const after = value.slice(insertPos) // content after the insertion point

      // insert a new line at insertPos
      editor.value = before + '\n' + after

      // move the caret to the beginning of the new empty line
      editor.setSelectionRange(insertPos + 1, insertPos)
    }

    if (e.metaKey && e.shiftKey) {
      const iconMap = {
        a: '.fa-link',
        c: '.fa-code',
        i: '.fa-minus',
        b: '.fa-quote-left',
        o: '.fa-list-ol',
        u: '.fa-list-ul',
      }

      const optionMap = {
        h: 'H1',
        d: 'Normal',
      }

      let block
      let selector = iconMap[e.key]
      let el = document.querySelector(selector)
      if (el) {
        block = el.dataset.snippet
      } else {
        selector = optionMap[e.key]
        el = [...document.querySelectorAll('#ta-header-select option')].find(
          (opt) => opt.label === selector
        )
        if (el) {
          block = el.value
        }
      }

      if (!block) return
      e.preventDefault()
      document.querySelector('.editor-wrapper').saveSelectedRange()
      document.querySelector('.editor-wrapper').insertBlock(block)
      editorEl.focus()
    }
  })

  editorEl.addEventListener('keyup', () => {
    removeToasts()
    handleUpdateNote()
  })
}

async function handleUpdateNote() {
  const now = Date.now()
  const last = state.get('mainPanel:last-save') || 1

  if (last && now - last >= 15000) {
    // force update after 15 seconds of no-save
    await executeNoteUpdate()
  } else {
    debouncedUpdate()
  }
}

const debouncedUpdate = debounce(executeNoteUpdate, 3000)

function updateTableOfContents() {
  const viewerEl = document.querySelector('.viewer')
  const headerEls = [...viewerEl.querySelectorAll('h1,h2,h3,h4,h5')]
  const tocEl = document.querySelector('#toc-list')

  tocEl.innerHTML = ''

  tocEl.appendChild(
    createHeader({
      html: [
        document.querySelector('#note-title').value,
        createIcon({
          id: 'close-toc-list',
          classes: { primary: 'fa-circle-xmark' },
        }),
      ],
      type: 'h5',
      className: 'toc-header flex align-center',
    })
  )

  headerEls.forEach((h) => {
    let indent = parseInt(h.tagName[1]) - 1
    // default padding left is 10px, which is what
    // h1 has, so h2 and beyond needs 1 more
    if (indent > 0) indent++
    tocEl.appendChild(
      createDiv({
        className: `toc-item p-left-${indent * 10}`,
        html: h.textContent,
        dataset: { id: h.id },
      })
    )
  })

  tocEl.querySelectorAll('.toc-item').forEach((i) =>
    i.addEventListener('click', (e) => {
      const target = document.getElementById(e.target.dataset.id)
      const yOffset = -180
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  )
}
