import { injectStyle } from '../../js/ui.js'
import { createDiv } from '../../partials/div.js'
import { createIcon } from '../../partials/icon.js'
import { createPopup } from '../../partials/popup.js'
import { listen } from './handlers.js'
import { state } from '../../js/state.js'
import { log } from '../../js/logger.js'

const css = `
.rich-text-editor .rte-toolbar {
  border: none;
  background-color: #050005;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 10px;
  display: flex;
  gap: 10px;
}
.rich-text-editor .rte-editor {
  background-color: var(--gray1);
  padding: 10px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.rich-text-editor .rte-editor:focus {
  outline: none;
}
.rich-text-editor .rte-editor div[data-indent], 
.rich-text-editor .rte-editor li[data-indent]{
  padding-left: calc(var(--indent, 0) * 2ch);
}
.rich-text-editor .rte-editor ol, 
.rich-text-editor .rte-editor ul {
  margin-left: 10px;
}
.rich-text-editor .rte-editor ul {
  list-style-type: disc;
}
.rich-text-editor .rte-editor li[data-indent] {
  list-style-position: outside;
  margin-left: calc(var(--indent, 0) * 2ch);
  padding-left: 0;
}
.rich-text-editor pre {
  background: #121212;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 10px 0;
}
.rich-text-editor code {
  display: block;
  white-space: pre;
  min-height: 22.4px;
}
`

export function createRichTextEditor({
  className = '',
  html = '<div><br></div>',
}) {
  injectStyle(css)

  const el = createDiv({ className: 'rich-text-editor' })

  build(el)
  listen(el)

  for (const c of className.split(' ')) {
    el.classList.add(c)
  }

  const editorEl = el.querySelector('.rte-editor')
  editorEl.contentEditable = true
  editorEl.insertHtml(html)
  return el
}

function build(el) {
  const toolbarEl = createDiv({ className: 'rte-toolbar' })
  el.appendChild(toolbarEl)
  const icons = ['fa-list-ul', 'fa-list-ol', 'fa-heading', 'fa-code']
  for (const icon of icons) {
    toolbarEl.appendChild(createIcon({ classes: { primary: icon } }))
  }

  el.appendChild(createDiv({ className: 'rte-editor' }))
  el.appendChild(createPopup())
}
