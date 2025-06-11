/* global Quill */

import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

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
.ql-toolbar.ql-snow {
  border: none;
  background-color: color-mix(in srgb, var(--gray6) 2%, transparent);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 10px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.08);
}
.ql-container.ql-snow {
  background-color: var(--gray1);
  border: none;
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
}

.ql-picker-label::before {
  position: static !important; /* let flexbox center it */
  margin-left: 6px; /* optional tweak */
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
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

  return quill
}
