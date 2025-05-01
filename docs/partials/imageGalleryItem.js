// -------------------------------
// Globals
// -------------------------------

const elString = `
<div class="flex">
  <div class="i-group collapsed">
  <i class="i-group-expander fa-solid fa-chevron-left collapsed"></i>
  <i class="fa-solid fa-trash hidden"></i>
  </div>
  <span class="photo-message"></span>
</div>
<img class="journal-photo"/>
<input type="text" />
`

// -------------------------------
// Exported functions
// -------------------------------

export function createImageGalleryItem({ id, imgSrc, caption, expanderCb, inputCb, trashCb } = {}) {
  const el = document.createElement('div')
  el.dataset.id = id
  el.classList.add('image-gallery-item')
  el.classList.add('container-wide')
  el.innerHTML = elString
  el.querySelector('img').src = imgSrc
  el.querySelector('input').value = caption

  // Event handlers

  el.querySelector('.i-group-expander').addEventListener('click', expanderCb)
  el.querySelector('.fa-trash').addEventListener('click', trashCb)
  el.querySelector('input').addEventListener('change', inputCb)

  return el
}
