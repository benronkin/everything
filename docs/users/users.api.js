import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/users`

export async function fetchPeers() {
  const { peers } = await getWebApp(`${url}/peers/read`)

  return { peers }
}

export async function getMe() {
  const { user } = await getWebApp(`${url}/me`)

  return { user }
}
