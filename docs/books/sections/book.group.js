import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createInput } from '../../assets/partials/input.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { createSpan } from '../../assets/partials/span.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { state } from '../../assets/js/state.js'
import { fetchBook } from '../books.api.js'
// import { log } from '../../assets/js/logger.js'

export function createBookGroup() {
  const el = createDiv({ id: 'entry-group' })

  build(el)
  react(el)

  return el
}

async function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'book-title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: { group: '', input: 'field w-100', icon: 'fa-book' },
    })
  )

  el.appendChild(
    createInputGroup({
      id: 'book-author',
      name: 'author',
      placeholder: 'Author',
      autocomplete: 'off',
      classes: { group: 'mt-30', input: 'field w-100', icon: 'fa-user' },
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mt-30 mb-20', icon: 'fa-pencil' },
      html: 'Note',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'note',
      id: 'book-note',
      className: 'mb-20 field w-100',
      placeholder: 'Add note...',
    })
  )

  el.appendChild(
    createSelectGroup({
      name: 'rating',
      id: 'book-rating',
      classes: {
        group: 'mb-40 w-fc',
        wrapper: '',
        select: 'field',
        icon: 'fa-star',
      },
      options: [
        { value: '', label: 'Rate' },
        { value: 'great', label: '🔥' },
        { value: 'medium', label: '🆗' },
        { value: 'bad', label: '🤮' },
      ],
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex align-center gap-20',
      html: [
        createDiv({
          className: 'flex flex-column',
          html: [
            createSpanGroup({
              classes: { group: 'mt-30 mb-20', icon: 'fa-calendar' },
              html: 'Year read',
            }),
            createInput({
              id: 'book-read-year',
              name: 'read_year',
              placeholder: 'Year read',
              autocomplete: 'off',
              className: 'field w-100',
            }),
          ],
        }),
        createDiv({
          className: 'flex flex-column',
          html: [
            createSpanGroup({
              classes: { group: 'mt-30 mb-20', icon: 'fa-calendar' },
              html: 'Year published',
            }),
            createInput({
              id: 'book-published-year',
              name: 'published_year',
              placeholder: 'Year published',
              autocomplete: 'off',
              className: 'field w-100',
            }),
          ],
        }),
      ],
    })
  )

  // el.appendChild(

  // )

  // el.appendChild(
  //   )
  // )

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-40' }))

  el.appendChild(createSpan({ id: 'book-id', className: 'c-gray3' }))

  return el
}

function react(el) {
  state.on('app-mode', 'mainPanel', async (appMode) => {
    if (appMode !== 'main-panel') return

    const id = state.get('active-doc')
    const doc = state.get('main-documents').find((d) => d.id === id)

    if (!doc.note?.length) {
      const { book } = await fetchBook(id)
      doc.note = book.note || ''
    }

    // animation frame needed to paint the form
    // so textarea can be resized
    requestAnimationFrame(() => {
      el.querySelector('#book-title').value = doc.title
      el.querySelector('#book-author').value = doc.author || ''
      el.querySelector('#book-note').setValue(doc.note)
      el.querySelector('#book-rating').selectByValue(doc.rating || '')
      el.querySelector('#book-read-year').value = doc.read_year || ''
      el.querySelector('#book-published-year').value = doc.published_year || ''
      el.querySelector('#book-id').insertHtml(doc.id)
    })
  })
}
