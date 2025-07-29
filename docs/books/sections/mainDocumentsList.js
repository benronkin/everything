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
    children.push(
      ...exact.map((doc) => createItem(doc, `${doc.title} by ${doc.author}`))
    )
  }

  if (related.length) {
    children.push(
      createHeader({
        html: 'Related matches',
        type: 'h5',
        className: 'list-header',
      })
    )
    children.push(
      ...related.map((doc) => createItem(doc, `${doc.title} by ${doc.author}`))
    )
  }

  return children
}

function makeBrowseResults(docs) {
  const children = []
  const map = new Map()

  docs.forEach((doc) => {
    if (!map.has(doc.read_year)) map.set(doc.read_year, [])
    map
      .get(doc.read_year)
      .push({ id: doc.id, html: `${doc.title} by ${doc.author}` })
  })

  for (const [k, v] of map) {
    children.push(
      createHeader({
        html: `${k} (${v.length})`,
        type: 'h5',
        className: 'list-header',
      })
    )
    children.push(...v.map(({ id, html }) => createItem({ id }, html)))
  }

  return children
}

function createItem(doc, h) {
  const html = createDiv({
    className: 'flex justify-between w-100',
    html: [createSpan({ html: h })],
  })
  const li = createMainDocumentItem({ id: doc.id, html })
  li.removeEventListener('click', handleMainDocumentClick)
  li.addEventListener('click', () => {
    state.set('active-doc', doc.id)
    state.set('app-mode', 'main-panel')
  })
  return li
}
