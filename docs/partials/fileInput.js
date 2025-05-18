import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

let listenersBound = false

const css = `
.file-upload {
  position: relative;
  display: inline-block;
}
.file-upload .image-gallery-item img {
  width: inherit;
}
.file-upload input.hidden-file-input {
  display: none;
}
.file-upload label.custom-file {
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.file-upload .file-name {
  margin-left: 1rem;
  font-size: 0.85rem;
}
`

const html = `
<input type="file" name="file" class="hidden-file-input" />
<label class="custom-file primary">
  <i class="fa-solid"></i>
</label>
<span class="file-name"></span>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFileInput(config) {
  injectStyle(css)
  bindEventHandlers()
  const el = createElement(config)
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Bind event handlers once
 */
function bindEventHandlers() {
  if (listenersBound) {
    return
  }
  listenersBound = true
  document.addEventListener('change', (e) => {
    if (!e.target.matches('#photo-file-input')) {
      return
    }
    const span = e.target.closest('.file-upload').querySelector('.file-name')
    span.textContent = e.target.files[0]?.name || ''
  })
}

/**
 * Create the HTML element
 */
function createElement({ id, label, accept, icon }) {
  const el = document.createElement('div')
  el.innerHTML = html
  el.className = 'file-upload'
  const inputEl = el.querySelector('input')
  const labelEl = el.querySelector('label')
  inputEl.setAttribute('id', id)
  inputEl.setAttribute('accept', accept)
  labelEl.appendChild(document.createTextNode(label))
  labelEl.setAttribute('for', id)
  el.querySelector('i').classList.add(icon)

  el.clear = clear.bind(el)
  return el
}

/**
 *
 */
function clear() {
  this.querySelector('input').value = ''
  this.querySelector('.file-name').textContent = ''
}
