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
    docs.forEach((entry) => {
      entry.parts = entry.senses
        .reduce((acc, s) => {
          acc.push(s.partOfSpeech || 'missing')
          return acc
        }, [])
        .join(', ')
    })

    const recentView = docs.filter((d) => d.matchType === 'recent-view')
    const recentWotd = docs.filter((d) => d.matchType === 'recent-wotd')
    const exact = docs.filter((d) => d.matchType === 'exact')
    const related = docs.filter((d) => d.matchType === 'related')

    const children = []

    if (recentView.length) {
      children.push(
        createHeader({
          html: 'Recently viewed',
          type: 'h5',
          className: 'list-header',
        })
      )
      children.push(...recentView.map(createItem))
    }

    if (recentWotd.length) {
      children.push(
        createHeader({
          html: 'Recent Word of the Day',
          type: 'h5',
          className: 'list-header',
        })
      )
      children.push(...recentWotd.map(createItem))
    }

    if (exact.length) {
      children.push(
        createHeader({
          html: 'Title matches',
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

    el.deleteChildren().addChildren(children)
  })

  setMessage()
}

function createItem(doc) {
  const html = createDiv({
    className: 'flex justify-between w-100',
    html: [
      createSpan({ html: doc.title }),
      createSpan({ html: `(${doc.parts})`, className: 'c-gray3' }),
    ],
  })
  const li = createMainDocumentItem({ id: doc.id, html })
  li.title = doc.senses[0]?.definition || ''
  li.removeEventListener('click', handleMainDocumentClick)
  li.addEventListener('click', () => {
    state.set('active-doc', doc.title)
    state.set('app-mode', 'main-panel')
  })
  return li
}
