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

  getSubscribers(stateVar) {
    if (!this._listeners[stateVar]) {
      return null
    }
    return this._listeners[stateVar].map((obj) => obj.subscriber)
  },

  set(key, value) {
    this._data[key] = value
    if (this._listeners[key]) {
      this._listeners[key].forEach(({ callback }) => callback(value))
    }
  },

  on(key, subscriber, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Pass only functions to .on')
    }

    if (!this._listeners[key]) {
      this._listeners[key] = []
    }

    this._listeners[key].push({ subscriber, callback })
  },

  off(key, fn) {
    const cbs = this._listeners[key]
    if (!cbs) return
    this._listeners[key] = cbs.filter(({ callback }) => fn !== callback)
  },

  // auto-update dom elements using each one's value setting property and
  // a transformation function
  makeReactive(stateVar, bindings) {
    // subscribe to this stateVar and
    // push this callback to _listeners for this stateVar
    // the callback executes on whatevere is set as value for the stateVar
    this.on(stateVar, 'state.makeReactive', (val) => {
      // go thru the bindings array and use each object member
      // to set the value of the passed-in element
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
