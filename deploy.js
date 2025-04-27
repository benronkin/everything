// -------------------------------------------------------------------------------------
// Use this file to build the recipes front end for prod.
// Do not manually push to github. Run it with node deploy
// -------------------------------------------------------------------------------------

import fs from 'fs'
import readlineSync from 'readline-sync'
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
  updateFooterPartial()
  commitChanges()
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
  content = content.replace(/WEB_APP_URL:\s*devUrl/, 'WEB_APP_URL: prodUrl')
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('🔥 Updated WEB_APP_URL to prodUrl in js/state.js')
}

/**
 *
 */
function updateAdminPage() {
  const indexPath = './docs/admin/index.html'
  let content = fs.readFileSync(indexPath, 'utf8')

  content = content.replace(/(placeholder="key" value=")[^"]*(")/, '$1$2')
  console.log('🔥 Updated admin key placeholder in admin.html')

  fs.writeFileSync(indexPath, content, 'utf8')
}

/**
 *
 */
function updateIndexPage() {
  const filePath = './docs/index.html'
  let content = fs.readFileSync(filePath, 'utf8')

  // Remove the ronkinben@gmail.com placeholder
  content = content.replace('value="ronkinben@gmail.com"', 'value=""')

  // Write the file
  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 *
 */
function updateFooterPartial() {
  const filePath = './docs/partials/footer.js'
  let content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/<span id="version-number">(.*?)<\/span>/)
  const currentVersion = match ? match[1] : null

  // Prompt user for the new version
  const newVersion = readlineSync
    .question(`Version (${currentVersion}): `, {
      defaultInput: currentVersion,
    })
    .trim()
  // Update the version in index.html
  content = content.replace(/<span id="version-number">(.*?)<\/span>/, `<span id="version-number">${newVersion}</span>`)

  // Write the file
  fs.writeFileSync(filePath, content, 'utf8')
  if (newVersion !== currentVersion) {
    console.log(`🔥 Updated version to ${newVersion} in index.html`)
  }
}

/**
 * Prompts for a commit message and runs gacp
 */
function commitChanges() {
  let lastCommitMessage = ''

  try {
    lastCommitMessage = execSync('git log -1 --pretty=%B', {
      encoding: 'utf8',
    }).trim()
  } catch (error) {
    console.log('❌ Could not retrieve last commit message.')
  }

  const commitMessage = readlineSync
    .question(`Commit message (${lastCommitMessage}): `, {
      defaultInput: lastCommitMessage,
    })
    .trim()

  if (!commitMessage) {
    console.log('❌ No commit message entered. Skipping commit.')
    return
  }

  try {
    execSync('git add .', { stdio: 'inherit', shell: true })
    execSync(`git commit -m "${commitMessage}"`, {
      stdio: 'inherit',
      shell: true,
    })
    execSync('git push origin main', { stdio: 'inherit', shell: true })

    console.log('✅ Changes committed successfully.')
  } catch (error) {
    console.error('❌ Error committing changes:', error.message)
  }
}
