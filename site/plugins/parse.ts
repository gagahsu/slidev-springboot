import YAML from 'yaml'

export interface RawSlide {
  frontmatter: Record<string, any>
  content: string
  note: string
}

// a fence may start right after a list marker: "2. ```css"
const FENCE = /^\s*(?:(?:[-*+]|\d+[.)])\s+)?(`{3,}|~{3,})(.*)$/

/** Split a Slidev-style markdown file into slides (`---` separators, optional per-slide frontmatter, trailing comment = speaker note). */
export function splitSlides(src: string): RawSlide[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const slides: RawSlide[] = []
  let i = 0
  let fm: Record<string, any> = {}
  let buf: string[] = []
  let fence: string | null = null

  const tryFrontmatter = (from: number): number | null => {
    // `from` is the index of a `---` line; frontmatter only if the next line is non-empty
    const next = lines[from + 1]
    if (next === undefined || next.trim() === '') return null
    for (let j = from + 1; j < lines.length; j++) {
      if (/^---\s*$/.test(lines[j])) {
        try {
          const parsed = YAML.parse(lines.slice(from + 1, j).join('\n'))
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            fm = parsed
            return j + 1
          }
        }
        catch {}
        return null
      }
      if (FENCE.test(lines[j])) return null
    }
    return null
  }

  const flush = () => {
    let content = buf.join('\n').trim()
    let note = ''
    const m = content.match(/<!--([\s\S]*?)-->\s*$/)
    if (m && content.lastIndexOf('<!--') === m.index) {
      note = m[1].trim()
      content = content.slice(0, m.index).trim()
    }
    if (content || Object.keys(fm).length)
      slides.push({ frontmatter: fm, content, note })
    buf = []
    fm = {}
  }

  if (/^---\s*$/.test(lines[0] ?? '')) {
    const after = tryFrontmatter(0)
    i = after ?? 1
  }

  while (i < lines.length) {
    const line = lines[i]
    const f = line.match(FENCE)
    if (f) {
      if (!fence) fence = f[1]
      else if (f[1][0] === fence[0] && f[1].length >= fence.length && !f[2].trim()) fence = null
    }
    if (!fence && /^---\s*$/.test(line)) {
      flush()
      const after = tryFrontmatter(i)
      i = after ?? i + 1
      continue
    }
    buf.push(line)
    i++
  }
  flush()
  return slides
}

/** Best-effort plain title of a slide. */
export function slideTitle(s: RawSlide): string {
  const heads: string[] = []
  let fence = false
  for (const line of s.content.split('\n')) {
    if (FENCE.test(line)) { fence = !fence; continue }
    if (fence) continue
    const m = line.match(/^#{1,3}\s+(.+)$/)
    if (m) heads.push(m[1])
    else if (heads.length && line.trim()) break
  }
  let t = heads.join(' ')
  if (!t) {
    const h = s.content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
    if (h) t = h[1]
  }
  if (!t && typeof s.frontmatter.title === 'string') t = s.frontmatter.title
  return plain(t)
}

export function plain(s: string): string {
  return s
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
    .replace(/^\s*(`{3,}|~{3,}).*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*\|?[\s:|-]+\|\s*$/gm, ' ')
    .replace(/[*`|]|^#+\s|^>\s|^::\w+::$/gm, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
