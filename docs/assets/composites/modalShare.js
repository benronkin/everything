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
.modal {
  padding: 0;
  max-width: 400px;
}
.modal .input-group {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
}  
.modal .input-group i {
  padding: 8px 0;  
  color: var(--gray6);
}
.modal .modal-header {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 12px 20px;
  margin: 0;
}
.modal .modal-body {
  display: block;
  padding: 30px 20px;
  margin: 0;
}
.modal .modal-button-group {
  display:flex; 
  justify-content:flex-start;
  align-items: center;
  gap:20px; 
  padding: 12px 20px;
  margin: 0;
}
`

export function createModalshare() {
  injectStyle(css)

  const el = document.createElement('dialog')

  build(el)
  react(el)
  listen(el)

  el.id = 'modal-share'
  el.setHeader = setHeader.bind(el)

  return el
}

function build(el) {
  const divEl = createDiv({ className: 'modal' })
  el.appendChild(divEl)

  const headerEl = createHeader({
    className: 'modal-header',
    type: 'h3',
  })
  divEl.appendChild(headerEl)

  let spanEl = createSpan({
    className: 'modal-body',
  })
  divEl.appendChild(spanEl)

  const groupEl = createDiv({ className: 'modal-button-group' })
  divEl.appendChild(groupEl)

  let buttonEl = createButton({
    id: 'modal-first-btn',
    html: 'save',
    className: 'primary',
  })

  groupEl.appendChild(buttonEl)

  buttonEl = createButton({
    id: 'modal-second-btn',
    html: 'Cancel',
    className: 'bordered',
  })

  groupEl.appendChild(buttonEl)

  spanEl = createSpan({
    className: 'modal-message smaller',
  })
  divEl.appendChild(spanEl)
}

export function react(el) {
  state.on('active-doc', 'modalShare', async (doc) => {
    if (!doc) return

    const { peers } = await fetchPeers()
    peers.sort()
    const bodyEl = el.querySelector('.modal-body')
    bodyEl.innerHTML = ''
    for (const peer of peers) {
      bodyEl.appendChild(
        createPill({
          classes: { pill: 'mr-10', icon: 'fa-check' },
          html: peer.first_name,
          isSelected: doc.peers.find((dp) => dp.id === peer.id),
        })
      )
    }
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
  this.querySelector('.modal-header').insertHtml(html)
}
