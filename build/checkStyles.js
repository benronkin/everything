import { promises as fs } from 'fs'
import path from 'path'

// ----------------------
// Globals
// ----------------------
const defs = {
  css: {
    ext: 'css',
    folder: './docs/css',
    class_re: /([\.][_A-Za-z0-9\-]+)[^}]*{/gm,
    id_re: /([#][_A-Za-z0-9\-]+)[^}]*{/gm,
    match_class_fn: (text) => text.replace('.', ''),
    match_id_fn: (text) => text.replace('#', ''),
  },
  html: {
    ext: 'html',
    folder: './docs',
    class_re: /class\s*=\s*"([^"]+)"/gm,
    id_re: /id\s*=\s*"([^"]+)"/gm,
    match_class_fn: (text) => text.split(/\s+/),
    match_id_fn: (text) => text.split(/\s+/),
  },
}

// ----------------------
// Exported functions
// ----------------------

// async function dev() {
//   const text = await fs.readFile('/Users/benronkin/Documents/recipes/client/docs/recipes/index.html', 'utf-8')
//   const { classes } = extractStyle(defs.html, text)
//   console.log('classes', classes)
// }

// dev()
// flagUnusedStyles()

/**
 *
 */
export async function checkStyles() {
  console.clear()
  const { classes: declaredClasses, ids: declaredIds } = await extractStyles(
    defs.css
  )
  const { classes: usedClasses, ids: usedIds } = await extractStyles(defs.html)
  const unusedClasses = declaredClasses.filter((c) => !usedClasses.includes(c))
  const unusedIds = declaredIds.filter((i) => !usedIds.includes(i))
  let resp = ''

  if (unusedClasses.length || unusedIds.length) {
    resp = `\u001b[31m⚡️ Unused styles found in cs files:\u001b[0m`
    if (unusedClasses.length) {
      resp += '\nUnused classes: ' + unusedClasses.join(', ')
    }
    if (unusedIds.length) {
      resp += '\nUnused ids: ' + unusedIds.join(', ')
    }
  }

  return resp
}

// ----------------------
// Helpers
// ----------------------

/**
 *`
 */
async function extractStyles(def) {
  const filePaths = await getFilePathsByType(def.folder, def.ext)
  const fileAsyncArr = []
  for (const filePath of filePaths) {
    if (filePath.includes('theme')) {
      continue
    }
    fileAsyncArr.push(await readFile(filePath))
  }
  const texts = await Promise.all(fileAsyncArr)
  const classes = new Set()
  const ids = new Set()

  for (const text of texts) {
    const { classes: cls, ids: idz } = extractStyle(def, text)
    cls.forEach((c) => classes.add(c))
    idz.forEach((i) => ids.add(i))
  }

  return { classes: [...classes], ids: [...ids] }
}

/**
 *
 */
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return data
  } catch (err) {
    console.error(err)
    return err
  }
}

/**
 *
 */
async function getFilePathsByType(dir, fileType) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name)
      return entry.isDirectory() ? await getFilePathsByType(res, fileType) : res
    })
  )
  return files.flat().filter((f) => f.includes(`.${fileType}`))
}

/**
 *
 */
function extractStyle(def, text) {
  const classes = new Set()
  const ids = new Set()

  let match

  while ((match = def.class_re.exec(text)) !== null) {
    // if (match[1].includes('bobo')) {
    //   console.log(match[0])
    // }
    const res = def.match_class_fn(match[1])
    if (Array.isArray(res)) {
      res.forEach((c) => {
        if (!c.startsWith('u-')) classes.add(c)
      })
    } else {
      if (!res.startsWith('u-')) {
        classes.add(res)
      }
    }
  }

  while ((match = def.id_re.exec(text)) !== null) {
    const res = def.match_id_fn(match[1])
    if (Array.isArray(res)) {
      res.forEach((id) => ids.add(id))
    } else {
      ids.add(res)
    }
  }

  return { classes: [...classes], ids: [...ids] }
}
