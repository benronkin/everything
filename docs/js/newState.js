// eslint-disable-next-line no-unused-vars
const devMobileUrl = 'http://192.168.1.193:8787'
const devUrl = 'http://127.0.0.1:8787'
// eslint-disable-next-line no-unused-vars
const prodUrl = 'https://recipes-prod.ba201220a.workers.dev'

export const newState = {
  _data: {},
  _listeners: {},
  _constants: {
    APP_URL: devUrl,
  },

  const(key) {
    return this._constants[key]
  },

  get(key) {
    return this._data[key]
  },

  set(key, value) {
    this._data[key] = value
    if (this._listeners[key]) {
      this._listeners[key].forEach((cb) => cb(value))
    }
  },

  on(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Pass only functions to .on')
    }

    if (!this._listeners[key]) {
      this._listeners[key] = []
    }

    this._listeners[key].push(callback)
  },

  off(key, callback) {
    const cbs = this._listeners[key]
    if (!cbs) return
    this._listeners[key] = cbs.filter((cb) => cb !== callback)
  },

  makeReactive(stateVar, bindings) {
    this.on(stateVar, (val) => {
      bindings.forEach(({ selector, prop = 'value', transform = (x) => x }) => {
        const el = document.querySelector(selector)
        if (el) {
          el[prop] = transform(val)
        }
      })
    })
  },

  // local storage
  loadFromStorage() {
    const saved = localStorage.getItem('state')
    if (saved) {
      this._data = JSON.parse(saved)
    }
  },

  persist(keys = []) {
    const snapshot = {}
    keys.forEach((k) => (snapshot[k] = this._data[k]))
    localStorage.setItem('state', JSON.stringify(snapshot))
  },

  // -----------------------
  // Helpers
  // -----------------------

  getAppUrl() {
    const url = this.const('APP_URL')
    console.log(`App running on ${url}`)
    return url
  },

  getDefaultPage() {
    return localStorage.getItem('mode') || 'recipes'
  },

  setDefaultPage(mode) {
    localStorage.setItem('mode', mode)
  },
}
