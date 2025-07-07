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
.editor-wrapper .viewer h1:not(:first-child) {
  margin-top: 30px;
}
.editor-wrapper .viewer h1,
.editor-wrapper .viewer h2,
.editor-wrapper .viewer h3 {
  margin: 20px 0 5px;
}
.editor-wrapper .viewer hr {
  border: 1px dotted var(--gray1);
  margin: 30px 0;
}  
.editor-wrapper .viewer ul {
  list-style-type: disc;
}
.editor-wrapper .viewer li {
  display: list-item;
  list-style-position: outside;
  padding-left: 0;
  text-indent: 0;
}

.editor-wrapper .viewer ul,
.editor-wrapper .viewer ol {
  padding-left: 1.5rem; /* controls bullet indent */
}
.editor-wrapper .viewer ol li ol,
.editor-wrapper .viewer ul li ul {
  margin: 0;
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
.editor-wrapper .viewer .comment,
.editor-wrapper .viewer blockquote {
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
  cursor: auto;
  width: 100%;
  padding: 20px;
  background: var(--gray0);
  border: 1px dotted var(--gray1);
}
.editor-wrapper .editor:focus {
  border: 1px dotted var(--gray1) !important;
}
#toolbar .icons .on {
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

  el.setEditor = function (value) {
    el.querySelector('.editor').value = value
  }

  el.setViewer = function (markup) {
    const html = standardizeViewer(markup)
    el.querySelector('.viewer').insertHtml(html)

    // required for inert scripts to run
    const scripts = el.querySelectorAll('.viewer script')
    for (const script of scripts) {
      try {
        eval(script.textContent)
      } catch (err) {
        console.error('Script execution failed:', err)
      }
    }
  }

  /**
   * Save the selection inside the textarea
   * before it disappears due to icon click
   */
  el.saveSelectedRange = function () {
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
  el.insertBlock = function (block) {
    const selection = state.get('editor-selection')
    if (!selection) {
      console.log(
        'No editor selection was saved prior to this insertBlock. Did you save one???'
      )
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

  return el
}

function build(el) {
  el.appendChild(createDiv({ className: 'viewer' }))
  el.appendChild(createTextarea({ className: 'editor hidden' }))
}

/**
 * Various manipulation of the note
 * before it is injected into the viewer
 * as markup
 */
function standardizeViewer(text) {
  text = escapeHtmlBlocks(text)
  text = trimCodeBlocks(text)
  text = trimCommentBlocks(text)
  return text
}

/**
 * Get the value of the editor and convert
 * HTML blocks inside code.language-html to
 * strings so that the viewer can render them
 */
function escapeHtmlBlocks(text) {
  if (!text) return ''

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

/**
 * Remove leading and trailing empty lines from comment blocks
 */
function trimCommentBlocks(text) {
  const re = /<div class="comment([^"]*)">([\s\S]*?)<\/div>/g

  const replacer = (_, otherClasses, commentContent) => {
    let lines = commentContent.split('\n')
    if (lines[0].trim() === '') lines.shift()
    if (lines[lines.length - 1].trim() === '') lines.pop()

    const trimmed = lines.join('\n')

    return `<div class="comment ${otherClasses}">${trimmed}</div>`
  }

  return text.replace(re, replacer)
}
