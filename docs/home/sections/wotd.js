import { injectStyle } from '../../assets/js/ui.js'
import { createAnchor } from '../../assets/partials/anchor.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function wotd() {
  injectStyle(css)

  const el = createDiv({ className: 'wotd-wrapper' })

  react(el)

  return el
}

function react(el) {
  state.on('wotd', 'wotd', (wotd) => {
    const div = createDiv({
      className: 'flex align-center mt-30',
      id: 'wotd-header',
    })

    if (!wotd) {
      div.appendChild(createHeader({ type: 'h4', html: 'WOTD not found' }))
      el.appendChild(div)
      return
    }

    const date = new Date(wotd.random)

    div.appendChild(
      createHeader({
        type: 'h4',
        className: 'flex align-center',
        html: `WOTD for ${date.getMonth() + 1}/${date.getDate()}`,
      })
    )
    el.appendChild(div)

    const year =
      "'" + new Date(wotd.created_at).getFullYear().toString().slice(2)

    const body1 = createDiv({
      className: 'flex align-center',
      html: [
        createDiv({
          html: [
            createAnchor({
              url: `../lexicon/index.html?title=${wotd.title}`,
              html: `${wotd.title}`,
            }),
            createSpan({ html: ` (${wotd.part_of_speech})` }),
          ],
        }),
        createSpan({ html: `(${wotd.first_name}, ${year})` }),
      ],
    })

    const body2 = createDiv({
      className: 'mt-10',
      html: [createSpan({ html: wotd.definition })],
    })

    const body3 = createDiv({
      className: 'flex align-center',
      html: [createSpan({ html: wotd.example, className: 'c-teal3 italic' })],
    })

    const body = createDiv({
      className: 'outer-wrapper mt-20',
      html: [body1, body2, body3],
    })
    el.appendChild(body)
  })
}
