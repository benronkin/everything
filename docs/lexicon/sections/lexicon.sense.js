import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createMarkdown } from '../../assets/composites/markdown.js'
import { createSelect } from '../../assets/partials/select.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createSpan } from '../../assets/partials/span.js'

const css = `
.lexicon-sense:not(:nth-child(2)) {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid var(--purple2);
}
`

export function createLexiconGroup({ sense, noFaMinus = false }) {
  injectStyle(css)
  const el = createDiv({ id: sense.id, className: 'lexicon-sense' })

  build(el, sense, noFaMinus)

  return el
}

async function build(el, sense, noFaMinus) {
  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-20 mb-10',
        icon: 'fa-layer-group',
      },
      html: 'Part of speech',
    }),
  )

  const posWrapper = createDiv({ className: 'flex align-center' })
  el.appendChild(posWrapper)

  const partSelect = createSelect({
    name: 'pos',
    className: 'w-fc pos primary mb-20',
    options: [
      { value: '', label: '' },
      { value: 'noun', label: 'Noun' },
      { value: 'verb', label: 'Verb' },
      { value: 'adjective', label: 'Adjective' },
      { value: 'adverb', label: 'Adverb' },
      { value: 'phrase', label: 'Phrase' },
    ],
  })
  posWrapper.appendChild(partSelect)

  partSelect.selectByValue(sense.partOfSpeech)

  if (!noFaMinus) {
    posWrapper.appendChild(
      createIcon({ classes: { primary: 'fa-minus', other: 'primary' } }),
    )
  }

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-20 mb-10',
        icon: 'fa-magnifying-glass-arrow-right',
      },
      html: 'Definition',
    }),
  )

  let markdown = createMarkdown({ name: 'definition', toggleId: 'edit-toggle' })
  let markdownEditor = markdown.querySelector('.markdown-editor')
  markdown.classList.add('w-100')
  markdownEditor.palceholder = 'Add definition'
  markdownEditor.classList.add('definition')
  markdown.updateEditor(sense.definition)
  el.appendChild(markdown)

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-20 mb-10',
        icon: 'fa-feather-pointed',
      },
      html: 'Example',
    }),
  )

  markdown = createMarkdown({ name: 'example', toggleId: 'edit-toggle' })
  markdownEditor = markdown.querySelector('.markdown-editor')
  markdown.classList.add('w-100')
  markdownEditor.palceholder = 'Add example'
  markdownEditor.classList.add('example')
  markdown.updateEditor(sense.example)
  el.appendChild(markdown)

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mb-10 mt-20',
        icon: 'fa-water',
      },
      html: 'Synonyms',
    }),
  )

  markdown = createMarkdown({ name: 'synonyms', toggleId: 'edit-toggle' })
  markdownEditor = markdown.querySelector('.markdown-editor')
  markdown.classList.add('w-100')
  markdownEditor.palceholder = 'Add synonyms'
  markdownEditor.classList.add('synonyms')
  markdown.updateEditor(sense.synonyms)
  el.appendChild(markdown)

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-20 mb-10',
        icon: 'fa-user',
      },
      html: 'Added by',
    }),
  )

  const date = new Date(sense.created_at)
  const html = `${sense.submitterName} (${date.toLocaleDateString('en-us', {
    month: 'short',
    year: 'numeric',
  })})`

  el.appendChild(createSpan({ html, className: 'submitter' }))

  el.querySelectorAll('.fa-minus').forEach((i) =>
    i.addEventListener('click', (e) => {
      const id = e.target.closest('.lexicon-sense').id
      state.set('modal-delete-payload', { id })

      const docs = state.get('main-documents')
      const doc = docs.find((d) => d.title === state.get('active-doc'))
      const sense = doc.senses.find((s) => s.id === id)
      const partOfSpeech = sense.partOfSpeech || '(not set)'

      const modal = document.getElementById('modal-delete')
      modal.querySelector('.modal-header').insertHtml('Delete sense:')
      modal.querySelector('.modal-body').insertHtml(partOfSpeech)
      modal.dataset.vitest = 'modal-open'
      modal.showModal()
    }),
  )

  return el
}
