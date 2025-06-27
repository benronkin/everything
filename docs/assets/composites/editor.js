import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createTextarea } from '../partials/textarea.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.editor-wrapper .toolbar {
  border: none;
  background-color: #050005;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 10px;
  display: flex;
  gap: 10px;
}
.editor-wrapper .viewer {
  background-color: var(--gray1);
  padding: 10px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
`

export function createEditor({ className = '' }) {
  injectStyle(css)

  const el = createDiv({ className: 'editor-wrapper' })

  build(el)
  listen(el)

  for (const c of className.split(' ')) {
    el.classList.add(c)
  }

  const editorEl = el.querySelector('.editor')

  hljs.configure({ ignoreUnescapedHTML: true })
  return el
}

function build(el) {
  const toolbarEl = createDiv({ className: 'toolbar' })
  el.appendChild(toolbarEl)
  const icons = ['fa-code']
  for (const icon of icons) {
    toolbarEl.appendChild(createIcon({ classes: { primary: icon } }))
  }

  el.appendChild(createDiv({ className: 'viewer' }))
  el.appendChild(createTextarea({ className: 'editor hidden' }))
}

function listen(el) {
  el.querySelector('.fa-code').addEventListener('click', () => {
    const viewer = el.querySelector('.viewer')
    const editor = el.querySelector('.editor')
    viewer.classList.toggle('hidden')
    editor.classList.toggle('hidden')
    viewer.insertHtml(editor.value)
  })
}
