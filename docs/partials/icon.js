// -------------------------------
// Globals
// -------------------------------

// -------------------------------
// Exported functions
// -------------------------------

export function createIcon({ id, className } = {}) {
  const el = document.createElement('i')
  el.setAttribute('id', id)
  el.className = `fa-solid ${className}`
  return el
}
