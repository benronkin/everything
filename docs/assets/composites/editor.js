import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createTextarea } from '../partials/textarea.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.editor-wrapper .viewer {
  background-color: var(--gray0);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.editor-wrapper .viewer * {
  margin: 20px 0;
}
.editor-wrapper .viewer h3:not(:first-child) {
  margin-top: 40px;
}  
.editor-wrapper .viewer hr {
  border: 1px dotted var(--gray1);
  margin: 30px 0;
}  
.editor-wrapper .viewer ul {
  list-style-type: disc;
}
.editor-wrapper .viewer ol,
.editor-wrapper .viewer ul {
  list-style-position: inside;
  padding-left: 0;
}
.editor-wrapper .viewer ol li,
.editor-wrapper .viewer ul li {
  text-indent: -1.2em;
  padding-left: 1.2em;
  margin: 10px 0;
}  
.editor-wrapper .viewer ol li ol,
.editor-wrapper .viewer ul li ul {
  margin: 10px 0;
}

.editor-wrapper .viewer th,
.editor-wrapper .viewer td {
  padding: 5px;
}
.editor-wrapper .viewer td:not(:last-child) {
  padding-right: 20px;
}
.editor-wrapper .viewer .comment {
  margin-left: 30px;
  border-left: 5px solid var(--gray3);
  padding-left: 10px;
}
.editor-wrapper .editor {
  width: 100%;
  padding: 10px;
  background: var(--gray1);
}
.editor-wrapper .editor:focus {
  border-bottom: none !important;
}
#toolbar .icons .fa-pencil.on {
  background: var(--gray2);
}
`

export function createEditor({ className = '' } = {}) {
  injectStyle(css)

  const el = createDiv({ className: 'editor-wrapper' })

  build(el)
  // listen(el)

  for (const c of className.split(' ')) {
    if (c.length) el.classList.add(c)
  }

  hljs.configure({ ignoreUnescapedHTML: true })
  return el
}

function build(el) {
  el.appendChild(createDiv({ className: 'viewer' }))
  el.appendChild(createTextarea({ className: 'editor hidden' }))
}

// function listen(el) {}
