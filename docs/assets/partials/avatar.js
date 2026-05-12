import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createImage } from './image.js'

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

export function createAvatar(doc) {
  injectStyle(css)

  const { className = '', name, url, id } = doc

  const el = url
    ? createImage({ src: url, className: 'avatar' })
    : createDiv({
        className: 'avatar',
        html: name ? name[0].toUpperCase() : 'U',
      })

  el.style.backgroundColor = doc.color

  if (className.length) {
    for (const c of className.split(' ')) {
      el.classList.add(c)
    }
  }

  if (id) {
    el.id = id
    el.dataset.avatar = id
  }

  return el
}
