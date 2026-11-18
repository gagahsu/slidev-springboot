import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import MarkdownIt from 'markdown-it'
import cjkFriendly from 'markdown-it-cjk-friendly'
import { createHighlighter, type Highlighter } from 'shiki'
import { compile } from '@vue/compiler-dom'
import YAML from 'yaml'
import { plain, slideTitle, splitSlides, type RawSlide } from './parse.ts'

const LANGS = ['java', 'typescript', 'javascript', 'html', 'css', 'scss', 'properties', 'bash', 'json', 'groovy', 'xml', 'sql', 'yaml', 'powershell']
const CODE_THEME = 'github-light'
const KNOWN_COMPONENTS = new Set(['Link', 'Mermaid', 'v-clicks', 'v-click', 'StepCode', 'CodeSteps', 'Flow', 'IocDemo', 'HttpExchange', 'Poll', 'Art', 'LifeIoc', 'Pairs', 'DrinkShop', 'PickPrinter', 'StoreOpening', 'NoticeBoard', 'Counter', 'AspectTimeline', 'ShopLayout', 'UrlParts', 'Dispatch', 'CupLabel', 'AskOrOrder', 'FileRoom', 'SqlSlip', 'RowCards', 'TwoBooks', 'SeatRace', 'PaperTrail', 'FormCheck', 'SessionTag', 'RateDelay', 'StickyNote', 'GateGuard', 'PassCard', 'Campus', 'Breaker', 'LinkTables', 'Conveyor'])

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

interface Course {
  id: string
  dir: string
  configFile: string
  configMtime: number
  meta: Record<string, any>
  chapters: Map<string, Chapter>
}

/** Words that already mean something in the site's URLs, so they cannot be course ids. */
const RESERVED = new Set(['presenter', 'print', 'join'])
const COLORS = new Set(['green', 'blue', 'purple', 'orange', 'pink', 'teal', 'yellow'])

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * One course = one folder `courses/<id>/` holding `course.yaml` and chapter files `NN-topic.md`.
 * Virtual modules: `virtual:deck` (all courses + chapter manifests), `virtual:deck-chapter:<course>/chNN`
 * (compiled slides of one chapter, lazy) and `virtual:deck-search:<course>` (search index of one course).
 */
export default function deck(opts: { coursesDir: string }): Plugin {
  const coursesDir = path.resolve(opts.coursesDir)
  let config: ResolvedConfig
  let highlighter: Highlighter
  let md: MarkdownIt
  const courses = new Map<string, Course>()

  const V = 'virtual:deck'
  const V_SEARCH = 'virtual:deck-search:'
  const V_CH = 'virtual:deck-chapter:'

  function readConfig(course: Course) {
    const mtime = fs.statSync(course.configFile).mtimeMs
    if (mtime === course.configMtime) return
    course.configMtime = mtime
    let meta: any = {}
    try { meta = YAML.parse(fs.readFileSync(course.configFile, 'utf8')) ?? {} }
    catch (e: any) { this_warn(`${path.relative(coursesDir, course.configFile)}: ${e.message}`) }
    course.meta = typeof meta === 'object' && !Array.isArray(meta) ? meta : {}
  }

  function scanCourse(course: Course) {
    readConfig(course)
    const titles: Record<string, any> = course.meta.chapters ?? {}
    const seen = new Set<string>()
    for (const name of fs.readdirSync(course.dir).sort()) {
      const m = name.match(/^(\d{2})-.+\.md$/)
      if (!m) continue
      const id = `ch${m[1]}`
      seen.add(id)
      const file = path.join(course.dir, name)
      const mtime = fs.statSync(file).mtimeMs
      let ch = course.chapters.get(id)
      if (!ch || ch.mtime !== mtime || ch.file !== file) {
        const slides = splitSlides(fs.readFileSync(file, 'utf8'))
        ch = { id, num: Number(m[1]), file, mtime, slides, title: '', subtitle: '' }
        course.chapters.set(id, ch)
      }
      const card = titles[id] ?? {}
      const first = ch.slides[0]?.frontmatter ?? {}
      ch.title = plain(String(card.title ?? first.title ?? name))
      ch.subtitle = plain(String(card.subtitle ?? first.subtitle ?? ''))
    }
    for (const id of [...course.chapters.keys()]) if (!seen.has(id)) course.chapters.delete(id)
  }

  function scan() {
    const found = new Set<string>()
    const names = fs.existsSync(coursesDir) ? fs.readdirSync(coursesDir).sort() : []
    for (const id of names) {
      const dir = path.join(coursesDir, id)
      const configFile = path.join(dir, 'course.yaml')
      if (!fs.existsSync(configFile)) continue
      if (!/^[a-z][a-z0-9-]*$/.test(id) || RESERVED.has(id) || /^ch\d+$/.test(id)) {
        this_warn(`courses/${id}: 課程資料夾名稱只能用小寫英文、數字和 -，且不能是 ${[...RESERVED].join(' / ')} 或 chNN，已略過`)
        continue
      }
      found.add(id)
      let course = courses.get(id)
      if (!course) courses.set(id, course = { id, dir, configFile, configMtime: -1, meta: {}, chapters: new Map() })
      scanCourse(course)
    }
    for (const id of [...courses.keys()]) if (!found.has(id)) courses.delete(id)
  }

  const sortedCourses = () => [...courses.values()].sort((a, b) =>
    (Number(a.meta.order) || 999) - (Number(b.meta.order) || 999) || a.id.localeCompare(b.id))
  const sortedChapters = (c: Course) => [...c.chapters.values()].sort((a, b) => a.num - b.num)

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

  function isCourseFile(file: string) {
    const rel = path.relative(coursesDir, file)
    return !rel.startsWith('..') && !path.isAbsolute(rel) && /\.(md|ya?ml)$/.test(file)
  }
  function reload(server: ViteDevServer) {
    for (const mod of server.moduleGraph.idToModuleMap.values()) {
      if (mod.id?.startsWith('\0virtual:deck')) server.moduleGraph.invalidateModule(mod)
    }
    server.ws.send({ type: 'full-reload' })
  }

  function courseInfo(c: Course) {
    const m = c.meta
    const str = (v: any, d = '') => (typeof v === 'string' ? v : d)
    const color = COLORS.has(m.color) ? m.color : 'green'
    const units = (Array.isArray(m.units) ? m.units : []).map((u: any) => ({
      title: str(u?.title),
      desc: str(u?.desc),
      from: Number(u?.from) || 0,
      to: Number(u?.to) || 999,
      color: COLORS.has(u?.color) ? u.color : color,
    }))
    const lite = m.lite && typeof m.lite === 'object'
      ? { description: str(m.lite.description), optional: (Array.isArray(m.lite.optional) ? m.lite.optional : []).map(Number).filter(Number.isFinite) }
      : null
    const title = str(m.title, c.id)
    return {
      id: c.id,
      title,
      short: str(m.short, title),
      description: str(m.description),
      logo: str(m.logo, title.slice(0, 1).toUpperCase()).slice(0, 2),
      color,
      legacy: m.legacy === true,
      searchHint: str(m.searchHint),
      pdfName: str(m.pdfName, c.id),
      // a course without units shows all its chapters as one group
      units: units.length ? units : [{ title: '全部章節', desc: '', from: 0, to: 999, color }],
      lite,
      chapters: sortedChapters(c).map(ch => ({
        id: ch.id,
        num: ch.num,
        title: ch.title,
        subtitle: ch.subtitle,
        count: ch.slides.length,
        outline: ch.slides.map((s, i) => ({ t: slideTitle(s), l: layoutOf(s, i) })),
      })),
    }
  }

  function manifestCode(): string {
    scan()
    const list = sortedCourses().map(courseInfo)
    const legacy = list.filter(c => c.legacy)
    if (legacy.length > 1) this_warn(`legacy: true 只能設在一門課，現在有 ${legacy.map(c => c.id).join(', ')}；舊網址會轉到 ${legacy[0].id}`)
    legacy.slice(1).forEach(c => { c.legacy = false })
    const loaders = list.flatMap(c => c.chapters.map(ch => `${c.id}/${ch.id}`))
    return [
      `export const courses = ${JSON.stringify(list)}`,
      `export const loaders = {`,
      ...loaders.map(k => `  ${JSON.stringify(k)}: () => import(${JSON.stringify(V_CH + k)}),`),
      `}`,
      `export const searchLoaders = {`,
      ...list.map(c => `  ${JSON.stringify(c.id)}: () => import(${JSON.stringify(V_SEARCH + c.id)}),`),
      `}`,
    ].join('\n')
  }

  function searchCode(course: Course | undefined): string {
    const docs: any[] = []
    if (course) {
      for (const ch of sortedChapters(course)) {
        ch.slides.forEach((s, i) => {
          docs.push({ c: ch.id, i, t: slideTitle(s), x: plain(s.content) })
        })
      }
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
      server.watcher.add(coursesDir)
      // new or deleted chapters / courses: Vite only reports changes to files it already knows
      const onAddRemove = (file: string) => { if (isCourseFile(file)) reload(server) }
      server.watcher.on('add', onAddRemove)
      server.watcher.on('unlink', onAddRemove)
    },
    resolveId(id) {
      if (id === V || id.startsWith(V_SEARCH) || id.startsWith(V_CH)) return `\0${id}`
    },
    load(id) {
      if (!id.startsWith('\0virtual:deck')) return
      const name = id.slice(1)
      if (name === V) {
        const code = manifestCode()
        for (const c of courses.values()) {
          this.addWatchFile(c.configFile)
          for (const ch of c.chapters.values()) this.addWatchFile(ch.file)
        }
        return code
      }
      if (name.startsWith(V_SEARCH)) {
        scan()
        return searchCode(courses.get(name.slice(V_SEARCH.length)))
      }
      if (name.startsWith(V_CH)) {
        scan()
        const [courseId, chId] = name.slice(V_CH.length).split('/')
        const ch = courses.get(courseId)?.chapters.get(chId)
        if (!ch) return 'export default []'
        this.addWatchFile(ch.file)
        if (!ch.code) ch.code = compileChapter(ch)
        return ch.code
      }
    },
    handleHotUpdate({ file, server }) {
      if (!isCourseFile(file)) return
      reload(server)
      return []
    },
  }
}
