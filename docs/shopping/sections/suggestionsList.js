import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { suggestionItem } from './suggestionItem.js'

export function suggestionsList() {
  const el = createList({
    id: 'suggestions-list',
    className: 'outer-wrapper-teal hidden'
  })

  react(el)

  return el
}

/**
 *
 */
function react(el) {
  state.on('app-mode', 'suggestionsList', (mode) => {
    if (mode !== 'left-panel') return

    document
      .querySelector('textarea[name="new-item"]')
      .addEventListener('input', (e) => {
        refreshSuggestions(el, e.target.value)
      })
  })

  state.on('main-documents', 'suggestionsList', () => {
    el.deleteChildren()
    el.classList.add('hidden')
  })
}

/**
 *
 */
function refreshSuggestions(el, query) {
  const view = document.getElementById('view-select').getSelected().value
  const textArea = document.querySelector('[name="new-item"]')
  const value = textArea.value.trim().toLowerCase()

  if (!value) {
    el.deleteChildren()
    el.classList.add('hidden')
    return
  }
  if (view === 'all') return

  query = query.trim().toLowerCase()
  if (!query) {
    el.classList.add('hidden')
    return
  }

  const docs = state.get('main-documents').filter((d) => {
    if (view === 'cart') {
      return !d.carted && d.title.includes(query)
    }
    if (view === 'recurring') {
      return !d.recurring && d.title.includes(query)
    }
  })

  if (!docs.length) return

  el.deleteChildren()

  const children = docs.map((item) => suggestionItem({ item }))
  el.addChildren(children)
  el.classList.remove('hidden')
}
