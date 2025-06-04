/* global Quill */

import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.ql-container.ql-snow {
  border: none;
  background-color: var(--gray1); /* dark background */
}

.ql-toolbar.ql-snow {
  background-color: var(--gray2);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
}

.ql-snow .ql-picker {
  color: var(--gray5);
}

.ql-snow .ql-picker-label,
.ql-snow .ql-picker-item {
  color: var(--gray5);
}

.ql-snow .ql-stroke {
  stroke: var(--gray6); /* brighter stroke for icons */
}

.ql-snow .ql-fill {
  fill: var(--gray6); /* fill for icons like link or bold */
}

.ql-snow .ql-picker-options {
  background-color: var(--gray2);
  border: 1px solid var(--gray4);
}
  

/* Set droplist names - -item is the currently selected font, -label is the font's appearance in the droplist*/

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='poppins']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='poppins']::before {
  content: 'Poppins';
  font-family: 'Poppins';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='times-new-roman']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='times-new-roman']::before {
  content: 'Times';
  font-family: 'Times New Roman';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='arial']::before {
  content: 'Arial';
  font-family: 'Arial';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='']::before {
  content: 'Default';
}

/* Set the font-family content used for the HTML content */

.ql-font-poppins {
  font-family: 'Poppins', sans-serif !important;
}
.ql-font-arial {
  font-family: 'Arial';
}
.ql-font-times-new-roman {
  font-family: 'Times New Roman';
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createDivQuill({ div, events = {} } = {}) {
  injectStyle(css)

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: ['poppins', 'times-new-roman', 'arial'] }],
    [{ align: [] }],

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

  Object.defineProperties(quill, {
    value: {
      get() {
        return quill.root.innerHTML
      },
    },
  })

  for (const [k, v] of Object.entries(events)) {
    quill.on(k, v)
  }

  return quill
}
