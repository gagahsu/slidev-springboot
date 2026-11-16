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
pnpm site:export    # PDFs to site/export/ (all chapters + merged); `pnpm -C site export ch04 ch13 --no-merge` for a subset
```

- `site/plugins/deck.ts` — Vite plugin: splits each chapter into slides (`plugins/parse.ts`), renders Markdown + Shiki, compiles each slide to a Vue render function, and exposes `virtual:deck` (manifest), `virtual:deck-chapter:chNN` (lazy per chapter) and `virtual:deck-search` (search index). Chapter titles/subtitles are read from the cards in `index.md`.
- `site/src/styles/theme.css` / `slide.css` — design tokens and slide typography/layouts (`cover`, `default`, `section`, `two-cols`, `end`). The old teal hex colours in inline styles are remapped to theme tokens at build time; do not edit the Markdown for colours.
- `site/src/lib/sync.ts` — presenter/audience messaging behind a small transport interface (BroadcastChannel today, same browser only). `lib/useDeck.ts` holds navigation shared by `pages/Deck.vue` (audience, `#/chNN/n`) and `pages/Presenter.vue` (`#/presenter/chNN/n`).
- `site/src/lib/draw.ts` + `components/DrawLayer.vue` / `DrawToolbar.vue` — per-slide drawings in slide coordinates (980x552), stored in localStorage and synced between windows.
- `site/src/lib/room.ts` — cross-device "classroom room" over Supabase Realtime (broadcast + presence, no tables; project URL and publishable key in `src/config.ts`). The presenter holds an ECDSA key; the 8-character room code is a hash of the public key; control messages (`PRIVILEGED` in `sync.ts`) are signed and verified, so students who only have the code cannot turn pages. `#/join/CODE` joins as a follower, `#/join/CODE/SECRET` as a phone remote.
- `site/src/lib/classroom.ts` — polls (`<Poll question="…" options="A|B|C" answer="2" />`, tallied by presenter devices, not persisted) and anonymous student questions.
- `site/src/lib/settings.ts` — presenter preferences in localStorage. `settings.interactive` (the 「課堂互動」 switch in the presenter top bar, default off for recorded lessons) drives `liveClass`: when off, `<Poll>` renders as a 「想一想」 quiz (no vote counts; the next step marks the answer) and the remote room button, student-questions tab and the home page 「加入課堂」 entry are hidden. A device that joined a room by link always counts as live. Speaker notes for polls must read naturally in both modes (do not say "用手機投票").
- `site/src/lib/steps.ts` — per-slide animation steps. `SlideCanvas` provides the context; components claim steps on mount; next/prev play steps before changing slide. Previews and thumbnails show the final state.
- `site/src/anim/` — animation components usable in chapter Markdown (registered in `main.ts`, allow-listed in `KNOWN_COMPONENTS` in `plugins/deck.ts`):
  - `<v-clicks>` (wrap a list or table: one item/row per step; needs blank lines inside) and `<v-click>` (one block)
  - ```` ```java {1-2|4|all} ```` — stepped line highlight; wrap the fence plus a list in `<CodeSteps>` to show the n-th list item as the caption of the n-th state
  - `<Flow nodes="A:副標|B|C" steps="1>2:label|2>3:label|2>1:label" />` — animated sequence diagram
  - `<IocDemo mode="traditional|ioc" />`, `<HttpExchange />` — concept animations (built on `anim/poses.ts` + Motion)
  - Story scenes for beginners (illustrations from `anim/Art.vue`, e.g. `<Art name="hotel" size="60" />`): `<LifeIoc mode="home|store" [variant="framework"] />` (ch01/ch04: 小明 printing at home vs at a convenience store), `<PickPrinter />` (ch07), `<StoreOpening />` (ch08), `<NoticeBoard />` (ch09), `<Counter mode="each|counter" />` (ch10), `<AspectTimeline />` (ch11), `<ShopLayout [mode="mvc"] [terms] />` (ch12: shop front = frontend, bar = backend, counter clerk = Controller), `<Dispatch [terms] />` (ch14: clerks wearing path badges, 404 when nobody has it), `<UrlParts parts="text;;name;;story;;note||…" />` (ch14/17/18/19: take a URL apart, one segment per step), `<CupLabel />` (ch15: cup label = JSON), `<AskOrOrder [terms] />` (ch17: asking out loud = GET, handing in a slip = POST), `<FileRoom [mode="lost"] [terms] />` (ch22: school office front desk → clerk → file room = database), `<SqlSlip [terms] />` (ch24: request slip with named blanks + fill-in sheet = SQL + Map), `<RowCards [terms] />` (ch25: table rows copied onto student cards = RowMapper), `<TwoBooks mode="broken|tx" />` (ch32: demerit changes two books; transaction rolls back), `<SeatRace mode="race|pessimistic|optimistic" />` (ch33: two students grab the last course seat), `<DrinkShop mode="chaos|request|response|status" [terms] />` (ch13; `terms` adds the HTTP names), and `<Pairs left="生活" right="程式" rows="art,文字=art,文字|…" />` for "everyday thing = programming term" tables (`sign="vs"` or `sign="→"` turns it into a comparison / before-after).
  - Cover slides get a Three.js backdrop automatically (`components/CoverBackdrop.vue`).
  - Chapters rewritten so far: ch01, ch04–ch11 (unit 1, all on the 小明 printing story), ch12–ch21 (unit 2, bubble-tea shop; code uses `Drink` / `Order`, `DrinkController` / `OrderController`); ch22–ch34 (unit 3, school registrar's office: 檔案室 = database, 承辦人員 = Dao / Spring JDBC, 組長 = Service, 櫃台 = Controller, 資深助理 = JPA, 申請單 = SQL; code uses `Student` with `className` / `score` from ch28, `Classroom`, `Penalty`, `Course`); ch02/ch03 lightly edited. Slidev does not know the custom tags, so those chapters degrade there.
- `site/src/pages/Print.vue` (`#/print/chNN`) + `site/scripts/export-pdf.mjs` — PDF export: one slide per 980x552 page in its final animation state, vector text. The script starts its own Vite server and uses Playwright from the repo root's `playwright-chromium`.
- `site/src/lib/units.ts` — how chapters are grouped into units on the home page and sidebar.
- Supported Markdown syntax: `---` separators, per-slide frontmatter (`layout`, `class`), trailing `<!-- -->` speaker notes, `<Link to="chNN">`, `::right::`, ```` ```mermaid ````, utility classes in `class="..."`.

## Chapter rewrite for beginners (unit 1 ch01–11, unit 2 ch12–21 and unit 3 ch22–34 done; ch35+ still original)

The audience has little or no programming experience. Rewritten chapters follow this order: an everyday story with no code (each concept gets its own best-fitting analogy, e.g. 小明 printing homework at home vs at a convenience store for IoC, bubble-tea order form for HTTP; keep ONE example per unit (agreed: unit 1 Spring core = 小明 printing at a convenience store; unit 2 MVC = bubble-tea shop; later units = school office managing student records), including the code (the consumer class is `XiaoMing` / `XiaoMingController`, the aspect is `CounterAspect`)) → map the story onto the programming terms with `<Pairs>` → the concept in one sentence → a little code, stepped with captions → benefits/details, each tied back to the story → a recap `<Pairs>` and a short summary. Introduce every term in plain words the first time, prefer short lists over wide tables, add a `<Poll>` after the story and after the concept, and write a conversational speaker note for every slide with `（下一步）` marking each animation step. Content after a stepped block goes in `<v-click>` so it does not appear early.

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
