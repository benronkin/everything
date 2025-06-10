import { createDiv } from '../../_partials/div.js'
import { createInputGroup } from '../../_partials/inputGroup.js'
import { createHeader } from '../../_partials/header.js'
import { createSelectGroup } from '../../_partials/selectGroup.js'
import { createSpanGroup } from '../../_partials/spanGroup.js'
import { createSwitch } from '../../_partials/switch.js'
import { createTextarea } from '../../_partials/textarea.js'
import { createList } from '../../_partials/list.js'
import { newState } from '../../_assets/js/newState.js'
import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createRecipeGroup() {
  const el = createDiv({ id: 'entry-group' })

  build(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
async function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'recipe-title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: { group: '', input: 'fs-125 field', icon: 'fa-utensils' },
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mt-30 mb-20', icon: 'fa-pencil' },
      html: 'Notes',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'notes',
      id: 'recipe-notes',
      className: 'mb-20 field w-100',
      placeholder: 'Add notes...',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mb-20', icon: 'fa-utensils' },
      html: 'Ingredients',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'ingredients',
      id: 'recipe-ingredients',
      className: 'mb-20 field w-100',
      placeholder: 'Ingredients',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mb-20', icon: 'fa-spoon' },
      html: 'Method',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'method',
      id: 'recipe-method',
      className: 'mb-20 field w-100',
      placeholder: 'Method',
    })
  )

  el.appendChild(
    createSelectGroup({
      name: 'category',
      id: 'recipe-category',
      classes: {
        group: 'mb-40',
        textarea: 'field',
        icon: 'fa-layer-group',
      },
    })
  )

  el.appendChild(
    createInputGroup({
      id: 'recipe-tags',
      name: 'tags',
      placeholder: 'Tags',
      autocomplete: 'off',
      classes: { group: 'mb-40', input: 'field', icon: 'fa-tag' },
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex mb-20',
      html: [
        createHeader({ type: 'h5', html: 'Related' }),
        createSwitch({ id: 'related-switch' }),
      ],
    })
  )

  el.appendChild(
    createTextarea({
      name: 'related',
      id: 'recipe-related',
      className: 'field hidden w-100 bg-blue0 p-10',
    })
  )
  el.appendChild(createList({ id: 'related-list' }))

  return el
}
