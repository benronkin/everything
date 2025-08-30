import { injectStyle } from '../../assets/js/ui.js'
import { createAnchor } from '../../assets/partials/anchor.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { fetchLatestWotd } from '../../lexicon/lexicon.api.js'

const css = `
`

export async function wotd() {
  injectStyle(css)

  const { entry } = await fetchLatestWotd()

  const el = createDiv({ className: 'wotd-wrapper' })

  build(el, entry)

  return el
}

function build(el, wotd) {
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

  const body1 = createDiv({
    html: [
      createAnchor({
        url: `../lexicon/index.html?title=${wotd.title}`,
        html: `${wotd.title}`,
      }),
      createSpan({ html: ` (${wotd.part_of_speech})` }),
    ],
  })
  const year = new Date(wotd.created_at).getFullYear()

  const body2 = createDiv({
    className: 'mt-10',
    html: [createSpan({ html: wotd.definition })],
  })

  const body3 = createDiv({
    className: 'flex align-center',
    html: [
      createSpan({ html: wotd.example, className: 'c-teal3 italic' }),
      createSpan({ html: `(${wotd.first_name}, ${year})` }),
    ],
  })

  const body = createDiv({
    className: 'outer-wrapper mt-20',
    html: [body1, body2, body3],
  })
  el.appendChild(body)
}
