import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createImage } from './image.js'
import { handlRightDrawerState } from '../js/ui.js'
import { createNavigationMenu } from '../composites/navigationMenu.js'
import { state } from '../js/state.js'

const css = `
.avatar {  
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  font-weight: 700;
  border: 1px solid #e5e5e5;
}
div.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray1);
}
`
/**
 * bgColor may arrive from server using join or via client.
 * Avatar can either accept bgColor in doc or try to get it,
 * from users
 */
export function createAvatar(doc) {
  injectStyle(css)

  const { className = '', name, url, id } = doc

  const el = url
    ? createImage({ src: url, className: 'avatar' })
    : createDiv({
        className: 'avatar',
        html: name ? name[0].toUpperCase() : 'U',
      })

  el.dataset.color = doc.bgColor

  react(el, doc)
  listen(el)

  if (className.length) {
    for (const c of className.split(' ')) {
      el.classList.add(c)
    }
  }
  id && (el.id = id)

  return el
}

/**
 *
 */
function react(el, doc) {
  const users = state.get('users')
  if (users) {
    setBackgroundColor(el, doc, users)
  } else {
    state.on('users', 'avatar', (users) => {
      setBackgroundColor(el, doc, users)
    })
  }
}

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {
    const active = state.get('default-page')
    handlRightDrawerState('navigation-menu')
    createNavigationMenu({
      container: document.getElementById('right-drawer'),
      active,
    })
  })
}

/**
 *
 */
function setBackgroundColor(el, doc, users) {
  const { name } = doc

  if (el.dataset.color !== 'undefined') {
    el.style.backgroundColor = el.dataset.color
    return
  }

  const user = users.find((u) => u.first_name === name)
  const color = user.color
  el.style.backgroundColor = color
}
