import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDangerZone } from '../../assets/composites/dangerZone.js'

const css = `
`

export function dangerZone() {
  injectStyle(css)

  const el = createDangerZone({
    modalId: 'modal-delete',
    password: false,
  })

  react(el)

  el.classList.add('mt-40')
  el.querySelector('#danger-zone-header').insertHtml('Delete entry')

  return el
}

function react(el) {
  state.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const title = state.get('active-doc')
    state.set('modal-delete-payload', { title })

    const modal = document.querySelector('#modal-delete')
    modal.querySelector('.modal-header').insertHtml('Delete entry:')
    modal.querySelector('.modal-body').insertHtml(title)
    modal.dataset.vitest = 'modal-open'
    modal.showModal()
  })
}
