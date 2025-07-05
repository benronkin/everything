/* global imageCompression */

import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { toolbar } from './sections/toolbar.js'
import { profile } from './sections/profile.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { createAvatar, updateUserField } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import { getMe } from '../users/users.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    const { user } = await getMe()
    state.set('user', user)
    state.set('app-mode', 'left-panel')
    state.set('default-page', 'settings')
    window.state = state // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    // window.location.href = `../home/index.html?message=${error.message}`
    console.trace(error)
  }
})

async function build() {
  document.head.title = 'Settings | Everything App'
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
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('item-click', 'settings', (id) => {
    switch (id) {
      case 'main-item-profile':
        state.set('app-mode', 'main-panel')
        document.getElementById('settings-wrapper').insertHtml(profile())
        break
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

  state.on('profile-field', 'settings', async ({ name, value }) => {
    const { message } = await updateUserField({ field: name, value })
    // console.log(message)
    setMessage({ message: 'Change saved' })
  })
}
