import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function newEntry() {
  injectStyle(css)

  const el = createDiv({ id: 'new-entry-wrapper', className: 'hidden' })

  build(el)
  react(el)

  return el
}

function build(el) {
  el.appendChild(
    createDiv({
      id: 'no-entry-div',
      className: 'list-header mb-10',
    })
  )

  el.appendChild(createButton({ id: 'add-entry', className: 'primary hidden' }))
}

function react(el) {
  state.on('lexicon-search', 'newEntry', ({ q, exact }) => {
    el.classList.toggle('hidden', !q || exact.length)

    el.querySelector(
      '#no-entry-div'
    ).textContent = `No entry for "${q}". Fetching from the web...`
  })

  state.on('ai-entry', 'newEntry', (newEntry) => {
    const { q } = state.get('lexicon-search')

    el.querySelector(
      '#no-entry-div'
    ).innerHTML = `${newEntry.term} (${newEntry.part_of_speech}): ${newEntry.definition}`

    const addBtn = el.querySelector('#add-entry')

    addBtn.classList.remove('hidden')
    addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add "${q}"`
  })

  state.on('main-documents', 'newEntry', () => el.classList.add('hidden'))
}
