import { injectStyle } from '../js/ui.js'
import { createList } from '../partials/list.js'
import { state } from '../js/state.js'
import { createMediaItem } from './mediaItem.js'

const css = `
`

export function mediaList() {
  injectStyle(css)

  const el = createList({
    id: 'media-list'
  })

  listen(el)

  return el
}

function listen(el) {
  state.on('media-metadata', 'mediaList', (resp) => {
    const { error, media } = resp

    if (error) {
      console.error(`mediaList.js received server error: `, error)
      return
    }

    el.deleteChildren()

    const children = media.map((m) =>
      createMediaItem({
        id: m.id,
        src: m.url,
        caption: m.caption,
        mediaType: m.media_type
      })
    )

    el.addChildren(children)
  })
}
