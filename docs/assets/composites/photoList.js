import { injectStyle } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { state } from '../../assets/js/state.js'
import { createPhotoItem } from './photoItem.js'

const css = `
`

export function photoList() {
  injectStyle(css)

  const el = createList({
    id: 'photo-list',
  })

  listen(el)

  return el
}

function listen(el) {
  state.on('photos-metadata', 'photoList', (resp) => {
    const { error, photos } = resp

    if (error) {
      console.error(`photoList.js received server error: `, error)
      return
    }

    el.deleteChildren()

    const children = photos.map((photo) =>
      createPhotoItem({
        id: photo.id,
        imgSrc: photo.url,
        caption: photo.caption,
      }),
    )

    el.addChildren(children)
    console.log('children.length', children.length)
  })
}
