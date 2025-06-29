import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createTextarea } from '../partials/textarea.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `

.editor-wrapper .viewer {
  background-color: var(--gray0);
  display: flex;
  gap: 1rem;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 100%;
}
.editor-wrapper .viewer h3:not(:first-child) {
  margin-top: 40px;
}  
.editor-wrapper .viewer :is(div, h1, h2. h3, h4, h5, h6) {
  white-space: pre-wrap;
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
.editor-wrapper .viewer  li {
  padding-left: 0.5rem;
}  
.editor-wrapper .viewer ol li ol,
.editor-wrapper .viewer ul li ul {
  margin: 10px 0;
}
.editor-wrapper .viewer code {
  font-family: monospace;
  background: #1a1a1a;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 100%;
}
.editor-wrapper .viewer pre {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 4px;
  }
  
.editor-wrapper .viewer pre code {
  display: block;
  padding: 0;
  background: transparent;
  overflow-y: hidden;
}

.editor-wrapper .viewer table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.editor-wrapper .viewer th,
.editor-wrapper .viewer td {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray2);
  text-align: left;
}
.editor-wrapper .viewer .comment {
  margin-left: 30px;
  border-left: 5px solid var(--gray3);
  padding: 10px;
  background: #222222;
}
.editor-wrapper .viewer .comment * {
  margin: 0;
  color: var(--gray4);
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
 #toc-list {
  position: fixed;
  top: var(--nav-height);
  right: 0;
  height: calc(100% - var(--nav-height));
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
