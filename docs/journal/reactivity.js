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
    // journal fields
    {
      selector: '[data-id="journal-notes"]',
      trnasform: (doc) => {
        doc.notes
      },
    },
    {
      selector: '[data-id="journal-city"]',
      trnasform: (doc) => {
        doc.city
      },
    },
    {
      selector: '[data-id="journal-state"]',
      trnasform: (doc) => {
        doc.state
      },
    },
    {
      selector: '[data-id="journal-country"]',
      trnasform: (doc) => {
        doc.country
      },
    },
    {
      selector: '[data-id="journal-id"]',
      trnasform: (doc) => {
        doc.id
      },
    },
    {
      selector: '[data-id="photo-entry-id"]',
      trnasform: (doc) => {
        doc.id
      },
    },
    {
      selector: '[data-id="image-gallery"]',
      trnasform: () => {
        ''
      },
    },

    // delete.js
    { selector: '#danger-zone-header', transform: () => 'Delete entry' },
    {
      selector: '#modal-delete-header',
      transform: () => 'Delete entry',
    },
    {
      selector: '#modal-delete-body',
      transform: (doc) => {
        return createEntryTitle(doc.location, doc.visit_date)
      },
    },
  ])
}
