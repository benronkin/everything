import { JSDOM } from 'jsdom'

const dom = new JSDOM(`<!DOCTYPE html><body class="dark-mode"></body>`)
global.window = dom.window
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement
