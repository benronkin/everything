import { injectStyle } from '../../assets/js/ui.js'
import { createAnchor } from '../../assets/partials/anchor.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { fetchNote } from '../../notes/notes.api.js'
import { state } from '../../assets/js/state.js'

const css = `
#home-bookmarks {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  margin-top: 30px;
}
#home-bookmarks .bookmarks-holder:not(.hidden) {
  margin-top: 10px;
}
#home-bookmarks .span-group:not(:first-child) {
  margin-top: 20px;
}
#home-bookmarks .bookmarks-holder {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
#home-bookmarks .bookmark {
  padding: 5px;
  border-radius: var(--border-radius);
  color: var(--gray6);
}
#home-bookmarks .expander {
  cursor: pointer;
  width: 15px;
}
`

export function bookmarks() {
  injectStyle(css)

  const el = createDiv({ id: 'home-bookmarks', html: 'Fetching bookmarks...' })

  react(el)

  return el
}

function react(el) {
  state.on('user', 'bookmarks', async ({ bookmarks }) => {
    if (!bookmarks) {
      el.insertHtml(
        'Create a note with bookmark data and set its id in Settings/Profile/Bookmarks'
      )
      return
    }

    let { note: noteDoc, error } = await fetchNote(bookmarks)
    if (error) {
      el.insertHtml(
        'The note ID you set in Settings/Profile/Bookmarks is invalid.'
      )
      return
    }

    if (!noteDoc.note?.trim().length) {
      el.insertHtml('Your bookmarks note is empty. Add bookmarks data.')
      return
    }

    try {
      const text = noteDoc.note
        .replace('<pre><code class="language-javascript">\n', '')
        .replace('</code></pre>', '')
        .trim()
      const bookmarks = JSON.parse(text)
      buildBookmarks(bookmarks, el)
    } catch (error) {
      console.log(error)
      el.insertHtml('Your bookmarks note is malformatted. Ask Daddy for help.')
      return
    }
  })
}

function buildBookmarks(bookmarks, el) {
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
        html: section.header.label,
      })
    )

    groupDiv.appendChild(
      createDiv({
        className: `bookmarks-holder ${section.collapsed && 'hidden'}`.trim(),
        html: section.items.map((item) =>
          createAnchor({
            className: `bookmark`.trim(),
            url: item.url,
            html: item.label,
          })
        ),
      })
    )
  }

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
