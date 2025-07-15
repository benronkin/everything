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

  const selected = document.getElementById('submitter-select').getSelected()
  const value = selected.value
  const submitterFilter = selected.textContent
  const filtered = entries.filter((e) => !value || e.submitter === value)

  state.set('main-documents', filtered)
  state.set('lexicon-search', {
    q,
    filteredExists: entries.filter(
      (e) => e.entry === q && (!value || e.submitter === value)
    ).length,
    exact: entries.filter((e) => e.submitter !== value),
    submitterFilter,
  })
}
