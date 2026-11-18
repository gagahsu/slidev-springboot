import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, presetWind3 } from 'unocss'

// Utility classes are generated only for classes actually authored in the chapter markdown
// (`class="..."` attributes and `class:` frontmatter). Scanning every word would turn content
// such as MyBatis `<where>` into stray utilities, and the app's own components use scoped CSS.
// Restart the dev server after using a utility class that no chapter has used before.
// Every course folder under courses/ (the same folders plugins/deck.ts reads) is scanned.
const coursesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../courses')

function authoredClasses(): string[] {
  const out = new Set<string>()
  const courses = fs.existsSync(coursesDir) ? fs.readdirSync(coursesDir) : []
  for (const course of courses) {
    const dir = path.join(coursesDir, course)
    if (!fs.existsSync(path.join(dir, 'course.yaml'))) continue
    for (const name of fs.readdirSync(dir)) {
      if (!/^\d{2}-.+\.md$/.test(name)) continue
      const code = fs.readFileSync(path.join(dir, name), 'utf8')
      for (const m of code.matchAll(/class="([^"]*)"|^class:\s*(.+)$/gm))
        for (const c of (m[1] ?? m[2]).split(/\s+/)) if (c) out.add(c)
    }
  }
  return [...out]
}

export default defineConfig({
  presets: [presetWind3({ preflight: false })],
  content: { pipeline: false },
  safelist: authoredClasses(),
})
