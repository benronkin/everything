import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppForm, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/users`

export async function createAvatar(formData) {
  const { message, data } = await postWebAppForm(
    `${url}/avatar/create`,
    formData
  )
  return { message, data }
}

export async function deleteAvatar() {
  const { message } = await getWebApp(`${url}/avatar/delete`)
  return { message }
}

export async function fetchPeers() {
  const { peers } = await getWebApp(`${url}/peers/read`)

  return { peers }
}

export async function fetchUsers() {
  const { users } = await getWebApp(`${url}/users/read`)

  return { users }
}

export async function getMe() {
  const { user } = await getWebApp(`${url}/me`)

  return { user }
}

export async function updateUserField({ field, value }) {
  const { message } = await postWebAppJson(`${url}/update`, { field, value })

  return { message }
}

export async function updateUserPrefs(doc) {
  const { message } = await postWebAppJson(`${url}/update-prefs`, doc)

  return { message }
}
