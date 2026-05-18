/* global markdownit */

/*
This component combines a textarea and a div for editing and viewing text.
The component expects the markdownit lib to be referenced in the global scope,
via the html page.

You can register the id of an external toggle button that will toggle the 
component mode. This way, you don't have to react to clicks from the consumer.

You don't need to manually update the viewer; it gets updated when the editor is updated 
either automatically or manually.

You can pass a renderer function into the constructor that can manipulate
the viewer's content. For instance, if the lexicon
needs to generate a list of urls for the terms in definition or synonyms.
*/

import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createTextarea } from '../partials/textarea.js'
import { state } from '../js/state.js'

const css = `
blockquote {
  margin: 20px 0;
  padding: 5px;
  border-left: 3px solid var(--gray3);
  background-color: var(--gray2);
  border-radius: 6px;
}
h1, h2, h3, h4, h5, h6 {
  margin: 30px 0 15px;
}
textarea {
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  /* Optional: Ensure scrolling is still enabled */
  overflow-y: scroll; 
}

/* Hide scrollbar for Chrome, Safari and Opera */
textarea::-webkit-scrollbar {
  display: none;
}
.markdown-viewer {
  min-height: 41px;
}
.markdown-viewer a,
.markdown-viewer a:visited {
  color: var(--purple3) !important;
}
.markdown-viewer a:hover {
  color: var(--purple4) !important;
}
.markdown-viewer ol, 
.markdown-viewer ul{
  margin: 0 0 0 20px;
}
.markdown-viewer ul {
  list-style-type: disc;
}
.markdown-viewer p {
  margin: 10px 0;
}
.markdown-editor {
  width: 100%;
}
.markdown-icons {
  display: flex;
  margin-top: 5px;
}
.markdown-viewer h1 {
  font-size: 1.6rem;
  margin: 30px 0 15px;
}
.markdown-viewer h2 {
  font-size: 1.4rem;
  margin: 30px 0 15px;
}
`

/**
 * Create a markdown/html editor/viewer component
 * @param {Object} obj
 * @param {string} obj.name - The textarea field name for server (required)
 * @param {string} obj.id - The id of the textarea editor (optional)
 * @param {Function} object.renderer - Any rendering fn (optional)
 * @param {string} obj.toggleId - The id of the external component that will toggle the component (optional)
 */
export function createMarkdown(obj) {
  injectStyle(css)

  const { renderer = (content) => content } = obj

  const el = document.createElement('div')
  el.className = 'markdown-wrapper'

  el.renderer = renderer
  el.updateEditor = updateEditor.bind(el)
  el.toggle = toggle.bind(el)
  el._updateViewer = _updateViewer.bind(el)
  el.md = markdownit({
    html: true,
    linkify: true,
  })

  build(el, obj)
  react(el, obj)

  return el
}

/**
 *
 */
function build(el, obj) {
  el.appendChild(createDiv({ className: 'markdown-viewer' }))
  el.appendChild(
    createTextarea({
      id: obj.id,
      className: 'markdown-editor field hidden',
      name: obj.name,
    }),
  )
}

/**
 *
 */
function react(el, obj) {
  state.on('field-changed', 'note', () => {
    el._updateViewer()
  })

  if (obj.toggleId) {
    state.on(`icon-click:${obj.toggleId}`, 'markdown', () => {
      el.toggle()
    })
  }
}

/**
 *
 */
function toggle() {
  const scrollPercent =
    window.scrollY / (document.body.scrollHeight - window.innerHeight)

  const targetY =
    (document.body.scrollHeight - window.innerHeight) * scrollPercent

  const viewer = this.querySelector('.markdown-viewer')
  const editor = this.querySelector('.markdown-editor')
  if (viewer.classList.contains('hidden')) {
    viewer.classList.remove('hidden')
    editor.classList.add('hidden')
  } else {
    viewer.classList.add('hidden')
    editor.classList.remove('hidden')
    requestAnimationFrame(() => {
      editor.resize()
      editor.focus()
    })
  }

  // Use requestAnimationFrame to ensure the DOM has updated and layout is recalculated
  requestAnimationFrame(() => {
    window.scrollTo({ top: targetY, behavior: 'auto' })
  })
}

/**
 *
 */
function updateEditor(content) {
  const editor = this.querySelector('.markdown-editor')
  editor.value = content
  requestAnimationFrame(() => {
    editor.resize()
  })
  this._updateViewer()
}

/**
 *
 */
function _updateViewer() {
  const viewer = this.querySelector('.markdown-viewer')

  if (typeof window.markdownit !== 'function') {
    const errorMsg = `
            markDown error: markdown-it library is missing. 
            Ensure <script src="../assets/js/markdown-it.js"></script>
            is included in your HTML before this component.
        `
    console.error(errorMsg)
    viewer.innerHTML = errorMsg
    return
  }

  const markdown = this.querySelector('.markdown-editor').value

  const content = this.md.render(markdown)
  viewer.innerHTML = this.renderer(content)
}
