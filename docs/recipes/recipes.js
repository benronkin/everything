/* global imageCompression */
import { state } from '../assets/js/state.js'
import { toolbar } from './sections/toolbar.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { createMainDocumentItem } from '../assets/partials/mainDocumentItem.js'
import { createNav } from '../assets/composites/nav.js'
import { createRightDrawer } from '../assets/composites/rightDrawer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  fetchCartAndSuggestions,
  updateShoppingList,
} from '../shopping/shopping.api.js'
import {
  createRecipe,
  deleteRecipe,
  fetchCategoriesAndRecipes,
  fetchEntryPhotosMetadata,
  fetchRecentRecipes,
  fetchRecipesByCategory,
  searchRecipes,
  updateRecipe,
  updateRecipeAccess,
  addEntryPhoto,
  deleteEntryPhoto,
  updatePhotoCaption,
} from './recipes.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage('Loading...')

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()
    listen()

    let [{ categories, recipes }, { user }] = await Promise.all([
      fetchCategoriesAndRecipes(),
      getMe(),
    ])

    categories = categories.map((c) => ({
      value: c.id,
      label: c.label,
    }))
    categories.unshift({ value: '', label: 'Category' })

    setMessage()
    state.set('recipe-categories', categories)
    state.set('main-documents', recipes)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'recipes')
    window.state = state // avail to browser console
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.title = 'Recipes | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wraphper' })
  body.prepend(wrapperEl)

  wrapperEl.appendChild(
    createNav({
      title: '<i class="fa-solid fa-cake-candles"></i> Recipes',
    }),
  )
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer({ active: 'recipes' }))

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('icon-click:add-recipe', 'recipes', reactRecipeAdd)

  state.on('icon-click:shop', 'recipes', shopIngredients)

  state.on('button-click:modal-delete-btn', 'recipes', reactRecipeDelete)

  state.on('form-submit:left-panel-search', 'recipes', reactRecipeSearch)

  state.on('recipe-categories', 'recipes', (options) =>
    document.getElementById('recipe-category').setOptions(options),
  )

  state.on('app-mode', 'recipes', async (appMode) => {
    if (appMode === 'main-panel') {
      populateRelatedRecipes()
      const id = state.get('active-doc')
      if (id) {
        const photosMetadata = await fetchEntryPhotosMetadata(id)
        state.set('photos-metadata', photosMetadata)

        updateRecipeAccess(id)
        const docs = state.get('main-documents')
        const idx = docs.findIndex((d) => d.id === id)
        if (idx !== -1) {
          const [doc] = docs.splice(idx, 1)
          const date = new Date()
          doc.last_accessed_at = date.toISOString()
          docs.unshift(doc)
          state.set('main-documents', docs)
        }
      }
    }
  })

  state.on('field-changed', 'recipes', handleFieldChange)

  state.on('photo-form-submit', 'recipes.js', async (formData) => {
    const compressionOptions = {
      maxWidthOrHeight: 600,
      useWebWorker: true,
      fileType: 'image/jpeg',
      exifOrientation: null,
    }

    const file = formData.get('file')
    const compressed = await imageCompression(file, compressionOptions)
    const id = state.get('active-doc')

    formData.set('file', compressed)
    formData.set('entry', id)

    const { message } = await addEntryPhoto(formData)

    state.set('photo-upload-response', message)
    // refresh photo list
    const photosMetadata = await fetchEntryPhotosMetadata(id)
    state.set('photos-metadata', photosMetadata)
  })

  state.on('photo-delete-request', 'recipes.js', async (id) => {
    const { error, message } = await deleteEntryPhoto(id)
    state.set('photo-delete-response', { error, message })
  })

  state.on('photo-caption-change', 'recipes.js', async ({ id, value }) => {
    const { error, message } = await updatePhotoCaption({ id, value })
    state.set('photo-caption-response', { error, message })
  })
}

function listen() {
  // When recipe category switch is toggled
  document.getElementById('related-switch').addEventListener('click', () => {
    document.getElementById('recipe-related').classList.toggle('hidden')
  })
}

/**
 * Add a recipe Recipe
 */
async function reactRecipeAdd() {
  const addBtn = document.getElementById('add-recipe')
  addBtn.disabled = true

  const { id, error } = await createRecipe()
  if (error) {
    console.error(`Recipes server error: ${error}`)
    return
  }

  const dateString = new Date().toISOString()

  const doc = {
    id,
    title: 'New Recipe',
    created_at: dateString,
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

async function reactRecipeDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const password = modalEl.getPassword()
  const { error } = await deleteRecipe(id, password)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.setPassword('')
  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

async function reactRecipeSearch() {
  let resp

  const query = document.querySelector('[name="search-recipe"]').value?.trim()

  if (query.length) {
    state.set('search-action', true)
    resp = await searchRecipes(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentRecipes()
  }

  const { recipes, message } = resp
  if (message) {
    console.error(`Recipe server error: ${message}`)
    return
  }
  state.set('main-documents', recipes)
}

async function handleFieldChange(el) {
  let value = el.value
  const name = el.name

  const isFileUpload = name === 'file' || name === 'caption'

  if (name === 'search-recipe' || name === 'related-switch' || isFileUpload)
    return

  if (name === 'category-filter') {
    handleCategoryChange(value)
    return
  }

  const id = state.get('active-doc')
  const docs = state.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)

  docs[idx][name] = value
  state.set('main-documents', docs)

  try {
    const { error } = await updateRecipe({ id, section: name, value })
    if (error) {
      throw new Error(error)
    }
    setMessage('Saved', { type: 'quiet' })
  } catch (error) {
    setMessage(error, { type: 'danger' })
  }

  if (name === 'related') {
    populateRelatedRecipes()
  }
}

/**
 * Populate related recipes
 */
function populateRelatedRecipes() {
  const relatedListEl = document.getElementById('related-list')
  relatedListEl.deleteChildren()

  const ids = document.getElementById('recipe-related').value
  if (!ids) return

  const splitRegEx = /,|\n|\s/
  const idsArr = ids
    .split(splitRegEx)
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  if (!idsArr.length) return

  for (const id of idsArr) {
    if (!id.trim().length || id === 'undefined') {
      continue
    }

    const docs = state.get('main-documents')
    const relatedDoc = docs.find((doc) => doc.id === id)
    if (!relatedDoc) {
      console.warn(`Related recipe with id "${id}" not found in main documents`)
      return
    }
    const title = relatedDoc.title
    relatedListEl.addChild(
      createMainDocumentItem({
        id,
        html: title,
      }),
    )
  }
}

async function shopIngredients() {
  const id = state.get('active-doc')
  if (!id) return

  const docs = state.get('main-documents')
  if (!docs.length) return

  const doc = docs.find((d) => d.id === id)
  if (!doc) return

  const ingredients = doc.ingredients.length ? doc.ingredients.split('\n') : []
  if (!ingredients.length) return

  const { shoppingList } = await fetchCartAndSuggestions()
  const cart = [...new Set([...ingredients, ...shoppingList.split(',')])]

  updateShoppingList(cart.join(','))
  setMessage('Ingredients added to shopping list')
}

async function handleCategoryChange(id) {
  let resp
  if (!id) {
    resp = await fetchRecentRecipes()
  } else {
    resp = await fetchRecipesByCategory(id)
  }

  const { recipes } = resp

  state.set('main-documents', recipes)
  state.set('app-mode', 'left-panel')
}
