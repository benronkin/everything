// ------------------------
// Exported functions
// ------------------------

/**
 * Create a sidebar link element
 */
export function createLeftPanelLink({ id, title, icon, cb }) {
  const li = document.createElement('li')
  if (icon) {
    li.innerHTML = `<i class="fa-full ${icon}></i> `
  }
  li.innerHTML += title
  li.classList.add('left-panel-link')
  li.dataset.id = id
  li.addEventListener('click', () => {
    cb(li)
  })

  li.addEventListener('click', handleClick)

  return li
}

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
function handleClick(e) {
  const li = e.target
  const ul = document.querySelector('#left-panel-list')
  ul.querySelector('.active')?.classList.remove('active')

  // this can be a related link, hence li is not in the left-panel
  document.querySelector(`.left-panel-link[data-id="${li.dataset.id}"]`).classList.add('active')

  // hide the left panel if mobile
  if (isMobile()) {
    document.querySelector('#main-icon-group').collapse()
  }
}

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
