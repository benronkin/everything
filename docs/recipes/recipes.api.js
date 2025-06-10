import { newState } from '../_assets/js/newState.js'
import { getWebApp, postWebAppJson, postWebAppForm } from '../_assets/js/io.js'

const url = `${newState.const('APP_URL')}/recipes`

/**
 *
 */
export async function createRecipe() {
  const { id, error } = await getWebApp(`${url}/create`)
  return { id, error }
}

/**
 *
 */
export async function deleteRecipe(id, password) {
  const { journal, error } = await getWebApp(
    `${url}/delete?id=${id}&password=${password}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function fetchDefaults() {
  const { defaults, error } = await getWebApp(`${url}/defaults/read`)
  return { defaults, error }
}

/**
 *
 */
export async function fetchRecipePhotosMetadata(id) {
  const { photos, error } = await getWebApp(`${url}/photos/read?Recipe=${id}`)
  return { photos, error }
}

/**
 *
 */
export async function fetchRecentRecipes() {
  const { journal, error } = await getWebApp(`${url}/read`)
  return { data: journal, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchRecipes(q) {
  const { journal, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function updateRecipe({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}

/**
 *
 */
export async function updateJournalDefaults({ id, section, value }) {
  await postWebAppJson(`${url}/defaults/update`, {
    id,
    [section]: value,
  })
}

/**
 *
 */
export async function updatePhotoCaption({ id, value }) {
  const { error, message } = await postWebAppJson(`${url}/photos/update`, {
    id,
    value: value,
    section: 'caption',
  })
  return { error, message }
}

/**
 *
 */
export async function addRecipePhoto(formData) {
  const { message } = await postWebAppForm(`${url}/photos/create`, formData)
  return { message }
}

/**
 *
 */
export async function deleteRecipePhoto(id) {
  const { error } = await getWebApp(`${url}/photos/delete?id=${id}`)
  return { error }
}
