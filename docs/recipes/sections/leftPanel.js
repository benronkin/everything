import { injectStyle, setMessage } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'
import { createSpan } from '../../assets/partials/span.js'
import { search } from '../../assets/composites/search.js'
import { counterMessage } from '../../assets/composites/counterMessage.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#left-panel {
  width: 100%;
}
.category {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0;
}
`

export function leftPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)

  el.id = 'left-panel'
  el.dataset.id = 'left-panel'

  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search recipes...',
      name: 'search-recipe',
    }),
  )

  el.appendChild(counterMessage({ single: 'recipe', plural: 'recipes' }))

  el.appendChild(
    createMainDocumentsList({
      id: 'left-panel-list',
      className: 'mt-20',
    }),
  )
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode === 'left-panel') {
      el.classList.remove('hidden')
    } else {
      el.classList.add('hidden')
      const docListEl = el.querySelector('#left-panel-list')
      docListEl.classList.remove('hidden')
      const currentId = state.get('active-doc')
      if (!currentId) {
        docListEl.reset()
      }

      const docs = state.get('main-documents')
      const docExists = docs.findIndex((el) => el.id === currentId)
      if (!docExists) {
        state.set('active-doc', null)
        return
      }
    }
  })

  state.on('main-documents', 'mainDocumentsList', (docs) => {
    const docListEl = el.querySelector('#left-panel-list')
    docListEl.deleteChildren()

    if (!docs) return

    const cats = state.get('recipe-categories')
    docs.forEach((doc) => {
      const cat = cats.find((cat) => cat.value === doc.category)
      doc.categoryLabel = cat?.label || ''
    })

    if (state.get('search-action')) {
      createSearchList(docListEl, docs)
    } else {
      createRecentList(docListEl, docs)
    }

    setMessage()
  })
}

// ------------------------------------------
// Helpers
// ------------------------------------------

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
        createSpan({ html: `(${doc.categoryLabel})`, className: 'c-gray3' }),
      )

    const html = createDiv({
      className: 'flex justify-between w-100',
      html: htmlArr,
    })

    return createMainDocumentItem({ id: doc.id, html })
  })
  el.addChildren(children)
}
