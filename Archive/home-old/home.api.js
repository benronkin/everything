import { state } from '../../docs/assets/js/state.js'
import { postWebAppJson } from '../../docs/assets/js/io.js'
// import {  getWebApp, postWebAppForm } from '../js/io.js'
import { log } from '../../docs/assets/js/logger.js'

const url = state.const('APP_URL')

/**
 *
 */
export async function login(userEmail) {
  const resp = await postWebAppJson(`${url}/email-submit`, {
    email: userEmail,
  })
  log('resp', resp)

  return { status: resp.status, message: resp.message }
}
