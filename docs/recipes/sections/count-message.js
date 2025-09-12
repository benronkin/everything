import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'

const css = `
#count-message {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
`

export function countMessage() {
  injectStyle(css)

  const el = createDiv({ id: 'count-message' })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'countMessage', (recipes) => {
    const count = !recipes || !recipes?.length ? 0 : recipes.length
    el.innerHTML = count === 1 ? '1 recipe found' : `${count} recipes found`
  })
}
