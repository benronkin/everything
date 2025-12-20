/* global markdownit */

import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createTextarea } from '../partials/textarea.js'

const css = `
.markdown-icons {
  display: flex;
}
`

export function createMarkdown({ name, iconsVisible = true }) {
  injectStyle(css)

  const el = document.createElement('div')
  el.className = 'markdown-wrapper'

  el.updateViewer = updateViewer.bind(el)
  el.resetIcons = resetIcons.bind(el)
  el.toggle = toggle.bind(el)

  build({ el, name, iconsVisible })
  listen({ el, iconsVisible })

  if (iconsVisible) el.resetIcons()
  return el
}

function build({ el, name, iconsVsible }) {
  el.appendChild(createDiv({ className: 'markdown-viewer' }))
  el.appendChild(
    createTextarea({ className: 'markdown-editor field hidden', name })
  )

  if (iconsVsible) {
    const icons = createDiv({
      className: 'markdown-icons',
      html: [
        createIcon({ classes: { primary: 'fa-pencil primary' } }),
        createIcon({ classes: { primary: 'fa-check primary' } }),
        createIcon({ classes: { primary: 'fa-close primary' } }),
      ],
    })

    el.appendChild(icons)
  }
}

function listen({ el, iconsVisible }) {
  if (iconsVisible) {
    el.addEventListener('mouseover', () => {
      el.querySelector('.markdown-icons').classList.remove('hidden')
    })

    el.addEventListener('mouseout', () => {
      if (!el.querySelector('.markdown-editor').classList.contains('hidden'))
        return

      el.querySelector('.markdown-icons').classList.add('hidden')
    })

    el.querySelector('.fa-pencil').addEventListener('click', () => {
      el.querySelector('.fa-pencil').classList.add('hidden')
      el.querySelector('.fa-check').classList.remove('hidden')
      el.querySelector('.fa-close').classList.remove('hidden')

      const editor = el.querySelector('.markdown-editor')
      editor.dataset.old = editor.value
      el.toggle()
    })

    el.querySelector('.fa-check').addEventListener('click', () => {
      el.toggle()
      el.resetIcons()
    })

    el.querySelector('.fa-close').addEventListener('click', () => {
      el.toggle()
      const editor = el.querySelector('.markdown-editor')
      editor.value = editor.dataset.old || ''
      el.resetIcons()
    })
  }
}

function toggle() {
  const viewer = this.querySelector('.markdown-viewer')
  const editor = this.querySelector('.markdown-editor')
  if (viewer.classList.contains('hidden')) {
    viewer.classList.remove('hidden')
    editor.classList.add('hidden')
  } else {
    viewer.classList.add('hidden')
    editor.classList.remove('hidden')
    editor.focus()
  }
}

function updateViewer() {
  const viewer = this.querySelector('.markdown-viewer')

  if (typeof window.markdownit !== 'function') {
    const errorMsg = `
            markDown error: markdown-it library is missing. 
            Ensure <script src="../assets/js/markdown-it.js"></script>
            is included in your HTML before this component.
        `
    console.error(errorMsg)
    viewer.innerHTML = errorMsg
    return
  }

  // function updateEditor(content) {
  //   const editor = this.querySelector('.markdown-editor')
  //   editor.value = content
  // }

  const markdown = this.querySelector('.markdown-editor').value

  const md = markdownit({
    html: true,
    linkify: true,
  })
  const content = md.render(markdown)

  viewer.innerHTML = content
}

function resetIcons() {
  const icons = this.querySelector('.markdown-icons')
  icons.querySelector('.fa-pencil').classList.remove('hidden')
  icons.querySelector('.fa-check').classList.add('hidden')
  icons.querySelector('.fa-close').classList.add('hidden')
  icons.classList.add('hidden')
}
