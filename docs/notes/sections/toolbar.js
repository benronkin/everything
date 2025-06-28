import { createToolbar } from '../../assets/composites/toolbar.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSelect } from '../../assets/partials/select.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

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
        id: 'toc',
        classes: { primary: 'fa-book-open', other: 'primary hidden' },
      }),
      createIcon({
        id: 'edit',
        classes: { primary: 'fa-pencil', other: 'primary hidden' },
      }),
      createSelect({
        id: 'ta-header-select',
        options: [
          {
            label: 'H',
            value: '',
            selected: 'true',
          },
          { label: 'H3', value: '<h3 id="">$1</h3>' },
          { label: 'H4', value: '<h4 id="">$1</h4>' },
          { label: 'H5', value: '<h5 id="">$1</h5>' },
          { label: 'Normal', value: '<div>\n  $1\n</div>' },
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
          primary: 'fa-window-minimize',
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
          snippet: '<pre><code class="language-javascript">//$1\n</code></pre>',
        },
      }),
      createIcon({
        classes: {
          primary: 'fa-circle-info',
          other: ['primary', 'ta-icon', 'hidden'],
        },
        dataset: {
          snippet: '<div class="comment">\n  $1\n</div>',
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
  listen(el)

  return el
}

function react(el) {
  state.on('app-mode', 'Notes toolbar', (appMode) => {
    const ids = ['#back', '#edit', '#toc']

    ids.forEach((id) =>
      el.querySelector(id).classList.toggle('hidden', appMode !== 'main-panel')
    )
  })

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
}

function listen(el) {
  el.querySelector('#back').addEventListener('click', () => {
    const classes = ['.ta-icon', '.ta-select']
    classes.forEach((c) =>
      el.querySelectorAll(c).forEach((e) => e.classList.add('hidden'))
    )
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
