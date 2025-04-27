// -------------------------------------------------------------------------------------
// Use this file to build the recipes front end for dev. Run it with node dev
// -------------------------------------------------------------------------------------

import fs from 'fs'
import { execSync } from 'child_process'

// -------------------------------
// Init
// -------------------------------

/**
 *
 */
function build() {
  console.clear()
  setProdUrl()
  updateAdminPage()
  updateIndexPage()
  execSync('npx live-server --host=localhost --port=5500 --open=docs/index.html', { stdio: 'inherit', shell: true })
  console.log('Make sure to start recipes-cloudflare')
}

build()

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function setProdUrl() {
  const filePath = './docs/js/state.js'
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(/WEB_APP_URL:\s*prodUrl/, 'WEB_APP_URL: devUrl')
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('🔥 Updated WEB_APP_URL to devUrl in js/state.js')
}

/**
 *
 */
function updateAdminPage() {
  const indexPath = './docs/admin/index.html'
  let content = fs.readFileSync(indexPath, 'utf8')

  content = content.replace('placeholder="key" value=""', 'placeholder="key" value="45VGrWWp983321pplRbmferrtE3450922DpqWemmv"')
  console.log('🔥 Updated admin key placeholder in admin.html')

  fs.writeFileSync(indexPath, content, 'utf8')
}

/**
 *
 */
function updateIndexPage() {
  const indexPath = './docs/index.html'
  let content = fs.readFileSync(indexPath, 'utf8')

  content = content.replace('value=""', 'value="ronkinben@gmail.com"')
  console.log('🔥 Updated email placeholder in index')

  fs.writeFileSync(indexPath, content, 'utf8')
}
