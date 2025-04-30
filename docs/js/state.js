const devUrl = 'http://192.168.1.193:8787'
const prodUrl = 'https://recipes-cloudflare.ba201220a.workers.dev'

const stateObj = {
  data: {
    recipes: [],
    WEB_APP_URL: prodUrl,
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

  get: function (key) {
    return this.data[key]
  },

  getAll: function () {
    return this.data
  },

  getById: function (collection, id) {
    return this.data[collection].find((doc) => doc.id === id)
  },

  getCollection: function (collection) {
    return this.data[collection]
  },

  set: function (key, value) {
    this.data[key] = value
  },

  setById: function ({ collection, id, key, value }) {
    const doc = this.getById(collection, id)
    doc[key] = value
  },

  push: function (key, value) {
    this.data[key].push(value)
  },

  // -----------------------
  // misc
  // -----------------------

  getWebAppUrl: function () {
    console.log(`state.getWebAppUrl is using ${this.data.WEB_APP_URL}`)
    return this.data.WEB_APP_URL
  },

  // -----------------------
  // default page
  // -----------------------

  getDefaultPage: function () {
    return localStorage.getItem('mode') || 'recipes'
  },

  setDefaultPage: function (mode) {
    localStorage.setItem('mode', mode)
  },

  // -----------------------
  // recipes
  // -----------------------

  getRecipeById: function (id) {
    return this.data.recipes.find((recipe) => recipe.id === id)
  },

  getRecipes: function () {
    return [...this.data.recipes]
  },

  setRecipes: function (newRecipes) {
    this.data.recipes = newRecipes ? [...newRecipes] : []
  },

  setRecipeSection: function (id, section, value) {
    const recipe = this.getRecipeById(id)
    recipe[section] = value
  },
}

// Make `state` globally accessible via `window` for debugging
if (typeof window !== 'undefined') {
  window.state = stateObj
}

export const state = stateObj
