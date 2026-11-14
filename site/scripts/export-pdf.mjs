// Exports chapters to PDF (one slide per page, vector text, animations in their final state).
//   pnpm -C site export              every chapter + one merged file
//   pnpm -C site export ch04 ch13    only these chapters
//   pnpm -C site export --no-merge   skip the merged file
// Output: site/export/
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'export')

// Playwright may be installed here, in the repo root (Slidev's playwright-chromium), or globally.
function loadChromium() {
  const bases = [path.join(root, 'package.json'), path.join(root, '..', 'package.json'), import.meta.url]
  for (const base of bases) {
    for (const name of ['playwright', 'playwright-chromium']) {
      try { return createRequire(base)(name).chromium }
      catch {}
    }
  }
  console.error('找不到 Playwright。請在專案根目錄執行 `pnpm install`（會安裝 playwright-chromium），再重試。')
  process.exit(1)
}

const args = process.argv.slice(2)
const only = args.filter(a => /^ch\d+$/.test(a))
const merge = !args.includes('--no-merge')
const safe = s => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim()

const chromium = loadChromium()
const server = await createServer({ root, logLevel: 'error', server: { port: 0, host: '127.0.0.1' } })
await server.listen()
const address = server.httpServer.address()
const base = `http://127.0.0.1:${address.port}/`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
fs.mkdirSync(outDir, { recursive: true })

try {
  await page.goto(base)
  await page.waitForSelector('.card')
  const chapters = await page.$$eval('.card', els => els.map(a => ({
    id: a.getAttribute('href').match(/ch\d+/)[0],
    title: a.querySelector('strong').textContent,
  })))
  const todo = chapters.filter(c => !only.length || only.includes(c.id))
  if (!todo.length) { console.error('沒有符合的章節。'); process.exitCode = 1 }

  const files = []
  for (const ch of todo) {
    await page.goto('about:blank')
    await page.goto(`${base}#/print/${ch.id}`)
    await page.waitForFunction(() => window.__printReady === true, null, { timeout: 180000 })
    const pages = await page.locator('.print-page').count()
    const file = path.join(outDir, `${ch.id}-${safe(ch.title)}.pdf`)
    await page.pdf({ path: file, width: '980px', height: '552px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
    files.push(file)
    console.log(`${ch.id}  ${String(pages).padStart(3)} 頁  ${path.relative(root, file)}`)
  }

  if (merge && files.length > 1) {
    const all = await PDFDocument.create()
    for (const f of files) {
      const doc = await PDFDocument.load(fs.readFileSync(f))
      for (const p of await all.copyPages(doc, doc.getPageIndices())) all.addPage(p)
    }
    const merged = path.join(outDir, only.length ? 'selected-chapters.pdf' : 'spring-boot-masterclass.pdf')
    fs.writeFileSync(merged, await all.save())
    console.log(`合併  ${String(all.getPageCount()).padStart(3)} 頁  ${path.relative(root, merged)}`)
  }
}
finally {
  await browser.close()
  await server.close()
}
