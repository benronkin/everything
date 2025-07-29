import { createFooter } from '../../assets/composites/footer.js'
import { injectStyle } from '../../assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
footer {
position: absolute;
bottom: 0;
left: 0;
right: 0;
}
`

export function footer() {
  injectStyle(css)

  const el = createFooter()

  return el
}
