import { newState } from '../_assets/js/newState.js'
import { postWebAppJson } from '../_assets/js/io.js'
// import {  getWebApp, postWebAppForm } from '../_assets/js/io.js'
import { log } from '../_assets/js/logger.js'

const url = newState.const('APP_URL')

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
