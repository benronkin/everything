/*
 This module is used to register callbacks for 
 partials that are influenced by state. It can be 
 called before or after partial construction, as it 
 is not involved in construction, but definitely before
 setting state variables that fire these callbacks.
*/

import { createEntryTitle } from './events.js'
import { newState } from '../js/newState.js'

/**
 *
 */
export function makeReactive() {
  newState.makeReactive('active-doc', [
    { selector: '#danger-zone-header', transform: () => 'Delete entry' },
    {
      selector: '#modal-delete-header',
      transform: () => 'Delete entry',
    },
    {
      selector: '#modal-delete-body',
      transform: () => {
        const { location, visit_date } = newState.get('active-doc')
        return createEntryTitle(location, visit_date)
      },
    },
  ])
}
