// Visits every slide and reports the ones whose content had to be shrunk to fit, still overflows,
// or logged an error. Usage: start `pnpm dev`, then `pnpm audit [baseUrl] [chNN ...]`.
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const args = process.argv.slice(2)
const base = args.find(a => a.startsWith('http')) ?? 'http://127.0.0.1:3040/'
const only = args.filter(a => /^ch\d+$/.test(a))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
let where = ''
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${where}: ${m.text()}`) })
page.on('pageerror', e => errors.push(`${where}: ${e.message}`))

await page.goto(base)
await page.waitForSelector('.card')
const chapters = await page.$$eval('.card', els => els.map(a => a.getAttribute('href').match(/ch\d+/)[0]))
const rows = []
let total = 0

for (const ch of chapters) {
  if (only.length && !only.includes(ch)) continue
  await page.goto(`${base}#/${ch}/1`)
  await page.waitForSelector('.slide-inner')
  const count = Number((await page.textContent('.counter small')).replace(/\D/g, ''))
  for (let n = 1; n <= count; n++) {
    where = `${ch}/${n}`
    if (n > 1) await page.keyboard.press('ArrowRight')
    await page.waitForFunction(n => location.hash.endsWith(`/${n}`), n)
    await page.waitForTimeout(60)
    const r = await page.evaluate(async () => {
      await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r })))
      await new Promise(r => setTimeout(r, 40))
      const el = document.querySelector('.slide-inner')
      return {
        fit: Number(el.style.zoom || 1),
        overY: el.scrollHeight / el.clientHeight,
        overX: el.scrollWidth / el.clientWidth,
        broken: [...document.querySelectorAll('.slide img')].filter(i => !i.naturalWidth).length,
        error: !!document.querySelector('.slide-error'),
      }
    })
    total++
    if (r.fit < 0.999 || r.overY > 1.01 || r.overX > 1.01 || r.broken || r.error) rows.push({ slide: where, ...r })
  }
}
await browser.close()

const fmt = r => `${r.slide.padEnd(10)} fit=${r.fit.toFixed(2)} overY=${r.overY.toFixed(2)} overX=${r.overX.toFixed(2)}${r.broken ? ` brokenImg=${r.broken}` : ''}${r.error ? ' COMPILE-ERROR' : ''}`
const shrunk = rows.filter(r => r.fit < 0.999)
console.log(`slides checked: ${total}`)
console.log(`shrunk to fit: ${shrunk.length} (below 0.8: ${shrunk.filter(r => r.fit < 0.8).length}, below 0.65: ${shrunk.filter(r => r.fit < 0.65).length})`)
console.log(`still overflowing: ${rows.filter(r => r.overY > 1.01 || r.overX > 1.01).length}`)
console.log(`broken images: ${rows.filter(r => r.broken).length}, compile errors: ${rows.filter(r => r.error).length}, console errors: ${errors.length}`)
console.log('\n--- details (smallest fit first) ---')
for (const r of rows.sort((a, b) => a.fit - b.fit)) console.log(fmt(r))
if (errors.length) console.log(`\n--- console ---\n${[...new Set(errors)].slice(0, 40).join('\n')}`)
