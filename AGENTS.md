# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

## 貫穿專案：動態問卷系統

本課程 ch28、ch37–ch41、ch44–ch45、ch47 的練習題全部圍繞「動態問卷系統」，跨課程（MySQL / Spring Boot / Angular / Docker）共用。**規格以 `SURVEY-SPEC.md` 為準**（各 repo 內容一致，修改時要同步）。

- **版本：** Spring Boot **4.1.1**（不選 SNAPSHOT）、Java 21、Gradle - Groovy；Spring Security 7、Hibernate 7、Jackson 3（`tools.jackson.*`）
- **`sql/`：** `schema.sql`、`seed.sql`（與 `slidev-mysql/sql/` 相同）、`ch45-refresh-tokens.sql`（ch45 新增的表）
- **`reference/dynamic-survey/`：** 可執行的參考答案（`./gradlew test`、`./e2e.sh`）。**投影片裡的程式碼必須取自這個專案**（已編譯、測試過）；改題目時先改參考專案並跑過測試與 `e2e.sh`，再改投影片
- **章節解答是逐步累積的**：ch40 的 `submit` 沒有登入者參數，ch44 才加入；參考專案是最終版
- 練習題的做法（PO ↔ DTO、`AppResponse`、`BizException`、Session 暫存、JWT + Session 並存）見 `47-dynamic-survey.md` 的疑難排解表
- **投影片排版：** 練習題的投影片一張只放約 20 行程式碼（畫布 980×552）。長程式碼會拆成「（續）」頁並加上「接上一頁 / 見下一頁」註解；投影片內的 `<style>` 區塊才是投影片層級的 CSS（frontmatter 的 `style:` 不是 CSS 規則區塊）
