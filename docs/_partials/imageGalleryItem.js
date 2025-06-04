import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.journal-photo {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 10px;
}
.i-group {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: var(--gray1);
  border: 1px solid var(--gray3);
  border-radius: 10px;
  padding: 6px 10px;
  width: max-content;
  font-size: 1.1rem;
  transition: all 200ms ease;
}
`

const html = `
<div class="flex">
  <div class="i-group collapsed">
  <i class="i-group-expander fa-solid fa-chevron-left collapsed"></i>
  <i class="fa-solid fa-trash hidden"></i>
  </div>
  <span class="photo-message"></span>
</div>
<img />
<input type="text" />
`

// -------------------------------
// Exported functions
// -------------------------------

export function createImageGalleryItem({
  id,
  imgSrc,
  caption,
  expanderCb,
  inputCb,
  trashCb,
}) {
  injectStyle(css)

  const el = document.createElement('div')
  el.dataset.id = id
  el.innerHTML = html
  el.classList.add('image-gallery-item')
  el.classList.add('container')
  el.querySelector('img').src = imgSrc
  el.querySelector('input').value = caption

  // Event handlers

  // el.querySelector('.i-group-expander').addEventListener('click', expanderCb)
  // el.querySelector('.fa-trash').addEventListener('click', trashCb)
  // el.querySelector('input').addEventListener('change', inputCb)

  return el
}
