import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { suggestionItem } from './suggestionItem.js'
import { log } from '../../assets/js/logger.js'

export function suggestionsList() {
  const el = createList({
    id: 'suggestions-list',
    className: 'outer-wrapper-teal hidden',
  })

  react(el)

  return el
}

function react(el) {
  state.on('suggestions-list', 'suggestionsList', () => refreshSuggestions(el))

  state.on('shopping-list', 'suggestionsList', () => refreshSuggestions(el))
}

function refreshSuggestions(el) {
  const cartArr = state.get('shopping-list')
  const suggestionsEl = document.getElementById('suggestions-list')

  const suggestIcon = document.getElementById('suggest-icon')
  const addInput = document.querySelector('[name="new-item"]')
  const addValue = addInput.value.trim().toLowerCase()

  let suggestionsArr = state.get('suggestions-list')

  if (!suggestionsArr) {
    suggestionsEl.classList.add('hidden')
    return
  }

  suggestionsArr = suggestionsArr.filter((s) => !cartArr.includes(s))

  if (addValue.length) {
    suggestionsArr = suggestionsArr.filter((s) => s.includes(addValue))
  }

  el.deleteChildren()

  if (!suggestionsArr.length) {
    suggestionsEl.classList.add('hidden')
    return
  }

  suggestionsEl.classList.toggle(
    'hidden',
    !suggestIcon.classList.contains('primary') && !addValue.length
  )

  const children = suggestionsArr.map((item) => suggestionItem({ item }))
  el.addChildren(children)
}
