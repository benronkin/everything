// ------------------------
// Exported functions
// ------------------------

/**
 * Create a sidebar link element
 */
export function createSidebarLink({ id, title, icon, cb }) {
  const li = document.createElement('li')
  if (icon) {
    li.innerHTML = `<i class="fa-full ${icon}></i> `
  }
  li.innerHTML += title
  li.classList.add('sidebar-link')
  li.dataset.id = id
  li.addEventListener('click', () => {
    cb(li)
  })
  return li
}
