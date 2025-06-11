import { getWebApp, postWebAppJson } from '../_assets/js/io.js'
import { state } from '../_assets/js/state.js'
import { createTable } from '../_partials/table.js'
import { createSelect } from '../_partials/select.js'
import { createSpan } from '../_partials/span.js'

// -------------------------------
// Globals
// -------------------------------

const mainPanelEl = document.querySelector('#main-panel')

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Get and display all recipes
 */
export async function listRecipes() {
  const [recipesResp, categoriesResp] = await Promise.all([
    getWebApp(`${state.getWebAppUrl()}/recipes/read?fields=id,title,category`),
    getWebApp(`${state.getWebAppUrl()}/recipes/categories/read`),
  ])

  const { recipes } = recipesResp
  let { categories } = categoriesResp

  categories = categories.map((c) => ({
    value: c.id,
    label: c.label,
  }))
  categories.unshift({
    value: '',
    label: '',
  })

  mainPanelEl.innerHTML = ''

  // create the table
  const table = createTable({
    headers: ['Title', 'Category', 'Notes'],
  })
  for (const r of recipes) {
    let note = ''
    let cat = r.category?.trim() || ''
    const selectEl = createSelect({ options: categories, name: 'category' })
    if (cat.length) {
      if (selectEl.hasOptionValue(cat)) {
        selectEl.selectByValue(cat)
      } else {
        note = `Unrecognized category: "${cat}"`
      }
    }

    table.addRow({
      id: r.id,
      fields: [
        createSpan({ html: r.title }),
        selectEl,
        createSpan({ html: note }),
      ],
    })
  }

  mainPanelEl.appendChild(table)
}

// -------------------------------
// Event listeners
// -------------------------------

/* when a select changes */
document.addEventListener('change', handleChangeEvent)

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
async function handleChangeEvent(e) {
  const id = e.target.closest('tr')?.dataset.id
  const wrapper = e.target.closest('.select-wrapper')
  const value = wrapper?.getValue?.()
  const section = wrapper?.getName?.()

  if (!id || !value || !section) {
    console.warn(`No id, section, or value:`)
    console.log(`id: "${id}", section: "${section}", value: "${value}"`)
    return
  }

  try {
    const { message, error } = await postWebAppJson(
      `${state.getWebAppUrl()}/recipes/update`,
      { id, section, value }
    )
    if (error) {
      throw new Error(error)
    }
    console.log(message)
  } catch (err) {
    console.log(err)
  }
}
