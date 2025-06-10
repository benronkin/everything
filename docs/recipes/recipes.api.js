import { newState } from '../_assets/js/newState.js'
import { getWebApp, postWebAppJson } from '../_assets/js/io.js'
import { log } from '../_assets/js/logger.js'

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
  const { recipe, error } = await getWebApp(
    `${url}/delete?id=${id}&password=${password}`
  )
  return { data: recipe, error }
}

/**
 *
 */
export async function fetchCategories() {
  const { categories } = await getWebApp(`${url}/categories/read`)
  return { categories }
}

/**
 *
 */
export async function fetchCategoriesAndRecipes() {
  const [{ categories }, { recipes }] = await Promise.all([
    getWebApp(`${url}/categories/read`),
    getWebApp(`${url}/latest`),
  ])

  return { categories, recipes }
}

/**
 *
 */
export async function fetchRecentRecipes() {
  const resp = await getWebApp(`${url}/latest`)
  // log(resp)
  const { recipes, error } = resp
  return { recipes, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchRecipes(q) {
  const { recipes, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: recipes, error }
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
