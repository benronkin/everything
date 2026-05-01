import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { search } from '../../assets/composites/search.js'
import { mainDocumentsList } from './mainDocumentsList.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function leftPanel() {
  injectStyle(css)

  const el = createDiv({ id: 'left-panel' })

  build(el)
  react(el)

  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search notes...',
      name: 'search-note',
    }),
  )

  el.appendChild(mainDocumentsList())
}

function react(el) {
  state.on('main-documents', 'leftPanel', (docs) => {
    const message =
      docs?.length === 1 ? 'One note found' : `${docs.length} notes found`
    el.querySelector('.form-message').insertHtml(message)
  })

  state.on('view-by-label', 'mainDocumentsList', (labelId) => {
    const labelAssignments = state
      .get('note-label-assignments')
      .filter((arr) => arr[0] === labelId)
    let docs = state.get('main-documents')

    if (labelId)
      docs = docs.filter((doc) => labelAssignments.find((a) => a[1] === doc.id))

    const message =
      docs?.length === 1 ? 'One note found' : `${docs.length} notes found`
    el.querySelector('.form-message').insertHtml(message)
  })
}
