import { createDiv } from '../../assets/partials/div.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createSwitch } from '../../assets/partials/switch.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createList } from '../../assets/partials/list.js'

export function createRecipeGroup() {
  const el = createDiv({ id: 'entry-group' })

  build(el)

  return el
}

async function build(el) {
  el.appendChild(
    createInputGroup({
      id: 'recipe-title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: { group: '', input: 'w-100', icon: 'fa-utensils' },
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
      className: 'mb-20 w-100',
      placeholder: 'Add notes...',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mb-20', icon: 'fa-utensils' },
      html: 'Items to buy',
    })
  )

  el.appendChild(
    createTextarea({
      name: 'ingredients',
      id: 'recipe-ingredients',
      className: 'mb-20 w-100',
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
      className: 'mb-20 w-100',
      placeholder: 'Method',
    })
  )

  el.appendChild(
    createSelectGroup({
      name: 'category',
      id: 'recipe-category',
      classes: {
        group: 'mb-40 w-fc',
        wrapper: 'primary',
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
      classes: { group: 'mb-40', icon: 'fa-tag' },
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex mb-20',
      html: [
        createHeader({ type: 'h5', html: 'Related' }),
        createSwitch({ id: 'related-switch', name: 'related-switch' }),
      ],
    })
  )

  el.appendChild(
    createTextarea({
      name: 'related',
      id: 'recipe-related',
      className: 'hidden w-100 bg-blue0 p-10',
    })
  )
  el.appendChild(createList({ id: 'related-list' }))

  return el
}
