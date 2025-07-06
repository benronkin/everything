import { injectStyle } from '../../assets/js/ui.js'
import { createIcon } from '../../assets/partials/icon.js'
import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'

const css = `
`

export function createDocLinkIcon({ id = 'doc-link', classes = {} } = {}) {
  injectStyle(css)

  const el = createIcon({ classes, id })

  react(el)

  el.id = id

  return el
}

function react(el) {
  state.on(`icon-click:${el.id}`, 'docLinkIcon', () => {
    const id = state.get('active-doc')
    if (!id) return

    const url = `${window.location.origin}${window.location.pathname}?id=${id}`
    navigator.clipboard.writeText(url)
    setMessage({ message: `URL copied` })
  })
}
