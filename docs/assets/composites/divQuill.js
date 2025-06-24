/* global hljs Quill */

import { injectStyle } from '../js/ui.js'
import { log } from '../js/logger.js'

const css = `
.ql-container {
  height: auto !important;
  overflow-y: visible !important;
  font-size: 1rem;

}
.ql-container, 
.ql-toolbar,
.ql-editor {
  word-break: break-word;
  overflow-wrap: anywhere;
} 
#editor {
  border-bottom-left-radius: var(--border-radius) !important;
  border-bottom-right-radius: var(--border-radius) !important;
}
.ql-toolbar.ql-snow {
  border: none;
  background-color: color-mix(in srgb, var(--gray6) 2%, transparent);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 10px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.08);
}
.ql-container.ql-snow {
  background-color: var(--gray1) !important;
  border: none !important;
}
.ql-snow .ql-stroke {
  stroke: var(--gray5);
}
.ql-snow .ql-picker {
  color: var(--gray4);
}
.ql-snow .ql-picker {
  padding-top: 2px;
  margin-top: 0;
}
.ql-picker-label {
  display: inline-flex !important;
  align-items: center !important;
  line-height: normal !important;
  padding-left: 0 !important;
  font-weight: normal !important;
}
.ql-picker-label::before {
  position: static !important; /* let flexbox center it */
  margin-left: 6px; /* optional tweak */
}
.quill-span {
  padding: 0;
  position: relative;
}
.quill-span button {
  padding: 0;  
  margin-bottom: 7px;
}
.ql-editor .ql-ui {
  top: -5px !important;
}
.ql-editor ol,
.ql-editor ul {
  padding-left: 0 !important;
}
.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 3rem !important;
}
.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 4.5rem !important;
}
.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 6rem !important;
  }  
.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 7.5rem !important;
}
.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 9rem !important;
}

@media (min-width: 768px) {
  .quill-span button {
    margin-bottom: 0;
  }
}
`

export function createDivQuill({ div } = {}) {
  injectStyle(css)

  // check Quill documentation for additional buttons
  const toolbarOptions = [
    ['bold', 'italic', 'underline'],
    ['blockquote', 'code-block', 'link'],

    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [
      { header: [1, 2, 3, 4, 5, 6, false] },
      { font: ['poppins', 'times-new-roman', 'arial'] },
    ],

    ['clean'], // remove formatting button
  ]

  const Font = Quill.import('formats/font')
  Font.whitelist = ['poppins', 'times-new-roman', 'arial']
  Quill.register(Font, true)

  const quill = new Quill(div, {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: 'snow',
  })

  addPlainText(quill)

  return quill
}

function addPlainText(quill) {
  // add
  quill.root.addEventListener('keydown', (e) => {
    const isPastePlain = e.metaKey && e.shiftKey && e.key === 'V'

    if (isPastePlain) {
      e.preventDefault()

      navigator.clipboard
        .readText()
        .then((text) => {
          const cursor = quill.getSelection()?.index ?? 0
          quill.insertText(cursor, text, 'user')
        })
        .catch((err) => {
          console.warn('Could not read clipboard:', err)
        })
    }
  })

  // add plain-text button to toolbar
  const toolbar = quill.getModule('toolbar')
  const container = toolbar.container

  const span = document.createElement('span')
  span.className = 'ql-formats quill-span'

  const button = document.createElement('button')
  button.type = 'button'
  button.innerHTML = '📋'
  button.className = 'ql-paste-plain'
  button.title = 'Paste plain-text'

  button.onclick = () => {
    navigator.clipboard.readText().then((text) => {
      const cursor = quill.getSelection()?.index ?? 0
      quill.insertText(cursor, text, 'user')
    })
  }

  container.appendChild(span)
  span.appendChild(button)
}
