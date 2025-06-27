import { state } from '../../js/state.js'

export function listen(el) {
  const tb = el.querySelector('.rte-toolbar')

  tb.querySelector('.fa-code').addEventListener('click', handleCode)
}

function handleCode() {
  const editor = document.querySelector('.rte-editor')
  const isHtml = editor.dataset.mode === 'html'

  if (isHtml) {
    const html = editor.innerHTML
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/g, '>')
      .replace(/<br>/g, '')
    editor.innerHTML = html
    editor.dataset.mode = 'rich'
  } else {
    const text = editor.innerHTML
      .replace(/</gi, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&lt;\/div&gt;/g, '&lt;/div&gt;<br>')
    editor.innerHTML = text
    editor.dataset.mode = 'html'
  }
}
