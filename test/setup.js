import { JSDOM } from 'jsdom'

const dom = new JSDOM(`<!DOCTYPE html><body></body>`)
global.window = dom.window
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement
