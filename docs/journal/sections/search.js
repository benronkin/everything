import { createSearch } from '../../_partials/search.js'

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function search() {
  const el = createSearch({
    iconClass: 'fa-magnifying-glass',
    placeholder: 'Search journals',
    // searchCb: searchJournal,
    // searchResultsCb: handleSearchResult,
  })
  return el
}
