import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createSpan } from '../../assets/partials/span.js'
import { createDangerZone } from '../../assets/composites/dangerZone.js'
import { createEntryTitle } from '../journal.utils.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function dangerZone() {
  injectStyle(css)

  const el = createDangerZone({
    modalId: 'modal-delete'
  })

  react(el)

  el.classList.add('mt-20')
  el.querySelector('#danger-zone-header').insertHtml('Delete entry')

  return el
}

function react(el) {
  state.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const id = state.get('active-doc')
    const doc = { ...state.get('main-documents').find((d) => d.id === id) }

    const modalDelete = el.querySelector('#modal-delete')

    modalDelete.config({
      photo: '',
      password: true,
      header: createSpan({ html: 'Delete entry' }),
      body: createEntryTitle(doc)
    })

    modalDelete.dataset.vitest = 'modal-open'
    modalDelete.showModal()
  })
}
