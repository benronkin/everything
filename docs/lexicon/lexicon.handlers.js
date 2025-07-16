import { setMessage } from '../assets/js/ui.js'
import { state } from '../assets/js/state.js'
import {
  searchEntries,
  deleteEntry,
  deleteSense,
  updateEntry,
  updateEntries,
} from './lexicon.api.js'

export async function handleSearch() {
  const search = document.querySelector('[name="search-lexicon"]')

  const q = search.value.trim().toLowerCase()

  if (!q) {
    state.set('main-documents', null)
    return
  }

  let { entries, message } = await searchEntries(q)

  if (message) {
    setMessage({ message: `Lexicon server error: ${message}` })
    return
  }

  entries.forEach((e) => {
    e.senses = JSON.parse(e.senses)
  })

  state.set('app-mode', 'left-panel')
  state.set('main-documents', entries)
  state.set('lexicon-search', {
    q,
    exact: entries.filter((e) => e.title === q),
  })
}

export async function handleFieldChange(e) {
  const title = state.get('active-doc')
  const elem = e.target
  const id = elem.closest('.lexicon-sense').id
  const sec = elem.name
  const value = elem.value

  // 1. update main-documents
  const docs = state.get('main-documents')
  const idx1 = docs.findIndex((d) => d.title === title)
  const doc = docs[idx1]
  const section = sec === 'pos' ? 'partOfSpeech' : elem.name
  const sense = doc.senses.find((s) => s.id === id)
  sense[section] = value

  state.set('main-documents', docs)

  // 2. update server
  try {
    const section = sec === 'pos' ? 'part_of_speech' : elem.name
    const { error } = await updateEntry({ id, section, value })
    if (error) {
      throw new Error(error)
    }
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }
}

export async function handleNameChange(e) {
  const elem = e.target
  const newTitle = elem.value.trim().toLowerCase()
  const oldTitle = state.get('active-doc')

  if (newTitle === oldTitle || !newTitle) return

  // 1. update main-documents
  const docs = state.get('main-documents')
  const idx1 = docs.findIndex((d) => d.title === oldTitle)
  const doc = docs[idx1]
  doc.title = newTitle
  state.set('main-documents', docs)

  // 2. update server
  try {
    const { error } = await updateEntries({ oldTitle, newTitle })
    if (error) {
      throw new Error(error)
    }
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }
}

export async function handleEntryDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const title = state.get('active-doc')
  const { error } = await deleteEntry(title)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.title !== title)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

export async function handleSenseDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const { id } = state.get('modal-delete-payload')
  const { error } = await deleteSense(id)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.close()

  const title = state.get('active-doc')
  const docs = state.get('main-documents')
  const doc = docs.find((d) => d.title === title)
  doc.senses = doc.senses.filter((s) => s.id !== id)

  state.set('main-documents', docs)
  state.set('active-doc', title) // reactivate mainPanel
}
