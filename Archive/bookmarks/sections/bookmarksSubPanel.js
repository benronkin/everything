import { injectStyle } from '../../assets/js/ui.js'
import { insertHtml } from '../../assets/js/format.js'
import { createAnchor } from '../../assets/partials/anchor.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createDiv } from '../../assets/partials/div.js'
import { bookmarks } from '../bookmarks.data.js'

const css = `
.bookmarks-section .bookmarks-holder:not(.hidden) {
  margin-top: 10px;
}
.bookmarks-section .span-group:not(:first-child) {
  margin-top: 20px;
}
.bookmarks-section .bookmarks-holder {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.bookmarks-section .bookmark {
  padding: 5px;
  border-radius: var(--border-radius);
}
.bookmarks-section .expander {
  cursor: pointer;
  width: 15px;
}
`

export function bookmarksSubPanel() {
  injectStyle(css)

  const el = createDiv({
    className: 'bookmarks-section',
  })

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react()
  listen(el)

  return el
}

function build(el) {
  for (const section of bookmarks) {
    const groupDiv = createDiv({
      className: 'bookmarks-group outer-wrapper mb-20',
    })
    el.appendChild(groupDiv)

    groupDiv.appendChild(
      createSpanGroup({
        classes: {
          icon: `expander ${
            section.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'
          }`.trim(),
        },
        html: section.header.html,
      })
    )

    groupDiv.appendChild(
      createDiv({
        className: `bookmarks-holder ${
          section?.collapsed ? 'hidden' : ''
        }`.trim(),
        html: section.items.map((item) =>
          createAnchor({
            className: `bookmark c-gray6 ${item.className}`.trim(),
            url: item.url,
            html: item.html,
          })
        ),
      })
    )
  }
}

function react() {}

function listen(el) {
  el.querySelectorAll('.expander').forEach((i) =>
    i.addEventListener('click', () => {
      i.classList.toggle('fa-chevron-down')
      i.classList.toggle('fa-chevron-right')
      i.closest('.bookmarks-group')
        .querySelector('.bookmarks-holder')
        .classList.toggle('hidden', i.classList.contains('fa-chevron-right'))
    })
  )
}
