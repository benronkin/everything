import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createAvatar } from './avatar.js'
import { createIcon } from './icon.js'

const css = `
.avatar-group {
  display: flex;
  flex: 0 0 auto;           /* don’t shrink */
  gap: 4px;
  align-items: center;
}
`

export function createAvatarGroup({
  id,
  className = '',
  peers,
  showShare = false,
} = {}) {
  injectStyle(css)

  className = `avatar-group ${className}`.trim()
  const el = createDiv({ className, id })

  build({ el, peers, showShare })

  return el
}

function build({ el, peers = [], showShare }) {
  const peersToShow = peers.slice(0, 3)

  for (const p of peersToShow) {
    const avatar = createAvatar({ name: p.name, url: p.url })
    el.appendChild(avatar)
  }

  if (peers?.length > 3) {
    el.appendChild(
      createDiv({
        className: 'peer more',
        html: `+${peers.length - 3}`,
      }),
    )
  }

  if (showShare)
    el.appendChild(
      createIcon({
        classes: {
          primary: 'fa-arrow-up-right-from-square',
          other: ['secondary', 'sharer'],
        },
        dataset: {
          role: 'sharer',
        },
      }),
    )
}
