import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/recipes`

export async function createRecipe() {
  const { id, error } = await getWebApp(`${url}/create`)
  return { id, error }
}

export async function deleteRecipe(id, password) {
  const { recipe, error } = await getWebApp(
    `${url}/delete?id=${id}&password=${password}`
  )
  return { data: recipe, error }
}

export async function fetchCategories() {
  const { categories } = await getWebApp(`${url}/categories/read`)
  return { categories }
}

export async function fetchCategoriesAndRecipes() {
  const [{ categories }, { recipes }] = await Promise.all([
    getWebApp(`${url}/categories/read`),
    getWebApp(`${url}/latest`),
  ])

  return { categories, recipes }
}

export async function fetchRecentRecipes() {
  const resp = await getWebApp(`${url}/latest`)
  const { recipes, error } = resp
  return { recipes, error }
}

export async function fetchRecipesByCategory(id) {
  const resp = await getWebApp(`${url}/by-category?id=${id}`)
  const { recipes, error } = resp
  return { recipes, error }
}

export async function searchRecipes(q) {
  const { recipes, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: recipes, error }
}

export async function updateRecipe({ id, section, value }) {
  const { message, error } = await postWebAppJson(`${url}/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}

export async function updateRecipeAccess(id) {
  const { message } = await getWebApp(`${url}/update-access?id=${id}`)
  return { message }
}
