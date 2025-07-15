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

  el.appendChild(createSpan({ id: 'entry-tip', className: 'ml-5 f-italic' }))
}

function react(el) {
  state.on('lexicon-search', 'newEntry', ({ q, exact, submitterFilter }) => {
    // console.log('q', q)
    // console.log('exact', exact)
    // console.log('submitterFilter', submitterFilter)

    const btn = el.querySelector('#add-entry')
    const tip = el.querySelector('#entry-tip')

    el.classList.toggle('hidden', !q || exact.length)
    btn.classList.toggle('hidden', exact.length)
    tip.classList.toggle('hidden', !exact.length)

    if (!q) return

    if (exact.length) {
      el.querySelector(
        '#no-entry'
      ).textContent = `"${q}" added by ${submitterFilter}`
      tip.textContent = `But ${exact[0].submitterName} did create this entry. Reset filter to view.`
    } else {
      el.querySelector('#no-entry').textContent = `"${q}"`
      btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add "${q}"`
    }
  })
}
