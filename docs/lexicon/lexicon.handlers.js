import { setMessage } from '../assets/js/ui.js'
import { state } from '../assets/js/state.js'
import { fetchRecentEntries, searchEntries } from './lexicon.api.js'

export async function fetchOrSearch() {
  const q = document
    .querySelector('[name="search-lexicon"]')
    .value.trim()
    .toLowerCase()

  const { entries, message } = q
    ? await searchEntries(q)
    : await fetchRecentEntries()

  if (message) {
    setMessage({ message: `Lexicon server error: ${message}` })
    return
  }

  const exactExists = entries.some(
    (e) => e.matchType === 'exact' && e.entry.trim().toLowerCase() === q
  )

  state.set('main-documents', entries)
  state.set('lexicon-search', { q, exactExists })
}
