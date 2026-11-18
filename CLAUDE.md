# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository holds **teaching slides for one or more courses**, rendered by a self-built Vue/Vite site (`site/`). Today there is one course, the Spring Boot Backend Masterclass (53 chapters, `courses/springboot/`); more (e.g. MySQL) will be added as sibling folders. It is **not** a Spring Boot Java application — the content is about Spring Boot, but the repository itself is a Node.js project. The original Slidev setup in the repo root still works for the Spring Boot course.

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

**Folder layout:**

```
courses/
  springboot/            ← one folder per course; the folder name is the course id used in URLs
    course.yaml          ← course settings (see "Courses" below)
    01-springboot-intro.md … 53-dynamic-survey-frontend.md
public/screenshots/…     ← images shared by every course (`/screenshots/...` in the Markdown)
index.md                 ← Slidev entry for the Spring Boot course only
```

**Slidev entry point (legacy):** `index.md` — the Slidev home page (chapter grid) that includes the Spring Boot chapter files via `src: ./courses/springboot/NN-topic.md`. When adding a Spring Boot chapter, add it to `index.md` too if the Slidev version should keep up. The new site does not read `index.md`.

**Chapter files:** Named `NN-topic.md` (two digits, e.g. `04-spring-ioc.md`) inside a course folder; the chapter id is `chNN`. Each is a standalone Slidev-style file. Chapter files use `routeAlias: chNN` so the Slidev grid can link to them with `<Link to="chNN">`.

**`_template/`:** Template files for bootstrapping a new chapter. When creating a new chapter, copy `_template/slides.md` as the starting structure.

**Global styling:**
- `style.css` — project-wide CSS: inline code styling (blue on light-blue), expanded code blocks for PDF export, operator badges (`.op-code`), ligature suppression
- `global-bottom.vue` — Slidev global component showing page `X / Y` footer and inline code override on white backgrounds

**Theme:** `slidev-theme-penguin` with the teal/turquoise palette: primary `#5eada0`, dark `#1a5c5c`, light `#a7d9d0`.

## New site (`site/`) — in progress

`site/` is a self-built Vue 3 + Vite replacement for Slidev that renders the chapter Markdown of every course in `courses/`. It is a separate pnpm package; the Slidev setup stays working for the Spring Boot course.

```bash
pnpm site:dev        # dev server at http://localhost:3040 (first run: pnpm -C site install)
pnpm site:build      # static build to site/dist
pnpm -C site run audit [springboot] [ch04 …]   # with the dev server running: visit every slide, report overflow / errors
                     # (`run` is required: plain `pnpm audit` is pnpm's own package security audit)
pnpm site:export     # PDFs to site/export/<course>/ (every chapter + one merged file per course)
pnpm -C site export springboot ch04 ch13 --no-merge   # a subset of one course
```

### Courses

The site home `#/` is a course picker; each course lives under its own URL prefix and has its own home page, units, sidebar, search scope, progress, lite route, drawings and PDF export.

| Page | URL |
|---|---|
| course picker | `#/` |
| course home | `#/springboot` |
| slide | `#/springboot/ch04/3` |
| presenter | `#/presenter/springboot/ch04/3` |
| print / PDF | `#/print/springboot/ch04` |
| join a classroom room | `#/join/CODE` (`/SECRET` for the phone remote) — no course in the URL |

Old single-course URLs (`#/ch04/3`, `#/presenter/ch04/3`, `#/print/ch04`) redirect to the course marked `legacy: true` (Spring Boot). Unknown courses or chapters go back to the picker / course home. Course ids must be lowercase letters, digits and `-`, and cannot be `presenter`, `print`, `join` or `chNN`.

`courses/<id>/course.yaml` fields (all optional except `title`; the Spring Boot file is the reference):
- `title`, `short` (short name for the sidebar, search results, presenter bar), `description`, `logo` (1–2 characters on the course card), `color` (`green` / `blue` / `purple` / `orange` / `pink` / `teal` / `yellow`), `order` (picker order)
- `legacy: true` — this course answers the old single-course URLs; at most one course
- `searchHint` (example keywords in the search box), `pdfName` (merged PDF file name)
- `units: [{ title, desc, from, to, color }]` — chapter numbers, inclusive; without units all chapters form one group
- `lite: { description, optional: [chapter numbers] }` — 精簡路線; omit it and the course home shows no route switch
- `chapters: { chNN: { title, subtitle } }` — chapter card titles; a chapter without an entry uses the `title:` / `subtitle:` frontmatter of its first slide

Per course vs site-wide:
- per course: progress and 「繼續上次的進度」 (`deck-progress-v2`: `{ last: {course, ch, i}, courses: { <id>: { last, seen } } }`), lite route choice (`settings.routes[<id>]`), drawings (keys `<course>/chNN/<slide index>`), search index, PDF export, slide keys (`<course>/chNN-<index>`, so poll ids are per course)
- site-wide: the 「課堂互動」 switch (`settings.interactive`), presenter note size, the classroom room. A room is not tied to a course: `nav` messages carry `course`, so students follow the presenter into another course.
- Browsers that used the single-course site keep their data: `deck-progress-v1`, the old `route` setting and drawing keys `chNN/i` are moved to the legacy course on first load.

**Adding a course** (no code changes):
1. Create `courses/<id>/` (e.g. `courses/mysql/`).
2. Add `course.yaml` with at least `title`; copy `courses/springboot/course.yaml` and edit `units`, `lite`, `chapters` as needed (omit `legacy`).
3. Put the chapters in the folder as `01-topic.md`, `02-topic.md` … (Slidev-style Markdown: `---` separators, first slide is the cover). Images go in `public/` and are referenced as `/screenshots/...`.
4. Run `pnpm site:dev`: the course appears on `#/` (the dev server picks up new folders; restart it if a brand-new course does not show). Check it with `pnpm -C site run audit <id>`, then `pnpm site:build`.
5. Custom animation components are shared by all courses (`site/src/anim/`, registered in `main.ts` and `KNOWN_COMPONENTS`).

### Site internals

- `site/plugins/deck.ts` — Vite plugin: scans `courses/*/course.yaml`, splits each chapter into slides (`plugins/parse.ts`), renders Markdown + Shiki, compiles each slide to a Vue render function, and exposes `virtual:deck` (all courses with their chapter manifests, plus loaders), `virtual:deck-chapter:<course>/chNN` (lazy per chapter) and `virtual:deck-search:<course>` (search index of one course). Chapter titles/subtitles come from `chapters:` in `course.yaml`.
- `site/src/lib/deck.ts` — `courses`, `courseById`, `chapterById(course, ch)`, `loadChapter(course, ch)`, `loadSearch(course)`, `legacyCourse`. `site/src/lib/course.ts` — `currentCourseId` / `currentCourse`, set by the router from `:course` (used by `<Link>`, the sidebar and the search palette). Pages: `pages/Courses.vue` (picker), `pages/Home.vue` (course home), `Deck.vue`, `Presenter.vue`, `Print.vue`, `Join.vue`.
- `<Link to="chNN">` in chapter Markdown points to that chapter of the same course; `<Link to="home">` to the course home.
- `site/src/styles/theme.css` / `slide.css` — design tokens and slide typography/layouts (`cover`, `default`, `section`, `two-cols`, `end`). The old teal hex colours in inline styles are remapped to theme tokens at build time; do not edit the Markdown for colours.
- `site/src/lib/sync.ts` — presenter/audience messaging behind a small transport interface (BroadcastChannel today, same browser only). `lib/useDeck.ts` holds navigation shared by `pages/Deck.vue` (audience, `#/<course>/chNN/n`) and `pages/Presenter.vue` (`#/presenter/<course>/chNN/n`).
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
  - Story scenes for beginners (illustrations from `anim/Art.vue`, e.g. `<Art name="hotel" size="60" />`): `<LifeIoc mode="home|store" [variant="framework"] />` (ch01/ch04: 小明 printing at home vs at a convenience store), `<PickPrinter />` (ch07), `<StoreOpening />` (ch08), `<NoticeBoard />` (ch09), `<Counter mode="each|counter" />` (ch10), `<AspectTimeline />` (ch11), `<ShopLayout [mode="mvc"] [terms] />` (ch12: shop front = frontend, bar = backend, counter clerk = Controller), `<Dispatch [terms] />` (ch14: clerks wearing path badges, 404 when nobody has it), `<UrlParts parts="text;;name;;story;;note||…" />` (ch14/17/18/19: take a URL apart, one segment per step), `<CupLabel />` (ch15: cup label = JSON), `<AskOrOrder [terms] />` (ch17: asking out loud = GET, handing in a slip = POST), `<FileRoom [mode="lost"] [terms] />` (ch22: school office front desk → clerk → file room = database), `<SqlSlip [terms] />` (ch24: request slip with named blanks + fill-in sheet = SQL + Map), `<RowCards [terms] />` (ch25: table rows copied onto student cards = RowMapper), `<TwoBooks mode="broken|tx" />` (ch33: demerit changes two books; transaction rolls back), `<SeatRace mode="race|pessimistic|optimistic" />` (ch34: two students grab the last course seat), `<PaperTrail [terms] />` (ch37: application form / master record / report card = Request DTO / PO / Response DTO), `<FormCheck [terms] />` (ch41: front desk rejects a badly filled form = Bean Validation), `<SessionTag [terms] />` (ch42: number tag + locker = JSESSIONID cookie + Session), `<RateDelay [terms] />` (ch44: fixedRate vs fixedDelay timeline), `<StickyNote [terms] />` (ch45: sticky note on the desk = Cache hit / evict), `<GateGuard [terms] />` (ch46: guard at the school gate = authentication then authorization), `<PassCard [terms] />` (ch47: stamped pass = JWT; tampering breaks the seal), `<Campus [terms] />` (ch48: office directory / service desk / internal phone = Eureka / Gateway / OpenFeign), `<Breaker [terms] />` (ch48: "service suspended" sign = circuit breaker states), `<LinkTables [mode="many"] [terms] />` (ch29: report card + subject scores linked by a foreign key; `many` adds the join table), `<Conveyor [terms] />` (ch38: conveyor belt with pick / rewrite / gather stations = Stream filter / map / toList), `<DrinkShop mode="chaos|request|response|status" [terms] />` (ch13; `terms` adds the HTTP names), and `<Pairs left="生活" right="程式" rows="art,文字=art,文字|…" />` for "everyday thing = programming term" tables (`sign="vs"` or `sign="→"` turns it into a comparison / before-after).
  - Cover slides get a Three.js backdrop automatically (`components/CoverBackdrop.vue`).
  - Chapters rewritten so far: ch01, ch04–ch11 (unit 1, all on the 小明 printing story), ch12–ch21 (unit 2, bubble-tea shop; code uses `Drink` / `Order`, `DrinkController` / `OrderController`); ch22–ch35 (unit 3, school registrar's office: 檔案室 = database, 承辦人員 = Dao / Spring JDBC, 組長 = Service, 櫃台 = Controller, 資深助理 = JPA, 申請單 = SQL; code uses `Student` with `className` / `score` from ch28, `Classroom`, `Penalty`, `Course`); ch36–ch41 (unit 4, same school office: 人的分工 = three layers, 三張紙 = PO / DTO / VO, 辦事指南 = OpenAPI, 櫃台退件 = Validation; from ch39 the code lives in a NEW project `school` with packages `controller` / `service` / `repository` / `entity` / `dto` / `vo`, `Student` has `idNumber` / `name` / `score`, DTOs `CreateStudentRequest` / `StudentResponse`, `ScoreVO`, practice entity `Club`); ch42–ch45 (unit 5, still the `school` project: 號碼牌＋置物櫃 = Session, 演練清單 / 替身 = unit test / Mock, 值班日誌 = Log, 工友的時間表 = `@Scheduled` in a `scheduler` package, 便利貼 = Cache with `#p0` keys; schedulers call `StudentService`, never the repository); ch46–ch48 (unit 6: 校門口警衛 = Spring Security with `Account` / `AccountService implements UserDetailsService` / roles `STUDENT` `TEACHER`, 蓋鋼印的通行證 = JWT with `security/JwtUtil` + `JwtAuthFilter` and `AuthController`, 拆成處室 = microservices in four NEW projects `eureka-server` / `student-service` / `club-service` / `gateway`; the Java code of these three chapters was compiled and run against Spring Boot 4.0.9, jjwt 0.13.0, Spring Cloud 2025.1.4); two chapters were ADDED later and everything after them renumbered: ch29 (JPA relations: `ReportCard` 1—N `SubjectScore`, N—N `Award`; `@JsonIgnore` to stop the JSON loop) and ch38 (Java extras tried in a `Playground` main: enum, record, generics `Reply<T>`, Stream, `orElseThrow`, custom exception, `LocalDate`). The IDE used throughout the course is Eclipse. The survey project (unit 7) is split into ch49 (overview, entities, repositories), ch50 (`AppResponse<T>` record + `RspCode` enum, `BizException` + `GlobalExceptionHandler`, `AuthService implements UserDetailsService`, JWT, `SecurityConfig` with `/api/admin/**` = ADMIN, `/error` permitted, CORS for localhost:4200), ch51 (admin `SurveyService` / `AdminSurveyController`, session drafts, stats) and ch52 (public answering flow, `SurveyController`, history), plus ch53 frontend. API paths and JSON shapes must stay identical to what the ch53 Angular code calls. Backend rules added in the rewrite: first registered user is ADMIN, others USER; answered surveys cannot be edited or deleted; entities use `@Getter`/`@Setter`. The whole backend was compiled and exercised with curl (Spring Boot 4.0.9, H2 in MySQL mode). ch02 (小明開學前準備文具: JDK 17 Temurin = 語言, Eclipse = 書桌, MySQL = 檔案櫃, Git = 存檔點, GitHub = 雲端作業簿, GitHub Desktop = 按鈕版; install screenshots kept) and ch03 (第一次到便利商店: Initializr = 配好的工具箱, Eclipse import = 搬上書桌, `MyController` = 掛名牌的店員, run = 按下列印鈕; Spring Boot 4 default, Java 17) were rewritten last. Slidev does not know the custom tags, so those chapters degrade there.
- `site/src/pages/Print.vue` (`#/print/<course>/chNN`) + `site/scripts/export-pdf.mjs` — PDF export: one slide per 980x552 page in its final animation state, vector text. The script starts its own Vite server and uses Playwright from the repo root's `playwright-chromium` (or a global `playwright`).
- `site/src/lib/units.ts` — `unitOf(course, num)`; the units themselves are `units:` in each `course.yaml`.
- `site/src/lib/route.ts` — the 「精簡路線」 (lite route), per course: chapters in `lite.optional` of `course.yaml` are hidden on the course home and sidebar (the sidebar keeps the chapter being viewed, marked 選修) and skipped by next/previous chapter. For Spring Boot these are ch08, ch10–11, ch30–32, ch35, ch43–45, ch48, which the survey project backend does not need. The choice (`settings.routes[<course>]`, toggled on the course home) is stored in localStorage. Chapters on the lite route must not depend on optional chapters: when a slide refers to one, keep it self-contained.
- Supported Markdown syntax: `---` separators, per-slide frontmatter (`layout`, `class`), trailing `<!-- -->` speaker notes, `<Link to="chNN">`, `::right::`, ```` ```mermaid ````, utility classes in `class="..."`.

## Chapter rewrite for beginners (unit 1 ch01–11 including ch02/ch03, unit 2 ch12–21, unit 3 ch22–35 (ch29 being added), unit 4 ch36–41 (ch38 being added), unit 5 ch42–45 and unit 6 ch46–48 and the project backend ch49–52 done; ch53 (Angular frontend) is the original content moved unchanged)

The audience has little or no programming experience. Rewritten chapters follow this order: an everyday story with no code (each concept gets its own best-fitting analogy, e.g. 小明 printing homework at home vs at a convenience store for IoC, bubble-tea order form for HTTP; keep ONE example per unit (agreed: unit 1 Spring core = 小明 printing at a convenience store; unit 2 MVC = bubble-tea shop; units 3–6 (database, architecture, advanced features, security and microservices) = school office managing student records), including the code (the consumer class is `XiaoMing` / `XiaoMingController`, the aspect is `CounterAspect`)) → map the story onto the programming terms with `<Pairs>` → the concept in one sentence → a little code, stepped with captions → benefits/details, each tied back to the story → a recap `<Pairs>` and a short summary. Introduce every term in plain words the first time, prefer short lists over wide tables, add a `<Poll>` after the story and after the concept, and write a conversational speaker note for every slide with `（下一步）` marking each animation step. Content after a stepped block goes in `<v-click>` so it does not appear early.

## Slide Authoring Conventions

- **Language:** Traditional Chinese (zh-TW) for all slide text; English for code identifiers and technical terms
- **Cover slide layout:** white background flexbox centered with teal gradient divider — see `_template/slides.md` for the exact HTML structure
- **Section dividers:** use `layout: section` with `class: flex flex-col justify-center items-center text-center`
- **End slide:** use `layout: end`
- **Tables:** always full-width; border and padding already set globally (Slidev: frontmatter `style:` block in `index.md`; site: `site/src/styles/slide.css`)
- **Code blocks:** use ` ```java ` (or the appropriate language); they automatically expand beyond the slide margin for PDF readability (defined in `style.css`)
- **Inline code:** renders as blue-on-light-blue; on teal section slides use the `global-bottom.vue` override (teal-on-near-white)

## Reference Materials

`ref1.md`, `ref2.md`, `ref3.md` — source content (Java OOP topics) used as reference when authoring slides. Do not modify these files; they are input materials, not slides.
