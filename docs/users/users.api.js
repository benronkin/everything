import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppForm } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/users`

export async function createAvatar(formData) {
  const { message } = await postWebAppForm(`${url}/avatar`, formData)
  return { message }
}

export async function fetchPeers() {
  const { peers } = await getWebApp(`${url}/peers/read`)

  return { peers }
}

export async function getMe() {
  const { user } = await getWebApp(`${url}/me`)

  return { user }
}
