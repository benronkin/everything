import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { state } from '../js/state.js'

const css = `
#count-message {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
`

export function counterMessage({ single, plural }) {
  injectStyle(css)

  const el = createDiv({ id: 'count-message' })

  react({ el, single, plural })

  return el
}

function react({ el, single, plural }) {
  state.on('main-documents', 'countMessage', (docs) => {
    const count = !docs || !docs?.length ? 0 : docs.length
    el.innerHTML =
      count === 1 ? `1 ${single} found` : `${count} ${plural} found`
  })
}
