import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpan } from '../../assets/partials/span.js'
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
  const leftSpan = createSpan({
    html: 'No entry for',
    className: 'list-header',
  })
  const rightSpan = createSpan({ id: 'no-entry', className: 'list-header' })

  el.appendChild(
    createDiv({
      html: [leftSpan, rightSpan],
      className: 'mb-10',
    })
  )

  el.appendChild(createButton({ id: 'add-entry', className: 'primary' }))
}

function react(el) {
  state.on('lexicon-search', 'newEntry', ({ q, exactExists }) => {
    if (!q) return

    el.querySelector('#no-entry').textContent = `"${q}"`

    el.querySelector(
      '#add-entry'
    ).innerHTML = `<i class="fa-solid fa-plus"></i> Add "${q}"`

    el.classList.toggle('hidden', exactExists)
  })
}
