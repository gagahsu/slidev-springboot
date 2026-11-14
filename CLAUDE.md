# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Slidev-based teaching presentation** for a Spring Boot Backend Masterclass (22 chapters). It is **not** a Spring Boot Java application — the content is about Spring Boot, but the repository itself is a Node.js/Slidev project.

## Commands

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload at http://localhost:3030)
pnpm dev

# Build static site
pnpm build

# Export to PDF
pnpm export
```

Package manager is `pnpm` (v10.33.0). Do not use `npm` or `yarn`.

## Architecture

**Entry point:** `index.md` — the course home page (chapter grid) that includes all 22 chapter files via `src:` directives.

**Chapter files:** Named `chXX-topic.md` (e.g., `ch01-springboot-intro.md`, `ch16-spring-security.md`). Each is a standalone Slidev file included into `index.md`. Chapter files use `routeAlias: chXX` so the index grid can link to them with `<Link to="chXX">`.

**`_template/`:** Template files for bootstrapping a new chapter. When creating a new chapter, copy `_template/slides.md` as the starting structure.

**Global styling:**
- `style.css` — project-wide CSS: inline code styling (blue on light-blue), expanded code blocks for PDF export, operator badges (`.op-code`), ligature suppression
- `global-bottom.vue` — Slidev global component showing page `X / Y` footer and inline code override on white backgrounds

**Theme:** `slidev-theme-penguin` with the teal/turquoise palette: primary `#5eada0`, dark `#1a5c5c`, light `#a7d9d0`.

## New site (`site/`) — in progress

`site/` is a self-built Vue 3 + Vite replacement for Slidev that renders the same chapter Markdown (`NN-topic.md` in the repo root). It is a separate pnpm package; the Slidev setup stays working until the new site is finished.

```bash
pnpm site:dev      # dev server at http://localhost:3040 (first run: pnpm -C site install)
pnpm site:build    # static build to site/dist
pnpm -C site audit # with the dev server running: visit every slide, report overflow / errors
```

- `site/plugins/deck.ts` — Vite plugin: splits each chapter into slides (`plugins/parse.ts`), renders Markdown + Shiki, compiles each slide to a Vue render function, and exposes `virtual:deck` (manifest), `virtual:deck-chapter:chNN` (lazy per chapter) and `virtual:deck-search` (search index). Chapter titles/subtitles are read from the cards in `index.md`.
- `site/src/styles/theme.css` / `slide.css` — design tokens and slide typography/layouts (`cover`, `default`, `section`, `two-cols`, `end`). The old teal hex colours in inline styles are remapped to theme tokens at build time; do not edit the Markdown for colours.
- `site/src/lib/units.ts` — how chapters are grouped into units on the home page and sidebar.
- Supported Markdown syntax: `---` separators, per-slide frontmatter (`layout`, `class`), trailing `<!-- -->` speaker notes, `<Link to="chNN">`, `::right::`, ```` ```mermaid ````, utility classes in `class="..."`.

## Slide Authoring Conventions

- **Language:** Traditional Chinese (zh-TW) for all slide text; English for code identifiers and technical terms
- **Cover slide layout:** white background flexbox centered with teal gradient divider — see `_template/slides.md` for the exact HTML structure
- **Section dividers:** use `layout: section` with `class: flex flex-col justify-center items-center text-center`
- **End slide:** use `layout: end`
- **Tables:** always full-width; border and padding already set globally via frontmatter `style:` block in `index.md`
- **Code blocks:** use ` ```java ` (or the appropriate language); they automatically expand beyond the slide margin for PDF readability (defined in `style.css`)
- **Inline code:** renders as blue-on-light-blue; on teal section slides use the `global-bottom.vue` override (teal-on-near-white)

## Reference Materials

`ref1.md`, `ref2.md`, `ref3.md` — source content (Java OOP topics) used as reference when authoring slides. Do not modify these files; they are input materials, not slides.
