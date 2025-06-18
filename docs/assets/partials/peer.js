import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.peer {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: var(--gray1);
  font-weight: 700;
}
`

export function createPeer({ id, className = '', name } = {}) {
  injectStyle(css)

  className = `peer ${className}`.trim()
  const html = name.startsWith('+') ? name : name[0].toUpperCase()
  const el = createDiv({ className, id, html })
  el.title = name

  setPeerStyle(el)

  return el
}

function setPeerStyle(el) {
  const peers = JSON.parse(localStorage.getItem('peers') || '{}')

  const name = el.title
  if (name.startsWith('+')) {
    el.style.backgroundColor = `#333333`
    return
  }

  if (peers[name]) {
    el.style.backgroundColor = `var(${peers[name]})`
    return
  }

  const allColors = [
    '--pastel-red',
    '--pastel-yellow',
    '--pastel-green',
    '--pastel-blue',
    '--pastel-orange',
    '--pastel-indigo',
    '--pastel-lime',
    '--pastel-teal',
    '--pastel-cyan',
    '--pastel-purple',
    '--pastel-pink',
    '--pastel-gray',
  ]

  const usedColors = Object.values(peers)
  for (const color of allColors) {
    if (!usedColors.includes(color)) {
      el.style.backgroundColor = `var(${color})`
      peers[name] = color
      localStorage.setItem('peers', JSON.stringify(peers))
      return
    }
  }

  el.style.backgroundColor = `#333333`
}
