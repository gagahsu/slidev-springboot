import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import MarkdownIt from 'markdown-it'
import cjkFriendly from 'markdown-it-cjk-friendly'
import { createHighlighter, type Highlighter } from 'shiki'
import { compile } from '@vue/compiler-dom'
import { plain, slideTitle, splitSlides, type RawSlide } from './parse.ts'

const LANGS = ['java', 'typescript', 'javascript', 'html', 'css', 'scss', 'properties', 'bash', 'json', 'groovy', 'xml', 'sql', 'yaml', 'powershell']
const CODE_THEME = 'github-light'
const KNOWN_COMPONENTS = new Set(['Link', 'Mermaid', 'v-clicks', 'v-click', 'StepCode', 'CodeSteps', 'Flow', 'IocDemo', 'HttpExchange', 'Poll', 'Art', 'LifeIoc', 'Pairs', 'DrinkShop', 'PickPrinter', 'StoreOpening', 'NoticeBoard', 'Counter', 'AspectTimeline', 'ShopLayout', 'UrlParts', 'Dispatch', 'CupLabel', 'AskOrOrder', 'FileRoom', 'SqlSlip', 'RowCards', 'TwoBooks', 'SeatRace', 'PaperTrail', 'FormCheck', 'SessionTag', 'RateDelay', 'StickyNote', 'GateGuard', 'PassCard', 'Campus', 'Breaker', 'LinkTables'])

/** Old Slidev palette (hard-coded in inline styles) → theme tokens. */
const PALETTE: Record<string, string> = {
  '#5eada0': 'var(--c-brand)',
  '#1a5c5c': 'var(--c-ink)',
  '#a7d9d0': 'var(--c-brand-soft)',
  '#4a7c7c': 'var(--c-ink-soft)',
  '#9dc4c4': 'var(--c-muted)',
}

interface Chapter {
  id: string
  num: number
  file: string
  mtime: number
  slides: RawSlide[]
  title: string
  subtitle: string
  code?: string
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default function deck(opts: { contentDir: string }): Plugin {
  const contentDir = path.resolve(opts.contentDir)
  let config: ResolvedConfig
  let highlighter: Highlighter
  let md: MarkdownIt
  const chapters = new Map<string, Chapter>()
  let cards: Record<string, { title: string, subtitle: string }> = {}

  const V = 'virtual:deck'
  const V_SEARCH = 'virtual:deck-search'
  const V_CH = 'virtual:deck-chapter:'

  function readCards() {
    cards = {}
    const file = path.join(contentDir, 'index.md')
    if (!fs.existsSync(file)) return
    const src = fs.readFileSync(file, 'utf8')
    const re = /<Link to="(ch\d+)"[^>]*>\s*<div class="chapter-num">[\s\S]*?<\/div>\s*<div>([\s\S]*?)<\/div>\s*<div class="chapter-subtitle">([\s\S]*?)<\/div>/g
    for (const m of src.matchAll(re))
      cards[m[1]] = { title: plain(m[2]), subtitle: plain(m[3]) }
  }

  function scan() {
    readCards()
    const seen = new Set<string>()
    for (const name of fs.readdirSync(contentDir).sort()) {
      const m = name.match(/^(\d{2})-.+\.md$/)
      if (!m) continue
      const id = `ch${m[1]}`
      seen.add(id)
      const file = path.join(contentDir, name)
      const mtime = fs.statSync(file).mtimeMs
      const prev = chapters.get(id)
      if (prev && prev.mtime === mtime && prev.file === file) {
        prev.title = cards[id]?.title || prev.title
        prev.subtitle = cards[id]?.subtitle ?? ''
        continue
      }
      const slides = splitSlides(fs.readFileSync(file, 'utf8'))
      chapters.set(id, {
        id,
        num: Number(m[1]),
        file,
        mtime,
        slides,
        title: cards[id]?.title || String(slides[0]?.frontmatter.title ?? name),
        subtitle: cards[id]?.subtitle ?? '',
      })
    }
    for (const id of [...chapters.keys()]) if (!seen.has(id)) chapters.delete(id)
  }

  const layoutOf = (s: RawSlide, i: number) => String(s.frontmatter.layout ?? (i === 0 ? 'cover' : 'default'))

  function setupMarkdown() {
    // cjk-friendly: `**粗體（註）**的` style emphasis next to full-width punctuation renders as bold
    md = new MarkdownIt({ html: true, linkify: true, breaks: false }).use(cjkFriendly)
    md.renderer.rules.code_inline = (tokens, idx) => `<code v-pre>${esc(tokens[idx].content)}</code>`
    md.renderer.rules.code_block = (tokens, idx) => `<div class="code-block"><pre v-pre><code>${esc(tokens[idx].content)}</code></pre></div>\n`
    md.renderer.rules.fence = (tokens, idx) => {
      const token = tokens[idx]
      const lang = token.info.trim().split(/[\s{]/)[0].toLowerCase()
      const code = token.content.replace(/\n$/, '')
      if (lang === 'mermaid')
        return `<Mermaid code="${encodeURIComponent(code)}" />\n`
      const useLang = LANGS.includes(lang) ? lang : 'text'
      const html = highlighter.codeToHtml(code, { lang: useLang, theme: CODE_THEME })
        .replace('<pre ', '<pre v-pre ')
        .replace(/ tabindex="0"/, '')
        // lines are block elements in our CSS, so drop the newlines between them
        .replace(/<\/span>\n<span class="line">/g, '</span><span class="line">')
      const label = lang && lang !== 'text' ? `<span class="code-lang">${esc(lang)}</span>` : ''
      const block = `<div class="code-block" data-lang="${esc(lang)}">${label}${html}</div>`
      // ```java {1|3-4|all}  → line highlights that advance with each step (Slidev-compatible syntax)
      const steps = token.info.match(/\{([^}]*)\}/)?.[1].trim()
      return steps ? `<StepCode steps="${esc(steps)}">${block}</StepCode>\n` : `${block}\n`
    }
    const defaultLinkOpen = md.renderer.rules.link_open ?? ((t, i, o, _e, self) => self.renderToken(t, i, o))
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const href = tokens[idx].attrGet('href') ?? ''
      if (/^https?:/.test(href)) {
        tokens[idx].attrSet('target', '_blank')
        tokens[idx].attrSet('rel', 'noopener')
      }
      return defaultLinkOpen(tokens, idx, options, env, self)
    }
  }

  function renderHtml(s: RawSlide, layout: string): string {
    let html: string
    if (layout === 'two-cols') {
      const [left, right = ''] = s.content.split(/^::right::\s*$/m)
      html = `<div class="col col-left">${md.render(left)}</div><div class="col col-right">${md.render(right)}</div>`
    }
    else {
      html = md.render(s.content.replace(/^::\w+::\s*$/gm, ''))
    }
    // old palette in inline styles → theme tokens
    html = html.replace(/style="[^"]*"/g, m => m.replace(/#[0-9a-fA-F]{6}\b/g, c => PALETTE[c.toLowerCase()] ?? c))
    // public assets respect the deploy base
    html = html.replace(/(\s(?:src|href))="\/(?!\/)/g, `$1="${config.base}`)
    // tables scroll/round nicely inside a wrapper
    html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
    return html
  }

  function compileChapter(ch: Chapter): string {
    const imports = new Set<string>()
    const bodies: string[] = []
    const metas: any[] = []
    let section = 0
    ch.slides.forEach((s, i) => {
      const layout = layoutOf(s, i)
      if (layout === 'section') section++
      let html = renderHtml(s, layout)
      const errors: string[] = []
      let result = compile(html, { mode: 'module', hoistStatic: true, onError: e => errors.push(e.message), onWarn: () => {} })
      const unknown = (result.ast.components ?? []).filter(c => !KNOWN_COMPONENTS.has(c))
      if (errors.length || unknown.length) {
        const why = errors.length ? errors.join('; ') : `unknown component <${unknown.join('>, <')}>`
        this_warn(`${path.basename(ch.file)} slide ${i + 1}: ${why}`)
        html = `<div class="slide-error"><b>這一頁無法編譯</b><pre v-pre>${esc(why)}</pre></div><div v-pre>${html.replace(/<(\/?)([A-Z][\w-]*)/g, '&lt;$1$2')}</div>`
        result = compile(html, { mode: 'module', hoistStatic: true, onError: () => {}, onWarn: () => {} })
      }
      let code = result.code
      code = code.replace(/^import \{([^}]+)\} from "vue"\s*$/gm, (_m, names: string) => {
        names.split(',').map(n => n.trim()).filter(Boolean).forEach(n => imports.add(n))
        return ''
      })
      code = code
        .replace(/\b_hoisted_(\d+)\b/g, `_h${i}_$1`)
        .replace(/export function render\(/, `function render_${i}(`)
      bodies.push(code)
      metas.push({
        layout,
        class: typeof s.frontmatter.class === 'string' ? s.frontmatter.class : '',
        title: slideTitle(s),
        note: s.note,
        section: layout === 'section' ? section : 0,
      })
    })
    return [
      `import { ${[...imports].join(', ')} } from "vue"`,
      ...bodies,
      `export default [`,
      ...metas.map((m, i) => `  { index: ${i}, ...${JSON.stringify(m)}, render: render_${i} },`),
      `]`,
    ].join('\n')
  }

  let this_warn = (msg: string) => console.warn(`[deck] ${msg}`)

  function manifestCode(): string {
    scan()
    const list = [...chapters.values()].sort((a, b) => a.num - b.num).map(ch => ({
      id: ch.id,
      num: ch.num,
      title: ch.title,
      subtitle: ch.subtitle,
      count: ch.slides.length,
      outline: ch.slides.map((s, i) => ({ t: slideTitle(s), l: layoutOf(s, i) })),
    }))
    return [
      `export const chapters = ${JSON.stringify(list)}`,
      `export const loaders = {`,
      ...list.map(c => `  ${JSON.stringify(c.id)}: () => import(${JSON.stringify(V_CH + c.id)}),`),
      `}`,
    ].join('\n')
  }

  function searchCode(): string {
    scan()
    const docs: any[] = []
    for (const ch of [...chapters.values()].sort((a, b) => a.num - b.num)) {
      ch.slides.forEach((s, i) => {
        const t = slideTitle(s)
        docs.push({ c: ch.id, i, t, x: plain(s.content) })
      })
    }
    return `export default ${JSON.stringify(docs)}`
  }

  return {
    name: 'deck',
    configResolved(c) { config = c },
    async buildStart() {
      highlighter ??= await createHighlighter({ themes: [CODE_THEME], langs: LANGS })
      if (!md) setupMarkdown()
      this_warn = msg => this.warn(msg)
      scan()
    },
    configureServer(server) {
      server.watcher.add(path.join(contentDir, '*.md'))
    },
    resolveId(id) {
      if (id === V || id === V_SEARCH || id.startsWith(V_CH)) return `\0${id}`
    },
    load(id) {
      if (!id.startsWith('\0virtual:deck')) return
      const name = id.slice(1)
      if (name === V) {
        for (const ch of chapters.values()) this.addWatchFile(ch.file)
        return manifestCode()
      }
      if (name === V_SEARCH) return searchCode()
      if (name.startsWith(V_CH)) {
        scan()
        const ch = chapters.get(name.slice(V_CH.length))
        if (!ch) return 'export default []'
        this.addWatchFile(ch.file)
        if (!ch.code) ch.code = compileChapter(ch)
        return ch.code
      }
    },
    handleHotUpdate({ file, server }) {
      if (path.dirname(file) !== contentDir || !file.endsWith('.md')) return
      for (const mod of server.moduleGraph.idToModuleMap.values()) {
        if (mod.id?.startsWith('\0virtual:deck')) server.moduleGraph.invalidateModule(mod)
      }
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
