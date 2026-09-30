import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createPill } from '../../assets/partials/pill.js'
import { fetchPeers } from '../../users/users.api.js'

const css = `
.modal {
  background-color: var(--purple0);
  color: var(--gray6);
  padding: 0;
  width: min(90vw, 900px);
  max-width: none;
  margin: auto;
}
.modal .modal-header {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 12px 20px;
  margin: 0;
  background-color: var(--purple1);
  border-bottom: 1px solid var(--purple2);
}
.modal .modal-body {
  display: block;
  padding: 0;
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
.book-card {
  padding: 14px 18px;
  border-bottom: 1px solid var(--purple2);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.book-card:hover {
  background-color: var(--purple1);
}
.book-card:active {
    background-color: var(--purple2);
}
.book-title {
  color: var(--purple6);
  font-size: 1.05rem;
  font-weight: 600;
}
.book-author {
  color: var(--purple5);
  margin-top: 4px;
  font-size: 0.9rem;
}
.book-card:last-child {
  border-bottom: none;
}
.modal-footer {
  border-top: 1px solid var(--purple2);
}
`

export function modalBookCards() {
  injectStyle(css)

  const el = document.createElement('dialog')

  build(el)
  listen(el)

  el.id = 'dialog'
  el.setHeader = setHeader.bind(el)
  el.setBody = setBody.bind(el)

  return el
}

function build(el) {
  const divEl = createDiv({ className: 'modal' })
  el.appendChild(divEl)

  const headerEl = createHeader({
    className: 'modal-header',
    type: 'h3'
  })
  divEl.appendChild(headerEl)

  let spanEl = createSpan({
    className: 'modal-body'
  })
  divEl.appendChild(spanEl)

  const groupEl = createDiv({ className: 'modal-button-group' })
  divEl.appendChild(groupEl)

  const buttonEl = createButton({
    id: 'modal-second-btn',
    html: 'Cancel',
    className: 'bordered'
  })

  groupEl.appendChild(buttonEl)

  spanEl = createSpan({
    className: 'modal-message smaller'
  })
  divEl.appendChild(spanEl)
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

  el.querySelector('#modal-second-btn').addEventListener('click', () =>
    el.close()
  )
}

function setHeader(html) {
  this.querySelector('.modal-header').insertHtml(html)
}
/**
 *
 */
function setBody(bookList) {
  this.querySelector('.modal-body').innerHTML = ''

  bookList.forEach((book) => {
    const card = makeCard(book)
    this.querySelector('.modal-body').appendChild(card)
  })
}

/**
 *
 */
function makeCard(book) {
  console.log('book', book)
  const el = createDiv({ id: book.key, className: 'book-card' })
  el.appendChild(createDiv({ className: 'book-title', html: book.title }))
  el.appendChild(
    createDiv({
      className: 'book-author',
      html: `${book?.author_name?.[0] || '(unspecified)'} · ${book.first_publish_year}`
    })
  )
  el.addEventListener('click', () => {
    state.set('card-click', book)
    document.getElementById('dialog').close()
  })

  return el
}
