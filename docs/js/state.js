/* 
  The big deal about this state is recipe managment. 
  All create/delete/update/push is done via the set function.
  Set dispatches a custom event that recipes.js listens to.
  The handler reactively updates the recipe list, and takes
  other actions on the list based on a function registry.

  Set throws custom events for any stateObj.data[collection],
  so it can be extended in the future.
*/

// eslint-disable-next-line no-unused-vars
const devMobileUrl = 'http://192.168.1.193:8787'
const devUrl = 'http://127.0.0.1:8787'
// eslint-disable-next-line no-unused-vars
const prodUrl = 'https://recipes-prod.ba201220a.workers.dev'

const stateObj = {
  data: {
    'active-journal': null,
    'active-recipe': null,
    journal: [],
    recipes: [],
    WEB_APP_URL: devUrl,
  },

  add(key, values) {
    const arr = this.get(key)
    for (let value of values) {
      if (!value) {
        continue
      }
      if (key !== 'recipes') {
        value = value.trim()
      }
      if (!arr.includes(value)) {
        arr.push(value)
      }
    }
    this.set(key, arr)
    return arr
  },

  delete(key, value) {
    let arr = this.get(key)
    if (key !== 'recipes') {
      value = value.trim()
      arr = arr.filter((v) => v !== value)
    } else {
      arr = arr.filter((v) => v.id !== value.id)
    }
    this.set(key, arr)
    return arr
  },

  get(key) {
    return this.data[key]
  },

  getAll() {
    return this.data
  },

  getById(collection, id) {
    return this.data[collection].find((doc) => doc.id === id)
  },

  getCollection(collection) {
    return this.data[collection]
  },

  set(key, value) {
    this.data[key] = value
    const eventName = `${key}-state-changed`
    document.dispatchEvent(new CustomEvent(eventName, { detail: value }))
  },

  setById({ collection, id, key, value }) {
    const doc = this.getById(collection, id)
    doc[key] = value
  },

  push(key, value) {
    const arr = this.get(key)
    arr.push(value)
    this.set(key, arr)
  },

  // -----------------------
  // defaults
  // -----------------------

  getWebAppUrl() {
    console.log(`state.getWebAppUrl is using ${this.data.WEB_APP_URL}`)
    return this.data.WEB_APP_URL
  },

  getDefaultPage() {
    return localStorage.getItem('mode') || 'recipes'
  },

  setDefaultPage(mode) {
    localStorage.setItem('mode', mode)
  },

  // -----------------------
  // Journal
  // -----------------------

  getJournalById(id) {
    return this.data.journal.find((j) => j.id === id)
  },

  // -----------------------
  // recipes
  // -----------------------

  getRecipeById(id) {
    return this.data.recipes.find((recipe) => recipe.id === id)
  },

  getRecipes() {
    return [...this.data.recipes]
  },

  setRecipes(newRecipes = []) {
    this.set('recipes', [...newRecipes])
  },

  setRecipeSection(id, section, value) {
    const recipes = this.get('recipes')
    const recipe = recipes.find((r) => r.id === id)
    if (recipe) {
      recipe[section] = value
      this.set('recipes', recipes)
    }
  },
}

// Make `state` globally accessible via `window` for debugging
if (typeof window !== 'undefined') {
  window.state = stateObj
}

export const state = stateObj
