# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository holds **teaching slides for one or more courses**, rendered by a self-built Vue/Vite site (`site/`). There are seven courses: Spring Boot (57 chapters, `courses/springboot/`), MySQL (11, `courses/mysql/`), Angular (61, `courses/angular/`), Git (20, `courses/git/`), Java (28, `courses/java/`), Java 進階 (23, `courses/java-adv/`) and Docker (8, `courses/docker/`, deploys the online shop); more can be added as sibling folders. Two learning tracks (`tracks/`) order them for teaching. It is **not** a Spring Boot Java application — the content is about Spring Boot, but the repository itself is a Node.js project. The original Slidev setup in the repo root still works for the Spring Boot course.

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
    01-springboot-intro.md … 57-shop-admin.md
  mysql/                 ← copied from gagahsu/slidev-mysql (files there are named chNN-topic.md)
    course.yaml
    01-db-design-principles.md … 11-flyway.md
    sql/corner_cafe/     ← schema.sql + seed.sql of the basic project (3 tables), used by the ch04–07 exercises
    sql/cafe_shop/       ← schema.sql + seed.sql of the advanced project (8 tables), used by ch03 and ch08–10
                            (both verified on MySQL 9.7; dates in the seeds are relative to today)
  angular/               ← copied from gagahsu/slidev-angular (chapters only: its practice-*.md decks,
    course.yaml             code/, course-demo/ and lecture PDFs were left in that repo)
    01-frontend-intro.md … 61-shop-admin.md   (ch58–61 written here: café frontend, interceptors/guards, shop storefront, shop admin)
  git/                   ← copied from gagahsu/slidev-git: ch01–08 = its beginner deck b01–b08 (GitHub Desktop),
                            ch09–20 = its main deck ch01–12 (chapter refs and links in the text renumbered +8)
  java/                  ← copied from gagahsu/slidev-java: the 28 basic files chNN-topic.md
  java-adv/              ← the same repo's chNN-topic-adv.md files; chapter numbers match java/ (gaps where there is none)
  docker/                ← copied from gagahsu/slidev-docker; the running project was switched from TaskBoard to the online shop
                            (commands match projects/cafe-shop-*: DB_URL/DB_USERNAME/DB_PASSWORD, `--network-alias api`,
                            volumes db-data + uploads, `--default-character-set=utf8mb4` for Chinese in the container's mysql CLI)
tracks/basic.yaml        ← learning tracks (學程): ordered stages of chapters across courses
tracks/advanced.yaml
specs/CAFE-SPEC.md       ← basic-track project (Corner Café one-page site); shared by all courses
specs/SHOP-SPEC.md       ← advanced-track project (Corner Café online shop + ECPay sandbox); replaced the retired survey project
projects/                ← reference solutions the chapters quote (not part of the site build; each has its own build tool)
  cafe-api/              ← Spring Boot 4.1.2 / Java 21 / Gradle, DB corner_cafe (CAFE-SPEC); Spring Boot ch50
  cafe-web/              ← Angular 21 (npm), menu + reservation form; Angular ch58
  cafe-shop-api/         ← Spring Boot 4.1.2 + Security/JWT + Flyway (V1 schema, V2 seed) + MyBatis reports + ECPay;
                            Spring Boot ch51–57. `./gradlew test` runs the CheckMacValue test (official ECPay example)
  cafe-shop-web/         ← Angular 21 + Material + Chart.js, storefront + /admin; Angular ch59–61
  cafe-shop-deploy/      ← compose.yaml (db mysql:9.7 / api / web nginx:1.31-alpine) + .env.example; Docker ch05–08.
                            api and web Dockerfiles live in their own folders (web builds with `--configuration docker`,
                            which swaps in config.docker.ts so the API is same-origin behind nginx). Verified with Docker 29.10.
public/screenshots/…     ← Spring Boot images (`/screenshots/...` in the Markdown)
public/images/<NN-topic>/… ← Angular images (`/images/...`)
public/beginner/…        ← Git beginner screenshots (used by `<Shot file="…">`)
public/img/…             ← Java images (`/img/...`)
public/docker/…          ← Docker install screenshots (`/docker/...`; the paths in the Markdown were changed from `/…`)
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

### Deployment (GitHub Pages)

`.github/workflows/deploy.yml` runs on every push to `main` (or by hand: Actions → Run workflow) and publishes:

| URL | Content |
|---|---|
| `https://<owner>.github.io/<repo>/` | the new site (`site/dist`, hash URLs) |
| `https://<owner>.github.io/<repo>/slidev/` | the original Slidev deck (`pnpm build --base /<repo>/slidev/`; `routerMode: hash` in `index.md`) |
| any missing path | `deploy/404.html` sends old Slidev links (`/<repo>/5`, `/<repo>/ch04`, `/<repo>/presenter/5`) to `/<repo>/slidev/#/…` |

To try the same layout locally: `pnpm site:build && pnpm build --base /<repo>/slidev/ --out dist-slidev`, then copy `site/dist/*` into a folder, `dist-slidev` into its `slidev/`, and `deploy/404.html` next to them.

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

Old single-course URLs (`#/ch04/3`, `#/presenter/ch04/3`, `#/print/ch04`) redirect to the course marked `legacy: true` (Spring Boot). Unknown courses or chapters go back to the picker / course home. Course ids must be lowercase letters, digits and `-`, and cannot be `presenter`, `print`, `join`, `track` or `chNN`.

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

### Learning tracks (學程)

The picker shows the tracks above the courses. A track (`tracks/<id>.yaml`, page `#/track/<id>`) is an ordered list of stages; each stage lists chapters from any course, in teaching order. Today: `basic` (基礎學程, ends with the Corner Café one-page site) and `advanced` (進階學程, ends with the online shop).

```yaml
title: 基礎學程          # also short, description, logo, color, order, project
stages:
  - title: 資料庫：MySQL
    desc: 建表、查詢…
    items:
      - { course: mysql, chapters: [1, "4-7"] }          # chapters of a course, in this order
      - { soon: "前後端串接", course: springboot, note: "…" }  # content not written yet → 準備中
```

- A chapter opened from a track page carries `?track=<id>`. While the chapter is part of that track, 「下一章／上一章」 follow the track (across courses, skipping chapters not in the track), the deck shows a chip like `基礎 14/63`, the close button returns to the track page, and presenter mode / the audience window keep the query. Navigating to a chapter outside the track drops it.
- `soon` items, and chapters or courses that are not on the site yet, show as 準備中 and are skipped by navigation; they become links automatically once the chapter exists.
- Track progress is computed from each course's own progress (no separate record); 「繼續學程」 opens the first unfinished chapter.
- Code: `plugins/deck.ts` (`tracksInfo`, exported as `tracks` from `virtual:deck`), `src/lib/track.ts`, `src/pages/Track.vue`, track handling in `src/lib/useDeck.ts`.
- The Spring Boot 「精簡路線」 was removed (it was built around the retired survey project); the tracks replace it. The lite-route code stays for other courses.

**Adding a course** (no code changes):
1. Create `courses/<id>/` (e.g. `courses/mysql/`).
2. Add `course.yaml` with at least `title`; copy `courses/springboot/course.yaml` and edit `units`, `lite`, `chapters` as needed (omit `legacy`).
3. Put the chapters in the folder as `01-topic.md`, `02-topic.md` … (Slidev-style Markdown: `---` separators, first slide is the cover). Images go in `public/` and are referenced as `/screenshots/...`.
4. Run `pnpm site:dev`: the course appears on `#/` (a running dev server picks up new course folders and chapter files by itself; restart it only after using a utility class in `class="…"` that no chapter used before, see `site/uno.config.ts`). Check it with `pnpm -C site run audit <id>`, then `pnpm site:build`.
5. Custom animation components are shared by all courses (`site/src/anim/`, registered in `main.ts` and `KNOWN_COMPONENTS`).

### Site internals

- `site/plugins/deck.ts` — Vite plugin: scans `courses/*/course.yaml`, splits each chapter into slides (`plugins/parse.ts`), renders Markdown + Shiki, compiles each slide to a Vue render function, and exposes `virtual:deck` (all courses with their chapter manifests, plus loaders), `virtual:deck-chapter:<course>/chNN` (lazy per chapter) and `virtual:deck-search:<course>` (search index of one course). Chapter titles/subtitles come from `chapters:` in `course.yaml`.
- `site/src/lib/deck.ts` — `courses`, `courseById`, `chapterById(course, ch)`, `loadChapter(course, ch)`, `loadSearch(course)`, `legacyCourse`. `site/src/lib/course.ts` — `currentCourseId` / `currentCourse`, set by the router from `:course` (used by `<Link>`, the sidebar and the search palette). Pages: `pages/Courses.vue` (picker), `pages/Home.vue` (course home), `Deck.vue`, `Presenter.vue`, `Print.vue`, `Join.vue`.
- `<Link to="chNN">` in chapter Markdown points to that chapter of the same course; `<Link to="home">` to the course home; `<Link to="java-adv/ch23">` to a chapter of another course.
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
  - Git course components (copied from slidev-git): `<Shot file="b02-01-….png" desc="…" />` (screenshot from `public/beginner/`, dashed placeholder until the file exists), `<CliBox :cmds="['git init']" note="…" />` (the CLI equivalent of a GitHub Desktop step), `<HistoryCheck :commits="[…]" />` (a GitHub Desktop History tab to compare with).
  - Cover slides get a Three.js backdrop automatically (`components/CoverBackdrop.vue`).
  - Chapters rewritten so far: ch01, ch04–ch11 (unit 1, all on the 小明 printing story), ch12–ch21 (unit 2, bubble-tea shop; code uses `Drink` / `Order`, `DrinkController` / `OrderController`); ch22–ch35 (unit 3, school registrar's office: 檔案室 = database, 承辦人員 = Dao / Spring JDBC, 組長 = Service, 櫃台 = Controller, 資深助理 = JPA, 申請單 = SQL; code uses `Student` with `className` / `score` from ch28, `Classroom`, `Penalty`, `Course`); ch36–ch41 (unit 4, same school office: 人的分工 = three layers, 三張紙 = PO / DTO / VO, 辦事指南 = OpenAPI, 櫃台退件 = Validation; from ch39 the code lives in a NEW project `school` with packages `controller` / `service` / `repository` / `entity` / `dto` / `vo`, `Student` has `idNumber` / `name` / `score`, DTOs `CreateStudentRequest` / `StudentResponse`, `ScoreVO`, practice entity `Club`); ch42–ch45 (unit 5, still the `school` project: 號碼牌＋置物櫃 = Session, 演練清單 / 替身 = unit test / Mock, 值班日誌 = Log, 工友的時間表 = `@Scheduled` in a `scheduler` package, 便利貼 = Cache with `#p0` keys; schedulers call `StudentService`, never the repository); ch46–ch48 (unit 6: 校門口警衛 = Spring Security with `Account` / `AccountService implements UserDetailsService` / roles `STUDENT` `TEACHER`, 蓋鋼印的通行證 = JWT with `security/JwtUtil` + `JwtAuthFilter` and `AuthController`, 拆成處室 = microservices in four NEW projects `eureka-server` / `student-service` / `club-service` / `gateway`; the Java code of these three chapters was compiled and run against Spring Boot 4.0.9, jjwt 0.13.0, Spring Cloud 2025.1.4); two chapters were ADDED later and everything after them renumbered: ch29 (JPA relations: `ReportCard` 1—N `SubjectScore`, N—N `Award`; `@JsonIgnore` to stop the JSON loop) and ch38 (Java extras tried in a `Playground` main: enum, record, generics `Reply<T>`, Stream, `orElseThrow`, custom exception, `LocalDate`). The IDE used throughout the course is Eclipse. Unit 7 (實戰專題) replaced the retired survey project: ch49 前後端串接 (CORS story of two buildings, DevTools Network, status codes) and ch50 轉角咖啡後端 (projects/cafe-api) are in the basic track; ch51–57 build the online shop backend (projects/cafe-shop-api): ch51 8 tables + Flyway + entities (`OrderStatus.canChangeTo`), ch52 `AppResponse<T>` / `RspCode` / `BizException`, register = always USER, JWT, `SecurityConfig` (ECPay URLs permitAll), ch53 products (optional-parameter `@Query` + Pageable, variants merged by id with orphanRemoval, upload, `@Cacheable` categories), ch54 cart (merge from localStorage, `ShippingPolicy`), ch55 orders (`@Transactional`, conditional `UPDATE … WHERE stock >= ?`, snapshots, timeout `@Scheduled`, `@Profile("dev")` mock payment), ch56 ECPay (CheckMacValue + unit test, notify returns `1|OK`, result 302, Cloudflare Tunnel, test card, QueryTradeInfo), ch57 admin orders + MyBatis XML reports. API paths and JSON shapes must match SHOP-SPEC §9 and the Angular ch60–61 code. All of it was run against MySQL 9.7 (curl + Playwright); the ECPay staging cashier accepted the generated form, the card step itself was not automated. Do not put `|` inside `<Pairs rows>` / `<Poll options>` (it is the separator; write `1｜OK`), and `=` inside a Pairs row breaks it too. ch02 (小明開學前準備文具: JDK 21 Temurin = 語言, Eclipse = 書桌, MySQL = 檔案櫃, Git = 存檔點, GitHub = 雲端作業簿, GitHub Desktop = 按鈕版; install screenshots kept) and ch03 (第一次到便利商店: Initializr = 配好的工具箱, Eclipse import = 搬上書桌, `MyController` = 掛名牌的店員, run = 按下列印鈕; Spring Boot 4 default, Java 21) were rewritten last. Slidev does not know the custom tags, so those chapters degrade there.
- `site/src/pages/Print.vue` (`#/print/<course>/chNN`) + `site/scripts/export-pdf.mjs` — PDF export: one slide per 980x552 page in its final animation state, vector text. The script starts its own Vite server and uses Playwright from the repo root's `playwright-chromium` (or a global `playwright`).
- `site/src/lib/units.ts` — `unitOf(course, num)`; the units themselves are `units:` in each `course.yaml`.
- `site/src/lib/route.ts` — the 「精簡路線」 (lite route), per course: chapters in `lite.optional` of `course.yaml` are hidden on the course home and sidebar (the sidebar keeps the chapter being viewed, marked 選修) and skipped by next/previous chapter. No course uses it at the moment (Spring Boot's was replaced by the learning tracks). The choice (`settings.routes[<course>]`, toggled on the course home) is stored in localStorage.
- Chapters in a track must not depend on chapters outside it: when a slide refers to one, keep it self-contained. (Example: ch39 explains `ResponseEntity` on its own slide because ch34, which first used it, is only in the advanced track.)
- Supported Markdown syntax: `---` separators, per-slide frontmatter (`layout`, `class`), trailing `<!-- -->` speaker notes, `<Link to="chNN">`, `::right::`, ```` ```mermaid ````, utility classes in `class="..."`, hand-written HTML (`<table style=…>` is left as is; only Markdown tables get the `.table-wrap` wrapper). Hand-written `<code>` gets `v-pre`, so Angular/Vue template syntax like `<code>{{ x }}</code>` shows literally; `{{ }}` anywhere else in HTML is evaluated by Vue, so keep it in backticks or code blocks. A fence may follow a list marker (`2. ```css`). A slide may contain its own `<style>` block (outside code fences): like Slidev, it only applies to that slide (the plugin scopes every selector to `.slide-inner[data-css=…]`).

## Chapter rewrite for beginners (Spring Boot units 1–6 ch01–48 done; unit 7 ch49–57 written new for the Corner Café projects)

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
