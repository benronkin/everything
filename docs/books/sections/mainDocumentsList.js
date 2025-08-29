import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import {
  createMainDocumentItem,
  handleMainDocumentClick,
} from '../../assets/partials/mainDocumentItem.js'
import { createIcon } from '../../assets/partials/icon.js'

export function mainDocumentsList() {
  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-20',
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    el.deleteChildren()

    if (!docs?.length) return

    const exact = docs.filter((d) => d.matchType === 'exact')
    const related = docs.filter((d) => d.matchType === 'related')

    const children =
      exact.length || related.length
        ? makeSearchResults(exact, related)
        : makeBrowseResults(docs)

    el.addChildren(children)
  })

  setMessage()
}

function makeSearchResults(exact, related) {
  const children = []

  if (exact.length) {
    children.push(
      createHeader({
        html: 'Entry matches',
        type: 'h5',
        className: 'list-header',
      })
    )
    children.push(...exact.map(createItem))
  }

  if (related.length) {
    children.push(
      createHeader({
        html: 'Related matches',
        type: 'h5',
        className: 'list-header',
      })
    )
    children.push(...related.map(createItem))
  }

  return children
}

function makeBrowseResults(docs) {
  const children = []
  const map = new Map()

  docs.forEach((doc) => {
    if (!map.has(doc.read_year)) map.set(doc.read_year, [])
    map.get(doc.read_year).push(doc)
  })

  for (const [k, v] of map) {
    const completed = v.filter((b) => b.completed === '1').length
    const html = createDiv({
      className: 'flex justify-between align-center',
      html: [creteToggler(k), createSpan({ html: `${k} (${completed})` })],
    })

    html.style.width = '100px'
    html.style.cursor = 'pointer'

    // i.click has stopPropagation hence mouseup
    html.addEventListener('mouseup', (e) => {
      const lis = document.querySelectorAll(`[data-read="${k}"]`)
      lis.forEach((li) => li.classList.toggle('hidden'))

      if (!e.target.closest('i')) html.querySelector('i').click()
    })

    children.push(
      createHeader({
        html,
        type: 'h5',
        className: 'list-header',
      })
    )

    const items = v.map(createItem)
    const date = new Date()
    const thisYear = date.getFullYear()
    for (let i = 0; i < v.length; i++) {
      const item = items[i]
      const doc = v[i]
      item.dataset.read = doc.read_year
      if (thisYear !== doc.read_year) item.classList.add('hidden')
    }

    children.push(...items)
  }

  return children
}

function createItem(doc) {
  const titleObj = { html: doc.title }
  if (doc.completed === '0') {
    titleObj.className = 'c-gray3'
  }

  const html = createDiv({
    className: 'flex justify-between w-100',
    html: [
      createSpan(titleObj),
      createSpan({ html: doc.author, className: 'c-gray3' }),
    ],
  })

  const li = createMainDocumentItem({ id: doc.id, html })
  li.removeEventListener('click', handleMainDocumentClick)
  li.addEventListener('click', () => {
    state.set('window.scrollY', window.scrollY)

    // console.log(
    //   'setting',
    //   window.scrollY / (document.body.scrollHeight - window.innerHeight)
    // )
    state.set('active-doc', doc.id)
    state.set('app-mode', 'main-panel')
  })
  return li
}

function creteToggler(k) {
  const date = new Date()
  const thisYear = date.getFullYear()

  k = parseInt(k)

  const primary = k === thisYear ? 'fa-chevron-down' : 'fa-chevron-right'
  const secondary = k !== thisYear ? 'fa-chevron-down' : 'fa-chevron-right'

  const el = createIcon({ classes: { primary, secondary } })

  return el
}
