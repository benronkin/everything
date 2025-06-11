// -------------------------------------------------------------------------------------
// Use this file to build the recipes front end for dev. Run it with node dev
// -------------------------------------------------------------------------------------

import fs from 'fs'
import { execSync } from 'child_process'
import { checkStyles } from './checkStyles.js'

// -------------------------------
// Init
// -------------------------------

/**
 *
 */
async function build() {
  console.clear()
  // const resp = await checkStyles()
  // if (resp) {
  //   console.log(resp)
  //   process.exit(1)
  // }
  setProdUrl()
  updateAdminPage()
  execSync(
    'npx live-server --host=127.0.0.1 --port=5500 --no-browser --open=docs/index.html',
    { stdio: 'inherit', shell: true }
  )
}

build()

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function setProdUrl() {
  const filePath = './docs/assets/js/state.js'
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(/APP_URL:\s*prodUrl/, 'APP_URL: devUrl')
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('🔥 Updated WEB_APP_URL to devUrl in js/state.js')
}

/**
 *
 */
function updateAdminPage() {
  const indexPath = './docs/admin/index.html'
  let content = fs.readFileSync(indexPath, 'utf8')

  content = content.replace(
    'placeholder="key" value=""',
    'placeholder="key" value="45VGrWWp983321pplRbmferrtE3450922DpqWemmv"'
  )
  console.log('🔥 Updated admin key placeholder in admin.html')

  fs.writeFileSync(indexPath, content, 'utf8')
}
