import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createSpan } from '../../assets/partials/span.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
.md-item .title {
 flex: 1;
  min-width: 0; /* Crucial: tells the span it can shrink to 0px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* … when it runs out */
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-20'
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    addChildren(el, docs)
  })
}

/**
 *
 */
function addChildren(el, docs) {
  el.deleteChildren()

  if (!docs || !docs.length) return

  const cats = state.get('recipe-categories')
  docs.forEach((doc) => {
    const cat = cats.find((cat) => cat.value === doc.category)
    doc.categoryLabel = cat?.label || ''
  })

  let children

  if (state.get('search-action')) {
    children = createSearchList(docs)
  } else {
    children = createRecentList(docs)
  }

  el.addChildren(children)
}

/**
 *
 */
function createSearchList(docs) {
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
      children.push(
        createMainDocumentLink({
          id: doc.id,
          html: createSpan({ html: doc.title }),
          url: `./recipe.html?id=${doc.id}`
        })
      )
    }
  }
  return children
}

/**
 *
 */
function createRecentList(docs) {
  const children = docs.map((doc) => {
    const htmlArr = [createSpan({ html: doc.title })]
    if (doc.categoryLabel)
      htmlArr.push(
        createSpan({
          html: `(${doc.categoryLabel})`,
          className: 'c-gray3 text-right'
        })
      )

    const html = createDiv({
      className: 'flex justify-between w-100',
      html: htmlArr
    })

    return createMainDocumentLink({
      id: doc.id,
      html,
      url: `./recipe.html?id=${doc.id}`
    })
  })
  return children
}
