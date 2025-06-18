import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createPeer } from '../../assets/partials/peer.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.peer-group {
  flex: 0 0 auto;           /* don’t shrink */
  display: flex;
  gap: 4px;
}

`

export function createPeerGroup({ id, className = '', peers } = {}) {
  injectStyle(css)

  className = `peer-group ${className}`.trim()
  const el = createDiv({ className, id })

  build({ el, peers })

  return el
}

function build({ el, peers }) {
  const peersToShow = peers.slice(0, 3)
  peersToShow.forEach((p) => el.appendChild(createPeer({ name: p.name })))

  if (peers.length > 3) {
    el.appendChild(
      createDiv({
        className: 'peer more',
        html: `+${peers.length - 3}`,
      })
    )
  }
}
