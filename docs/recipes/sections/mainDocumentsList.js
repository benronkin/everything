import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpan } from '../../assets/partials/span.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'
import { injectStyle } from '../../assets/js/ui.js'

const css = `
.category {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0;
}
`

export function mainDocumentsList() {
  injectStyle(css)

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

    if (!docs) return

    const cats = state.get('recipe-categories')
    docs.forEach((doc) => {
      const cat = cats.find((cat) => cat.value === doc.category)
      doc.categoryLabel = cat?.label || ''
    })

    if (state.get('search-action')) {
      createSearchList(el, docs)
    } else {
      createRecentList(el, docs)
    }

    setMessage()
  })
}

function createSearchList(el, docs) {
  const map = {}

  for (const doc of docs) {
    doc.categoryLabel = doc.categoryLabel || '(uncategorized)'

    if (!map[doc.categoryLabel]) map[doc.categoryLabel] = []
    map[doc.categoryLabel].push(doc)
  }

  const children = []

  for (const [cat, docs] of Object.entries(map)) {
    children.push(createDiv({ html: cat, className: 'category' }))
    for (const doc of docs) {
      children.push(createMainDocumentItem({ id: doc.id, html: doc.title }))
    }
  }
  el.addChildren(children)
}

function createRecentList(el, docs) {
  const children = docs.map((doc) => {
    const htmlArr = [createSpan({ html: doc.title })]
    if (doc.categoryLabel)
      htmlArr.push(
        createSpan({ html: `(${doc.categoryLabel})`, className: 'c-gray3' })
      )

    const html = createDiv({
      className: 'flex justify-between w-100',
      html: htmlArr,
    })

    return createMainDocumentItem({ id: doc.id, html })
  })
  el.addChildren(children)
}
