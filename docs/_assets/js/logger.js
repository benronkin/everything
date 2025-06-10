// ------------------------
// Globals
// ------------------------

const typeColor = {
  string: '\x1b[95m', // bright magenta (pink)
  object: '\x1b[34m', // blue
  boolean: '\x1b[36m', // cyan
  number: '\x1b[96m', // bright cyan (light blue)
  function: '\x1b[31m', // red
  undefined: '\x1b[33m', // yellow
}

const reset = '\x1b[0m'

// ------------------------
// Exports
// ------------------------

/**
 * Log in debug
 */
export function log(...args) {
  if (localStorage.getItem('debug') !== 'true') return

  const formatted = args.map((arg) => scan(arg, new Set())).join(', ')
  console.trace(`\x1b[35m* DEBUG:\x1b[0m ${formatted}`)
}

// ------------------------
// Helpers
// ------------------------

/**
 * Recursively format an arg
 */
function scan(arg, visited) {
  // Prevent infinite loop on circular refs
  if (visited.has(arg)) return '\x1b[31m[Circular]\x1b[0m'

  // Handle DOM elements
  if (arg instanceof Element) {
    return `\x1b[35m<${arg.tagName.toLowerCase()} id="${arg.id}" class="${
      arg.className
    }">${reset}`
  }

  // Handle arrays
  if (Array.isArray(arg)) {
    visited.add(arg)
    const items = arg.map((item) => scan(item, visited)).join(', ')
    visited.delete(arg)
    return `[${items}]`
  }

  // Handle objects
  if (typeof arg === 'object' && arg !== null) {
    visited.add(arg)
    const entries = Object.entries(arg)
      .map(([key, value]) => `${key}: ${scan(value, visited)}`)
      .join(', ')
    visited.delete(arg)
    return `{${entries}}`
  }

  // Handle primitives
  return getFormattedText(arg)
}

/**
 * Format a primitive value
 */
function getFormattedText(text) {
  const type = typeof text
  const color = typeColor[type] || '\x1b[31m' // red for unknown

  let value
  if (type === 'object' && text !== null) {
    try {
      value = JSON.stringify(text)
    } catch {
      value = '[object]'
    }
  } else {
    value = String(text)
  }

  return `${color}${value}${reset}`
}
