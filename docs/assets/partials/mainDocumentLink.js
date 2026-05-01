import { injectStyle } from '../js/ui.js'
import { createAnchor } from './anchor.js'

const css = `
.md-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 4px;
  padding: 4px 14px;
  transition: all 0.3s ease-in-out;;
}
.md-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.md-item i {
  color: inherit;
}
.md-item span {
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}  
`

export function createMainDocumentLink({ id, html, url } = {}) {
  injectStyle(css)

  const el = createAnchor({
    id,
    url,
    className: 'md-item',
    html: '',
  })

  for (const h of html) {
    el.appendChild(h)
  }

  return el
}
