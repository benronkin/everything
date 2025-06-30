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

  state.on('icon-click:back', 'mainPanel', () => {
    document.querySelector('#toc-list').classList.remove('open')
    document.querySelector('#toc').classList.remove('on')
  })

  state.on('icon-click:edit', 'mainPanel', () => {
    const editEl = document.querySelector('#edit')
    const editorEl = el.querySelector('.editor')
    const viewerEl = el.querySelector('.viewer')

    editEl.classList.toggle('on')
    document.querySelector('#toc-list').classList.remove('open')

    viewerEl.classList.toggle('hidden')
    document.querySelector('.editor-wrapper').setViewer(editorEl.value)
    editorEl.classList.toggle('hidden')
    editorEl.resize()

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
        c: '.fa-code',
        i: '.fa-window-minimize',
        m: '.fa-circle-info',
        o: '.fa-list-ol',
        u: '.fa-list-ul',
      }

      const optionMap = {
        h: 'H3',
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
}, 3000)

function updateTableOfContents() {
  const viewerEl = document.querySelector('.viewer')
  const headerEls = [...viewerEl.querySelectorAll('h1,h2,h3,h4,h5')]
  const tocEl = document.querySelector('#toc-list')

  tocEl.innerHTML = ''

  tocEl.appendChild(
    createHeader({
      html: document.querySelector('#note-title').value,
      type: 'h5',
      className: 'toc-header',
    })
  )

  headerEls.forEach((h) => {
    let indent = parseInt(h.tagName[1]) - 3
    // default padding left is 10px, so indent 0
    // has it and everyone else has 2 more
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
