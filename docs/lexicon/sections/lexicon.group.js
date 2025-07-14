import { createDiv } from '../../assets/partials/div.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createSpan } from '../../assets/partials/span.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

export function createLexiconGroup() {
  const el = createDiv({ id: 'entry-group' })

  build(el)

  return el
}

async function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'entry',
      name: 'entry',
      placeholder: 'Entry',
      autocomplete: 'off',
      classes: { group: 'mb-40', input: 'field w-100', icon: 'fa-cube' },
    })
  )

  el.appendChild(
    createSelectGroup({
      id: 'entry-part',
      name: 'part_of_speech',
      classes: {
        group: 'mb-40 w-fc',
        wrapper: 'primary',
        select: 'field',
        icon: 'fa-layer-group',
      },
      options: [
        { value: '', label: '' },
        { value: 'noun', label: 'Noun' },
        { value: 'verb', label: 'Verb' },
        { value: 'adjective', label: 'Adjective' },
        { value: 'adverb', label: 'Adverb' },
        { value: 'phrase', label: 'Phrase' },
      ],
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-30 mb-20',
        icon: 'fa-magnifying-glass-arrow-right',
      },
      html: 'Definition',
    })
  )

  el.appendChild(
    createTextarea({
      id: 'entry-definition',
      name: 'definition',
      className: 'mb-20 field w-100',
      placeholder: 'Add definition',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-30 mb-20',
        icon: 'fa-feather-pointed',
      },
      html: 'Example',
    })
  )

  el.appendChild(
    createTextarea({
      id: 'entry-example',
      name: 'example',
      className: 'mb-20 field w-100',
      placeholder: 'Add example',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-30 mb-20',
        icon: 'fa-water',
      },
      html: 'Synonyms',
    })
  )

  el.appendChild(
    createTextarea({
      id: 'entry-synonyms',
      name: 'synonyms',
      className: 'mb-20 field w-100',
      placeholder: 'Add synonyms',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: {
        group: 'mt-30 mb-10',
        icon: 'fa-user',
      },
      html: 'Added by',
    })
  )

  el.appendChild(createSpan({ id: 'entry-submitter' }))

  return el
}
