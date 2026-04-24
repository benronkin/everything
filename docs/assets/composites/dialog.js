import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'

const css = `
dialog {
outline: none;
  padding: 0;
  max-width: 400px;
  background: var(--gray6);
  color: var(--gray0);
}
dialog:focus {
  outline: none;
}
dialog input {
  color: var(--gray0);
  margin-top: 10px;
}
dialog .dialog-header {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 20px;
  margin: 0;
}
dialog .dialog-body {
  display: block;
  padding: 0 20px 30px;
  margin: 0;
  display: flex;
  flex-direction: column;
}

dialog .dialog-button-group {
  display:flex; 
  justify-content:flex-end;
  align-items: center;
  gap:20px; 
  padding: 12px 20px;
  margin: 0;
}
/* Ensure no backdrop */
dialog::backdrop {
  background: transparent;
}
`

export function createDialog() {
  injectStyle(css)

  const el = document.createElement('dialog')

  build(el)

  el.id = 'dialog'

  return el
}

function build(el) {
  const divEl = createDiv({ className: 'dialog' })
  el.appendChild(divEl)

  const headerEl = createHeader({
    className: 'dialog-header',
    type: 'h3',
  })
  divEl.appendChild(headerEl)

  let spanEl = createDiv({
    className: 'dialog-body',
  })
  divEl.appendChild(spanEl)

  const groupEl = createDiv({ className: 'dialog-button-group' })
  divEl.appendChild(groupEl)

  spanEl = createDiv({
    className: 'dialog-message smaller',
  })
  divEl.appendChild(spanEl)
}
