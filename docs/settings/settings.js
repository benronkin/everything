/* global imageCompression */

import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { toolbar } from './sections/toolbar.js'
import { profile } from './sections/profile.js'
import { shop } from './sections/shop.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { createAvatar, updateUserField } from '../users/users.api.js'
import { fetchShopping, updateRecurring } from '../shopping/shopping.api.js'
import { setMessage } from '../assets/js/ui.js'
import { getMe } from '../users/users.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    const [{ user }, { recurring }] = await Promise.all([
      getMe(),
      fetchShopping(),
    ])

    state.set('user', user)
    state.set('recurring', recurring)
    state.set('app-mode', 'left-panel')
    state.set('default-page', 'settings')
    window.state = state // avail to browser console
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

/**
 *
 */
async function build() {
  document.title = 'Settings | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createFooter())
}

/**
 *
 */
function react() {
  state.on('item-click', 'settings', (id) => {
    if (id === 'main-item-profile') {
      state.set('app-mode', 'main-panel')
      document.getElementById('settings-wrapper').insertHtml(profile())
      return
    }

    if (id === 'main-item-shop') {
      state.set('app-mode', 'main-panel')
      document.getElementById('settings-wrapper').insertHtml(shop())
      const recurringTA = document.getElementById('recurring')

      requestAnimationFrame(() => {
        recurringTA.focus()
      })
      return
    }
  })

  state.on('profile-avatar', 'settings', async (file) => {
    const compressionOptions = {
      maxWidthOrHeight: 125,
      useWebWorker: true,
      fileType: 'image/png',
      exifOrientation: null,
    }

    try {
      const compressed = await imageCompression(file, compressionOptions)
      const formData = new FormData()
      formData.set('file', compressed)

      const { message, data } = await createAvatar(formData)

      const user = state.get('user')
      user.avatar = data?.url
      state.set('user', user)
      log(message)
    } catch (error) {
      console.error(error)
    }
  })

  state.on('field-changed', 'settings', (el) => {
    const field = el.name
    const value = el.value

    switch (field) {
      case 'recurring':
        updateRecurring(value)
        break
      default:
        updateUserField({ field, value })
    }

    setMessage('Saved', { type: 'quiet' })
  })
}
