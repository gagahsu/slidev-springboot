---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot Masterclass
routeAlias: home
style: |
  .slidev-layout p,
  .slidev-layout li,
  .slidev-layout td,
  .slidev-layout th,
  .slidev-layout div {
    font-size: max(16px, 1em);
  }
  table {
    width: 100%;
    margin: 1rem 0;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px !important;
    border: 1px solid #e2e8f0 !important;
  }
  .index-table td {
    text-align: center;
    font-family: monospace;
  }
---

<style>
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 960px;
  margin-top: 1.2rem;
}
.chapter-card {
  display: block;
  background: #f0faf9;
  border: 2px solid #5eada0;
  border-radius: 12px;
  padding: 1.2rem 0.8rem;
  text-decoration: none !important;
  color: #1a5c5c !important;
  transition: all 0.2s ease;
}
.chapter-card:hover {
  background: #5eada0;
  color: white !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(94, 173, 160, 0.35);
}
.chapter-card:hover .chapter-subtitle {
  color: rgba(255,255,255,0.85) !important;
}
.chapter-num {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 0.3rem;
}
.chapter-subtitle {
  font-size: max(13px, 0.88rem);
  color: #4a7c7c;
  margin-top: 0.3rem;
}
</style>

<div class="flex flex-col items-center h-full" style="background: #ffffff; overflow-y: auto; padding: 1.5rem 0;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem;">Spring Boot Backend Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.2; margin-bottom: 0.5rem;">課程目錄</h1>
  <div style="height: 4px; width: 240px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 0.5rem;"></div>
  <p style="color: #9dc4c4; font-size: 0.9rem; margin-bottom: 0;">點擊章節卡片開始學習</p>
  <div class="chapter-grid">
    <Link to="ch01" class="chapter-card">
      <div class="chapter-num">Ch 1</div>
      <div>Spring Boot 介紹</div>
      <div class="chapter-subtitle">Backend Framework Intro</div>
    </Link>
    <Link to="ch02" class="chapter-card">
      <div class="chapter-num">Ch 2</div>
      <div>環境安裝</div>
      <div class="chapter-subtitle">JDK &amp; IntelliJ Setup</div>
    </Link>
    <Link to="ch03" class="chapter-card">
      <div class="chapter-num">Ch 3</div>
      <div>第一個 Spring Boot 專案</div>
      <div class="chapter-subtitle">Hello World Project</div>
    </Link>
    <Link to="ch04" class="chapter-card">
      <div class="chapter-num">Ch 4</div>
      <div>MVC 架構</div>
      <div class="chapter-subtitle">Model View Controller</div>
    </Link>
    <Link to="ch05" class="chapter-card">
      <div class="chapter-num">Ch 5</div>
      <div>REST API 基礎</div>
      <div class="chapter-subtitle">HTTP Methods &amp; Status</div>
    </Link>
    <Link to="ch06" class="chapter-card">
      <div class="chapter-num">Ch 6</div>
      <div>Controller 設計</div>
      <div class="chapter-subtitle">Request Handling</div>
    </Link>
    <Link to="ch07" class="chapter-card">
      <div class="chapter-num">Ch 7</div>
      <div>Service 層</div>
      <div class="chapter-subtitle">Business Logic</div>
    </Link>
    <Link to="ch08" class="chapter-card">
      <div class="chapter-num">Ch 8</div>
      <div>Repository 與 JPA</div>
      <div class="chapter-subtitle">Data Access Layer</div>
    </Link>
    <Link to="ch09" class="chapter-card">
      <div class="chapter-num">Ch 9</div>
      <div>資料庫連接</div>
      <div class="chapter-subtitle">MySQL Connection</div>
    </Link>
    <Link to="ch10" class="chapter-card">
      <div class="chapter-num">Ch 10</div>
      <div>CRUD 操作</div>
      <div class="chapter-subtitle">Create Read Update Delete</div>
    </Link>
    <Link to="ch11" class="chapter-card">
      <div class="chapter-num">Ch 11</div>
      <div>DTO 設計</div>
      <div class="chapter-subtitle">Data Transfer Object</div>
    </Link>
    <Link to="ch12" class="chapter-card">
      <div class="chapter-num">Ch 12</div>
      <div>請求參數</div>
      <div class="chapter-subtitle">Path / Query / Body</div>
    </Link>
    <Link to="ch13" class="chapter-card">
      <div class="chapter-num">Ch 13</div>
      <div>回應格式設計</div>
      <div class="chapter-subtitle">Response Design</div>
    </Link>
    <Link to="ch14" class="chapter-card">
      <div class="chapter-num">Ch 14</div>
      <div>例外處理</div>
      <div class="chapter-subtitle">Exception Handling</div>
    </Link>
    <Link to="ch15" class="chapter-card">
      <div class="chapter-num">Ch 15</div>
      <div>驗證</div>
      <div class="chapter-subtitle">Bean Validation</div>
    </Link>
    <Link to="ch16" class="chapter-card">
      <div class="chapter-num">Ch 16</div>
      <div>Spring Security</div>
      <div class="chapter-subtitle">Security Configuration</div>
    </Link>
    <Link to="ch17" class="chapter-card">
      <div class="chapter-num">Ch 17</div>
      <div>JWT 認證</div>
      <div class="chapter-subtitle">JSON Web Token</div>
    </Link>
    <Link to="ch18" class="chapter-card">
      <div class="chapter-num">Ch 18</div>
      <div>CORS 設定</div>
      <div class="chapter-subtitle">Cross-Origin Resource Sharing</div>
    </Link>
    <Link to="ch19" class="chapter-card">
      <div class="chapter-num">Ch 19</div>
      <div>單元測試</div>
      <div class="chapter-subtitle">JUnit &amp; Mockito</div>
    </Link>
    <Link to="ch20" class="chapter-card">
      <div class="chapter-num">Ch 20</div>
      <div>整合測試</div>
      <div class="chapter-subtitle">Integration Testing</div>
    </Link>
    <Link to="ch21" class="chapter-card">
      <div class="chapter-num">Ch 21</div>
      <div>Docker 打包</div>
      <div class="chapter-subtitle">Containerization</div>
    </Link>
    <Link to="ch22" class="chapter-card">
      <div class="chapter-num">Ch 22</div>
      <div>部署</div>
      <div class="chapter-subtitle">Deployment</div>
    </Link>
  </div>
</div>

---
src: ./ch01-springboot-intro.md
---

---
src: ./ch02-setup.md
---

---
src: ./ch03-first-project.md
---

---
src: ./ch04-mvc.md
---

---
src: ./ch05-rest-api.md
---

---
src: ./ch06-controller.md
---

---
src: ./ch07-service.md
---

---
src: ./ch08-repository-jpa.md
---

---
src: ./ch09-database.md
---

---
src: ./ch10-crud.md
---

---
src: ./ch11-dto.md
---

---
src: ./ch12-request-params.md
---

---
src: ./ch13-response.md
---

---
src: ./ch14-exception.md
---

---
src: ./ch15-validation.md
---

---
src: ./ch16-spring-security.md
---

---
src: ./ch17-jwt.md
---

---
src: ./ch18-cors.md
---

---
src: ./ch19-unit-test.md
---

---
src: ./ch20-integration-test.md
---

---
src: ./ch21-docker.md
---

---
src: ./ch22-deploy.md
---
