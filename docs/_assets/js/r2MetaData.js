/*
  This module contains the function to bring back the r2 assets
  that correspond with a main document id. It helps isolate
  the call so that it can be mocked in vitest mocking of the
 */
// api/photos.js
import { getWebApp } from '../_assets/js/io.js'

export async function getR2MetaData(url) {
  const res = await getWebApp(url)
  return res.photos || []
}
