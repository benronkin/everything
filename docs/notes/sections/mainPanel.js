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

  el.appendChild(createDiv({ id: 'toc-list' }))

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
    el.querySelector('.viewer').insertHtml(standardizeViewer(doc.note))

    const codeEls = el.querySelectorAll('pre code')
    codeEls.forEach(hljs.highlightElement)

    el.querySelector('#note-id').insertHtml(doc.id)

    if (doc.role === 'peer') document.querySelector('.danger-zone')?.remove()
  })

  state.on('select-click:ta-header-select', 'mainPanel', (value) => {
    insertBlock(value)
    document.querySelector('#ta-header-select').selectByLabel('H')
    document.querySelector('.editor').focus()
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

  document.querySelector('#toc').addEventListener('click', () => {
    const tocListEl = document.getElementById('toc-list')
    if (!tocListEl.classList.contains('open')) {
      updateTableOfContents()
    }
    tocListEl.classList.toggle('open')
  })

  document.querySelector('#edit').addEventListener('click', (e) => {
    e.target.classList.toggle('on')
    const isEditOn = e.target.classList.contains('on')

    viewerEl.classList.toggle('hidden')
    viewerEl.insertHtml(standardizeViewer(editorEl.value))
    editorEl.classList.toggle('hidden')
    editorEl.resize()

    document
      .querySelectorAll('.ta-icon')
      .forEach((i) => i.classList.toggle('hidden', !isEditOn))

    document.querySelector('#toc').classList.toggle('hidden', isEditOn)

    document
      .querySelector('#ta-header-select')
      .classList.toggle('hidden', !isEditOn)
  })

  document.querySelectorAll('i.ta-icon').forEach((i) => {
    i.addEventListener('mousedown', saveSelectedRange)

    i.addEventListener('mouseup', (e) => {
      const snippet = e.currentTarget.dataset.snippet || '--snippet missing--'
      insertBlock(snippet)
      editorEl.focus()
    })
  })

  document
    .querySelector('#ta-header-select')
    .addEventListener('mousedown', saveSelectedRange)

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
      saveSelectedRange()
      insertBlock(block)
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

/**
 * Various manipulation of the note
 * before it is injected into the viewer
 * as markup
 */
function standardizeViewer(text) {
  text = escapeHtmlBlocks(text)
  text = trimCodeBlocks(text)
  return text
}

/**
 * Get the value of the editor and convert
 * HTML blocks inside code.language-html to
 * strings so that the viewer can render them
 */
function escapeHtmlBlocks(text) {
  const re = /<code class="language-html">([\s\S]*?)<\/code>/g

  const replacer = (_, codeConteent) => {
    const escaped = codeConteent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<code class="language-html">${escaped}</code>`
  }
  return text.replace(re, replacer)
}

/**
 * Remove leading and trailing empty lines from code blocks
 */
function trimCodeBlocks(text) {
  const re = /<code class="(language-[^"]*)">([\s\S]*?)<\/code>/g

  const replacer = (_, langClass, codeContent) => {
    let lines = codeContent.split('\n')
    if (lines[0].trim() === '') lines.shift()
    if (lines[lines.length - 1].trim() === '') lines.pop()

    const trimmed = lines.join('\n')

    return `<code class="${langClass}">${trimmed}</code>`
  }

  return text.replace(re, replacer)
}

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
    tocEl.appendChild(
      createDiv({
        className: `toc-item p-left-${(parseInt(h.tagName[1]) - 3) * 10}`,
        html: h.textContent,
        dataset: { id: h.id },
      })
    )
  })

  tocEl.querySelectorAll('.toc-item').forEach((i) =>
    i.addEventListener('click', (e) => {
      document
        .getElementById(e.target.dataset.id)
        .scrollIntoView({ behavior: 'smooth' })
    })
  )
}
