// -------------------------------
// Globals
// -------------------------------

const elString = `
<div class="i-group collapsed">
  <i class="i-group-expander fa-solid fa-chevron-left collapsed"></i>
  <i class="fa-solid fa-trash hidden"></i>
</div>
<img class="journal-photo"/>
<input type="text" />
`

// -------------------------------
// Exported functions
// -------------------------------

export function createImageGalleryItem({ imgSrc, caption, expanderCb, inputCb } = {}) {
  const el = document.createElement('div')
  el.classList.add('image-gallery-item')
  el.classList.add('container-wide')
  el.innerHTML = elString
  el.querySelector('img').src = imgSrc
  el.querySelector('input').value = caption

  // Event handlers

  el.querySelector('.i-group-expander').addEventListener('click', expanderCb)
  el.querySelector('input').addEventListener('change', inputCb)

  return el
}
