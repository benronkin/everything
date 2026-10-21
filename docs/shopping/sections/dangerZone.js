import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDangerZone } from '../../assets/composites/dangerZone.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function dangerZone() {
  injectStyle(css)

  const el = createDangerZone({ password: false })

  react(el)

  el.classList.add('mt-40')
  el.querySelector('#danger-zone-header').insertHtml('Delete item')

  return el
}

function react(el) {
  state.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const id = state.get('active-doc')
    const doc = { ...state.get('main-documents').find((d) => d.id === id) }

    const modal = document.getElementById('modal-delete')
    modal.setHeader(`Delete ${doc.title}`)
    modal.setBody('Permanently remove this item from the app?')
    modal.showModal()
    state.set('permanent-delete', id)
  })
}
