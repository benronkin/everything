import { injectStyle } from '../../assets/js/ui.js'
import { createListItem } from '../../assets/partials/listItem.js'
import { createSpan } from '../../assets/partials/span.js'
import { state } from '../../assets/js/state.js'

const css = `
.suggestion-item {
  border: 1px solid var(--gray2);
  color: var(--gray4);
}
`

export function suggestionItem({ item }) {
  injectStyle(css)

  const { id, title } = item

  const el = createListItem({
    id,
    className: 'list-item suggestion-item flex w-100',
    html: [createSpan({ className: 'title', html: title.toLowerCase() })]
  })

  listen(el, id, title)

  return el
}

function listen(el, id, title) {
  el.addEventListener('click', () => {
    state.set('item-click:cart-suggestion', {
      id,
      title
    })
  })
}
