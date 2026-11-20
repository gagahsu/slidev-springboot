# AGENTS.md

Guidance for coding agents working in this repository. **`CLAUDE.md` is the authoritative, detailed guide** (folder layout, site internals, authoring rules); this file is a short summary.

## What this repository is

Teaching slides for seven courses (Spring Boot, MySQL, Angular, Git, Java, Java 進階, Docker) in `courses/<id>/`, two learning tracks in `tracks/`, project specs in `specs/`, and the reference code of the course projects in `projects/`. It is a Node.js project, not a Java application.

- `site/` — the self-built Vue 3 + Vite slide site that renders every course (`pnpm site:dev`, `pnpm site:build`, `pnpm -C site run audit <course> [chNN…]`).
- Repository root — the original Slidev deck for the Spring Boot course only (`pnpm dev`, `pnpm build`; entry `index.md`).
- `projects/` — `cafe-api` / `cafe-shop-api` (Spring Boot 4.1.2, Gradle, Java 21) and `cafe-web` / `cafe-shop-web` (Angular 21, npm). These have their own tools; the slide site does not build them.
- `.github/workflows/deploy.yml` publishes the site and the Slidev deck to GitHub Pages on every push to `main`.

Package manager for the repository and `site/` is `pnpm`; do not use `npm` or `yarn` there (the Angular projects in `projects/` use npm, as the course teaches).

## Authoring rules (summary)

- Slide text in Traditional Chinese (zh-TW); code identifiers and technical terms in English.
- Chapter files are `NN-topic.md` with `routeAlias: chNN`; every slide has a conversational speaker note, `（下一步）` marks each animation step.
- Cover, section (`layout: section`) and end (`layout: end`) slides follow `_template/slides.md`.
- Do not modify `ref1.md`, `ref2.md`, `ref3.md` (input materials).
