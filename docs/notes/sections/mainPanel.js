import { createMarkdown } from '../../assets/composites/markdown.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { dangerZone } from './dangerZone.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { state } from '../../assets/js/state.js'
import {
  fetchNote,
  fetchNoteHistories,
  fetchNoteHistory,
  updateNote,
} from '../notes.api.js'
import { setMessage } from '../../assets/js/ui.js'

import { createButton } from '../../assets/partials/button.js'

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
.input-group #note-title, .input-group .fa-note-sticky {
  font-size: 1.8rem;      /* big, h2-ish */
  font-weight: 700;
  line-height: 1.2;
}
#note-title {
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
#right-panel {
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
#right-panel.open {
  transform: translateX(0);
}
.toc-header {
  position: sticky;
  top: 0;
  background: var(--teal2);
  color: black;
  font-weight: 700;
  padding: 10px;
  transition: all 0.3s ease-in-out;;
}
.toc-item {
  cursor: pointer;
  padding: 10px;
}
.toc-item.p-left-0 {
  margin-top: 15px;
}
.toc-item:hover,
.toc-item.active {
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

export function executeNoteUpdate() {
  const note = document.querySelector('.markdown-editor').value
  const id = state.get('active-doc')

  if (!id) return // timed-out call after active-doc became null

  const title =
    document.querySelector('#note-title').value.trim() || 'Untitled note'

  const docs = state.get('main-documents')
  const doc = docs.find((d) => d.id === id)
  doc.title = title
  doc.note = note
  state.set('main-documents', docs)

  updateNote({ id, title, note })
  setMessage('saved', { type: 'quiet' })

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

  el.appendChild(createMarkdown({ name: 'note', iconsVisible: false }))

  el.appendChild(createDiv({ id: 'right-panel' }))

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'note-id', className: 'smaller' }))

  el.querySelector('#note-title').taxIndex = '0'
  el.querySelector('.markdown-viewer').taxIndex = '1'
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    const inMainPanel = appMode === 'main-panel'

    el.classList.toggle('hidden', !inMainPanel)

    document.querySelector('#right-panel').classList.remove('open')
  })

  state.on('active-doc', 'mainPanel', async (id) => {
    el.querySelector('.markdown-viewer').innerHTML = 'Loading...'
    if (!id) return

    const doc = { ...state.get('main-documents').find((d) => d.id === id) }
    if (!doc.note) {
      const { note: noteDoc } = await fetchNote(doc.id)
      doc.note = noteDoc.note
    }

    el.querySelector('#note-title').value = doc.title
    el.querySelector('.markdown-wrapper').updateEditor(doc.note)

    document.querySelector('.markdown-wrapper').updateViewer()

    el.querySelector('#note-id').insertHtml(doc.id)

    if (doc.role === 'peer') document.querySelector('.danger-zone')?.remove()
  })

  state.on('right-drawer-toggle-click', 'mainPanel', () => {
    document.querySelector('#right-panel').classList.remove('open')
  })

  state.on('icon-click:edit', 'mainPanel', () => {
    document.querySelector('.markdown-wrapper').toggle()

    document.querySelector('#right-panel').classList.remove('open')

    const scrollPercent =
      window.scrollY / (document.body.scrollHeight - window.innerHeight)

    const targetY =
      (document.body.scrollHeight - window.innerHeight) * scrollPercent
    window.scrollTo({ top: targetY, behavior: 'auto' })
  })

  state.on('icon-click:toc', 'mainPanel', () => {
    const rightPanelEl = document.getElementById('right-panel')
    if (!rightPanelEl.classList.contains('open')) {
      updateTableOfContents()
    }
    rightPanelEl.classList.toggle('open')
  })

  state.on('icon-click:history', 'mainPanel', () => {
    const rightPanelEl = document.getElementById('right-panel')
    if (!rightPanelEl.classList.contains('open')) {
      updateHistories()
    }
    rightPanelEl.classList.toggle('open')
  })

  state.on('icon-click:back', 'toolbar', async () => {
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}

function listen(el) {
  const titleEl = el.querySelector('#note-title')

  titleEl.addEventListener('change', () => {
    if (!titleEl.value.trim().length) titleEl.value = 'Untitled'
  })
}

function updateTableOfContents() {
  console.log('need to refactor updateTableOfContents')
  return
  const viewerEl = document.querySelector('.viewer')
  const headerEls = [...viewerEl.querySelectorAll('h1,h2,h3,h4,h5')]
  const rightPanelEl = document.querySelector('#right-panel')

  rightPanelEl.innerHTML = ''

  rightPanelEl.appendChild(
    createHeader({
      html: [document.querySelector('#note-title').value],
      type: 'h5',
      className: 'toc-header flex align-center',
    })
  )

  headerEls.forEach((h) => {
    let indent = parseInt(h.tagName[1]) - 1
    // default padding left is 10px, which is what
    // h1 has, so h2 and beyond needs 1 more
    if (indent > 0) indent++
    rightPanelEl.appendChild(
      createDiv({
        className: `toc-item p-left-${indent * 10}`,
        html: h.textContent,
        dataset: { id: h.id },
      })
    )
  })

  rightPanelEl.querySelectorAll('.toc-item').forEach((i) =>
    i.addEventListener('click', (e) => {
      const target = document.getElementById(e.target.dataset.id)
      const yOffset = -180
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  )
}

async function updateHistories() {
  const rightPanelEl = document.querySelector('#right-panel')

  rightPanelEl.innerHTML = ''

  rightPanelEl.appendChild(
    createHeader({
      html: 'History',
      type: 'h5',
      className: 'toc-header',
    })
  )

  const { histories } = await fetchNoteHistories(state.get('active-doc'))

  if (!histories.length) return

  histories.forEach(({ id, created_at }, idx) => {
    const date = new Date(created_at)
    const dateString = date.toLocaleString(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })

    const div = createDiv({
      className: `toc-item flex align-center`,
      dataset: { history: id },
      html: [createSpan({ html: dateString, className: 'smaller' })],
    })

    if (idx) {
      div.appendChild(
        createButton({
          html: 'Restore',
          className: 'history-btn secondary hidden',
        })
      )
    }

    rightPanelEl.appendChild(div)
  })

  const allDivs = rightPanelEl.querySelectorAll('[data-history]')
  allDivs.forEach((div) =>
    div.addEventListener('click', async (e) => {
      allDivs.forEach((d) => d.classList.remove('active'))
      div.classList.toggle('active')

      rightPanelEl
        .querySelectorAll('.history-btn')
        .forEach((btn) => btn.classList.add('hidden'))
      div.querySelector('.history-btn')?.classList.remove('hidden')

      const isRestore = !!('button', e.target.closest('button'))
      if (isRestore) {
        const note = state.get('note-body')
        document.querySelector('.markdown-editor').value = note
        document.querySelector('.markdown-editor').resize()
        await executeNoteUpdate()
        updateHistories()
        document.querySelector('#history').classList.remove('on')
      } else {
        const historyId = e.target.closest('[data-history]').dataset.history
        const { history } = await fetchNoteHistory(historyId)
        document.querySelector('.viewer').innerHTML = history.note
        state.set('note-body', history.note)
      }
    })
  )

  rightPanelEl.querySelector('[data-history]').classList.add('active')
}
