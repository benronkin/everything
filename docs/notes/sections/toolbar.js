import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createDocLinkIcon } from '../../assets/partials/docLinkIcon.js'
import { createSelect } from '../../assets/partials/select.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { executeNoteUpdate } from './mainPanel.js'

export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add-note',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
      createIcon({
        id: 'edit',
        classes: { primary: 'fa-pencil', other: 'primary hidden' },
      }),
      createIcon({
        id: 'toc',
        classes: { primary: 'fa-book-open', other: 'primary hidden' },
      }),
      createDocLinkIcon({
        id: 'doc-link',
        classes: { primary: 'fa-link', other: 'primary hidden' },
      }),
      createSelect({
        id: 'ta-header-select',
        className: 'primary p-5 ta-select',
        options: [
          {
            label: 'H',
            value: '',
            selected: 'true',
          },
          { label: 'H1', value: '<h1 id="">$1</h1>' },
          { label: 'H2', value: '<h2 id="">$1</h2>' },
          { label: 'H3', value: '<h3 id="">$1</h3>' },
          { label: 'H4', value: '<h4 id="">$1</h4>' },
          { label: 'H5', value: '<h5 id="">$1</h5>' },
          { label: 'Normal', value: '<div>\n$1\n</div>' },
        ],
      }),
      createIcon({
        classes: {
          primary: 'fa-list-ul',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: { snippet: '<ul>\n  <li>$1</li>\n</ul>' },
      }),
      createIcon({
        classes: {
          primary: 'fa-list-ol',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: { snippet: '<ol>\n  <li>$1</li>\n</ol>' },
      }),
      createIcon({
        classes: {
          primary: 'fa-minus',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: { snippet: '  <li>$1</li>' },
      }),
      createIcon({
        classes: {
          primary: 'fa-code',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: {
          snippet: '<pre><code class="language-javascript">\n$1\n</code></pre>',
        },
      }),
      createIcon({
        classes: {
          primary: 'fa-quote-left',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: {
          snippet: '<blockquote>\n$1\n</blockquote>',
        },
      }),
      createIcon({
        classes: {
          primary: 'fa-anchor',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: {
          snippet: '<a href="$1"></a>',
        },
      }),
    ],
  })

  const headerEl = el.querySelector('#ta-header-select')
  headerEl.classList.add('hidden')
  headerEl.style.width = '30px'
  headerEl.style.padding = '5px'
  headerEl.querySelector('.custom-select').style.padding = '5px'
  headerEl.querySelector(' .caret-wrapper').style.right = '-3px'

  react(el)

  return el
}

function react(el) {
  state.on('active-doc', 'notes', (id) => {
    el.querySelector('.avatar-group')?.remove()

    if (id) {
      const doc = { ...state.get('main-documents').find((d) => d.id === id) }
      el.querySelector('.icons').appendChild(
        createAvatarGroup({
          peers: doc.peers,
          className: 'ml-auto',
          showShare: doc.role === 'owner',
        })
      )
    }
  })

  state.on('icon-click:back', 'toolbar', async () => {
    const editorEl = document.querySelector('.editor')
    if (!editorEl.classList.contains('hidden')) {
      await executeNoteUpdate()
      editorEl.classList.add('hidden')
      document.querySelector('.viewer').classList.remove('hidden')
    }

    editorEl.value = ''
    document.querySelector('.viewer').innerHTML = ''

    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })

  state.on('icon-click:edit', 'toolbar', async () => {
    const editorEl = document.querySelector('.editor')
    if (!editorEl.classList.contains('hidden')) {
      await executeNoteUpdate()
      editorEl.classList.add('hidden')
      document.querySelector('.viewer').classList.remove('hidden')
    }
  })

  // toolbar shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'e') {
      e.preventDefault()
      document.querySelector('#edit').click()
      return
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault()
      document.querySelector('#add-note').click()
      return
    }

    if (e.target.classList.contains('editor')) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        const ew = document.querySelector('.editor-wrapper')
        ew.saveSelectedRange()
        ew.insertBlock('  ')
      }
    }

    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()

      const editorEl = document.querySelector('.editor')
      const start = editorEl.selectionStart
      const end = editorEl.selectionEnd

      if (start >= 2 && start === end) {
        // delete the two chars before the caret
        editorEl.setRangeText('', start - 2, start, 'end')
      }
    }
  })
}
