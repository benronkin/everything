import { state } from '../js/state.js'
import { injectStyle } from '../js/ui.js'
import { createButton } from '../partials/button.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'
import { createInput } from '../partials/input.js'
import { createSpan } from '../partials/span.js'
import { createPill } from '../partials/pill.js'
import { fetchPeers } from '../../users/users.api.js'
import { log } from '../js/logger.js'

const css = `
  dialog {
    padding: 20px 30px;
    max-width: 400px;
    width: 90%;
    margin: auto;
  }
  #modal-share .input-group {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
}  
#modal-share .input-group i {
  padding: 8px 0;  
  color: var(--gray6);
}
  #modal-share-header {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  }
  #modal-share-body {
    margin-bottom: 20px;
  }
  #modal-share-group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin: 40px 0 20px;
  }
  #modal-share-input {
    width: 100%;
    padding: 8px 10px;
  }
`

export function createModalshare({ id } = {}) {
  injectStyle(css)

  const el = document.createElement('dialog')

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)

  el.setHeader = setHeader.bind(el)

  return el
}

function build(el) {
  const headerEl = createHeader({
    id: 'modal-share-header',
    type: 'h3',
  })
  el.appendChild(headerEl)

  let spanEl = createSpan({
    id: 'modal-share-body',
  })
  el.appendChild(spanEl)

  let divEl = createDiv({ id: 'modal-share-group' })
  el.appendChild(divEl)

  let buttonEl = createButton({
    id: 'modal-share-btn',
    html: 'save',
    className: 'primary',
  })

  divEl.appendChild(buttonEl)

  buttonEl = createButton({
    id: 'modal-cancel-btn',
    html: 'Cancel',
    className: 'bordered',
  })

  divEl.appendChild(buttonEl)

  spanEl = createSpan({
    id: 'modal-share-message',
    className: 'smaller',
  })
  divEl.appendChild(spanEl)
}

export function react(el) {
  state.on('active-doc', 'modalShare', async (doc) => {
    if (!doc) return

    const peers = await fetchPeers()
  })
}

function listen(el) {
  el.addEventListener('click', (e) => {
    const dialogDimensions = el.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      el.close()
    }
  })
}

function setHeader(html) {
  this.querySelector('#modal-share-header').insertHtml(html)
}
