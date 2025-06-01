const stateObj = {
  data: {
    'active-journal': null,
    'active-recipe': null,
    'active-note': {},
    journal: [],
    recipes: [],
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
