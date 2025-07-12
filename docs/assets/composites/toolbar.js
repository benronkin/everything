import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#toolbar {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 20px 0;
  gap: 20px;
  align-items: center;
  width: 100%;
}
#toolbar.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--gray0);
  border-bottom: 1px solid var(--gray1);
  margin-top: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* optional */
}
#toolbar .container .icons {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  border: 1px dotted var(--gray1);
  border-radius: 10px;
    padding: 4px 10px;

  box-sizing: content-box;
  font-size: 1.1rem;
  transition: all 200ms ease;
}
#toolbar i {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}  
`

// -------------------------------
// Exported functions
// -------------------------------

export function createToolbar({ children = [], classes = {} } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  build({ el, classes, children })
  listen(el)

  el.id = 'toolbar'
  el.dataset.id = 'toolbar'
  el.dataset.testId = 'toolbar'

  return el
}

// -------------------------------
// Constructor
// -------------------------------

/**
 * Create the HTML element.
 */
function build({ el, children, classes }) {
  const containerEl = createDiv()
  containerEl.className = 'container'
  el.appendChild(containerEl)

  const divEl = createDiv()
  containerEl.appendChild(divEl)

  for (const child of children) {
    divEl.appendChild(child)
  }

  classes.other || (classes.other = ['icons'])
  for (const c of classes.other) {
    divEl.classList.add(c)
  }
  classes.primary && divEl.classList.add(classes.primary)
}

function listen(el) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      document.querySelector('.columns-wrapper').style.marginTop = '80px'
      el.classList.add('sticky')
    } else {
      el.classList.remove('sticky')
      document.querySelector('.columns-wrapper').style.marginTop = 0
    }
  })
}
