import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createToast, removeToasts } from '../../assets/partials/toast.js'

let sharedStyleEl = null

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

export function injectStyle(css) {
  if (!sharedStyleEl) {
    sharedStyleEl = document.createElement('style')
    sharedStyleEl.setAttribute('data-ui-style', 'true')
    document.head.appendChild(sharedStyleEl)
  }

  // Only append if it’s not already in the sheet
  if (!sharedStyleEl.textContent.includes(css.trim())) {
    sharedStyleEl.textContent += '\n' + css.trim()
  }
}

export function isoToReadable(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const options = isThisYear
    ? { month: 'short', day: '2-digit' }
    : { month: 'long', day: '2-digit', year: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}

export const navList = [
  {
    icon: 'fa-house',
    label: 'home',
    url: 'home/index.html',
    id: 'home',
  },
  {
    icon: 'fa-list-check',
    label: 'Tasks',
    url: 'tasks/index.html',
    id: 'tasks',
  },
  {
    icon: 'fa-cake-candles',
    label: 'Recipes',
    url: 'recipes/index.html',
    id: 'recipes',
  },
  {
    icon: 'fa-cart-shopping',
    label: 'Shop',
    url: 'shopping/index.html',
    id: 'shopping',
  },
  {
    icon: 'fa-note-sticky',
    label: 'Notes',
    url: 'notes/index.html',
    id: 'notes',
  },
  {
    icon: 'fa-spell-check',
    label: 'Lexicon',
    url: 'lexicon/index.html',
    id: 'lexicon',
  },
  {
    icon: 'fa-book',
    label: 'Books',
    url: 'books/index.html',
    id: 'books',
  },
  {
    icon: 'fa-road',
    label: 'Journal',
    url: 'journal/index.html',
    id: 'journal',
  },
  {
    icon: 'fa-gear',
    label: 'Settings',
    url: 'settings/index.html',
    id: 'settings',
  },
]

export function setMessage(
  message = '',
  {
    className,
    type = 'message',
    showProgress = true,
    autoClose = 3000,
    position = 'BOTTOM_RIGHT',
  } = {}
) {
  if (!message) {
    // user wishes to clear all toasts
    removeToasts()
    return
  }

  function _createWarnMessage(message) {
    const iconEl = createIcon({ className: 'fa-circle-exclamation' })
    const el = createSpan()
    el.appendChild(iconEl)
    el.appendChild(document.createTextNode(message))
    return el
  }

  switch (type) {
    case 'danger':
      removeToasts()
      message = _createWarnMessage(message)
      className = 'danger'
      autoClose = null
      break
    case 'quiet':
      removeToasts()
      className = 'quiet'
      showProgress = false
      break
    case 'warn':
      message = _createWarnMessage(message)
      className = 'warn'
      break
  }

  const toast = createToast({
    message,
    className,
    autoClose,
    showProgress,
    position,
  })

  document.querySelector('body').appendChild(toast)
}

export function toggleExpander(e) {
  // arrives from eventhandler or from a link click
  const el = e.target || e
  el.classList.toggle('fa-chevron-left')
  el.classList.toggle('fa-chevron-right')
  const group = el.closest('.group')
  group.classList.toggle('collapsed')

  group.querySelectorAll('i').forEach((i) => {
    if (i !== el) {
      i.classList.toggle('hidden')
    }
  })
}
