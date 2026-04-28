import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createInput } from '../../assets/partials/input.js'
import { state } from '../../assets/js/state.js'

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

export function createLabelsDialog() {
  injectStyle(css)

  const el = document.createElement('dialog')

  build(el)
  listen(el)

  el.id = 'labels-dialog'

  el.customize = customize.bind(el)

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

  let bodyEl = createDiv({
    className: 'dialog-body',
  })
  divEl.appendChild(bodyEl)

  bodyEl.appendChild(
    createSpan({
      id: 'prompt-span',
    }),
  )
  bodyEl.appendChild(
    createInput({
      id: 'label-title',
      name: 'label-title',
    }),
  )

  const btnGroup = createDiv({ className: 'dialog-button-group' })
  divEl.appendChild(btnGroup)

  btnGroup.appendChild(
    createButton({
      id: 'cancel-dialog',
      className: 'inverted transparent',
      html: 'Cancel',
    }),
  )
  btnGroup.appendChild(
    createButton({
      id: 'action-dialog',
      className: 'primary',
    }),
  )

  bodyEl = createDiv({
    className: 'dialog-message smaller',
  })
  divEl.appendChild(bodyEl)
}

function listen(el) {
  el.querySelector('#action-dialog').addEventListener('click', handleAction)

  el.querySelector('#cancel-dialog').addEventListener('click', handleCancel)
}

/**
 *
 */
function customize({ action, id, title }) {
  this.dataset.action = action
  this.dataset.id = id
  this.dataset.title = title
  const headerEl = this.querySelector('.dialog-header')
  const promptEl = this.querySelector('#prompt-span')
  const inputEl = this.querySelector('input')
  const actionBtn = this.querySelector('#action-dialog')

  inputEl.classList.remove('hidden')
  actionBtn.disabled = false

  switch (action) {
    case 'add':
      headerEl.innerHTML = 'Add label'
      promptEl.innerHTML = 'Enter a new label name:'
      actionBtn.innerHTML = 'Create'
      inputEl.value = ''
      inputEl.focus()
      actionBtn.disabled = true
      break
    case 'delete':
      headerEl.innerHTML = 'Remove label'
      promptEl.innerHTML = `Delete the label <strong>"${title}"</strong>?`
      actionBtn.innerHTML = 'Delete'
      inputEl.value = ''
      inputEl.classList.add('hidden')
      break
    case 'update':
      headerEl.innerHTML = 'Add label'
      promptEl.innerHTML = 'Label name:'
      actionBtn.innerHTML = 'Save'
      inputEl.value = title
      inputEl.select()
      inputEl.focus()
      break
    default:
      throw new Error(`Unknown labels dialog action: "${action}"`)
  }

  inputEl.addEventListener('keyup', handleInputKeyUp)
  return this
}

/** */
function handleAction(e) {
  e.stopPropagation()
  const dialog = document.querySelector('#labels-dialog')
  const labelId = dialog.dataset.id
  const action = dialog.dataset.action
  const title = dialog.querySelector('input').value

  state.set('note-label-update', { action, labelId, title })
}

/** */
function handleCancel(e) {
  e.stopPropagation()
  document.querySelector('#dialog').close()
}

/**
 *
 */
function handleInputKeyUp(e) {
  const value = e.target.value.trim()
  document.querySelector('#action-dialog').disabled = value.length === 0

  if (!value.length) return

  if (e.code === 'Enter') {
    document.querySelector('#action-dialog').click()
  }
}
