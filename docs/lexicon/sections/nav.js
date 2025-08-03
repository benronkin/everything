import { state } from '../../assets/js/state.js'
import { createNav, handleBrandClick } from '../../assets/composites/nav.js'
import { navList } from '../../assets/js/ui.js'
import { fetchRecentEntries } from '../lexicon.api.js'

export function nav() {
  const { icon, label } = navList.find((i) => i.id === 'lexicon')

  const el = createNav({
    title: `<i class="fa-solid ${icon}"></i> ${label}`,
  })

  listen(el)

  return el
}

function listen(el) {
  const brand = el.querySelector('.brand')

  brand.removeEventListener('click', handleBrandClick)

  brand.addEventListener('click', async () => {
    document.querySelector('#new-entry-wrapper').classList.add('hidden')
    document.querySelector('[name="search-lexicon"').value = ''

    const { entries } = await fetchRecentEntries()

    entries.forEach((e) => {
      e.senses = JSON.parse(e.senses)
    })

    state.set('main-documents', entries)
    state.set('active-doc', null)
    state.set('app-mode', 'left-panel')
  })
}
