---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
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
      <div class="chapter-subtitle">MySQL / Git / GitHub Desktop</div>
    </Link>
    <Link to="ch03" class="chapter-card">
      <div class="chapter-num">Ch 3</div>
      <div>第一個 Spring Boot 程式</div>
      <div class="chapter-subtitle">Eclipse / Spring Initializr / Gradle</div>
    </Link>
    <Link to="ch04" class="chapter-card">
      <div class="chapter-num">Ch 4</div>
      <div>Spring IoC 簡介</div>
      <div class="chapter-subtitle">控制反轉 / Spring 容器</div>
    </Link>
    <Link to="ch05" class="chapter-card">
      <div class="chapter-num">Ch 5</div>
      <div>IoC、DI、Bean 介紹</div>
      <div class="chapter-subtitle">依賴注入 / Bean 定義</div>
    </Link>
    <Link to="ch06" class="chapter-card">
      <div class="chapter-num">Ch 6</div>
      <div>Bean 的創建和注入</div>
      <div class="chapter-subtitle">@Component / @Autowired</div>
    </Link>
    <Link to="ch07" class="chapter-card">
      <div class="chapter-num">Ch 7</div>
      <div>指定注入的 Bean</div>
      <div class="chapter-subtitle">@Qualifier</div>
    </Link>
    <Link to="ch08" class="chapter-card">
      <div class="chapter-num">Ch 8</div>
      <div>Bean 的初始化</div>
      <div class="chapter-subtitle">@PostConstruct</div>
    </Link>
    <Link to="ch09" class="chapter-card">
      <div class="chapter-num">Ch 9</div>
      <div>讀取 Spring Boot 設定檔</div>
      <div class="chapter-subtitle">@Value / application.properties</div>
    </Link>
    <Link to="ch10" class="chapter-card">
      <div class="chapter-num">Ch 10</div>
      <div>Spring AOP 簡介</div>
      <div class="chapter-subtitle">切面導向程式設計</div>
    </Link>
    <Link to="ch11" class="chapter-card">
      <div class="chapter-num">Ch 11</div>
      <div>Spring AOP 的用法</div>
      <div class="chapter-subtitle">@Aspect / @Before / @Around</div>
    </Link>
    <Link to="ch12" class="chapter-card">
      <div class="chapter-num">Ch 12</div>
      <div>Spring MVC 簡介</div>
      <div class="chapter-subtitle">前後端溝通 / MVC 概念</div>
    </Link>
    <Link to="ch13" class="chapter-card">
      <div class="chapter-num">Ch 13</div>
      <div>Http 協議介紹</div>
      <div class="chapter-subtitle">Request / Response / Status Code</div>
    </Link>
    <Link to="ch14" class="chapter-card">
      <div class="chapter-num">Ch 14</div>
      <div>Url 路徑對應</div>
      <div class="chapter-subtitle">@RequestMapping</div>
    </Link>
    <Link to="ch15" class="chapter-card">
      <div class="chapter-num">Ch 15</div>
      <div>結構化的呈現數據</div>
      <div class="chapter-subtitle">JSON 格式介紹</div>
    </Link>
    <Link to="ch16" class="chapter-card">
      <div class="chapter-num">Ch 16</div>
      <div>返回值改成 JSON 格式</div>
      <div class="chapter-subtitle">@RestController 序列化</div>
    </Link>
    <Link to="ch17" class="chapter-card">
      <div class="chapter-num">Ch 17</div>
      <div>常見的 Http Method</div>
      <div class="chapter-subtitle">GET 和 POST</div>
    </Link>
    <Link to="ch18" class="chapter-card">
      <div class="chapter-num">Ch 18</div>
      <div>取得請求參數（上）</div>
      <div class="chapter-subtitle">@RequestParam / @RequestBody</div>
    </Link>
    <Link to="ch19" class="chapter-card">
      <div class="chapter-num">Ch 19</div>
      <div>取得請求參數（下）</div>
      <div class="chapter-subtitle">@RequestHeader / @PathVariable</div>
    </Link>
    <Link to="ch20" class="chapter-card">
      <div class="chapter-num">Ch 20</div>
      <div>RESTful API 介紹</div>
      <div class="chapter-subtitle">API 設計風格</div>
    </Link>
    <Link to="ch21" class="chapter-card">
      <div class="chapter-num">Ch 21</div>
      <div>實作 RESTful API</div>
      <div class="chapter-subtitle">@GetMapping / @PostMapping</div>
    </Link>
    <Link to="ch22" class="chapter-card">
      <div class="chapter-num">Ch 22</div>
      <div>Spring JDBC 簡介</div>
      <div class="chapter-subtitle">資料庫操作 / CRUD</div>
    </Link>
    <Link to="ch23" class="chapter-card">
      <div class="chapter-num">Ch 23</div>
      <div>資料庫連線設定</div>
      <div class="chapter-subtitle">application.properties / Eclipse DSE</div>
    </Link>
    <Link to="ch24" class="chapter-card">
      <div class="chapter-num">Ch 24</div>
      <div>Spring JDBC 的用法（上）</div>
      <div class="chapter-subtitle">INSERT / UPDATE / DELETE</div>
    </Link>
    <Link to="ch25" class="chapter-card">
      <div class="chapter-num">Ch 25</div>
      <div>Spring JDBC 的用法（下）</div>
      <div class="chapter-subtitle">SELECT / RowMapper</div>
    </Link>
    <Link to="ch26" class="chapter-card">
      <div class="chapter-num">Ch 26</div>
      <div>Spring Data JPA（上）</div>
      <div class="chapter-subtitle">@Entity / save / deleteById</div>
    </Link>
    <Link to="ch27" class="chapter-card">
      <div class="chapter-num">Ch 27</div>
      <div>Spring Data JPA（下）</div>
      <div class="chapter-subtitle">findAll / findById / 自訂查詢</div>
    </Link>
    <Link to="ch28" class="chapter-card">
      <div class="chapter-num">Ch 28</div>
      <div>Spring Data JPA — @Query 與 JPQL</div>
      <div class="chapter-subtitle">@Query / nativeQuery / @Modifying / 分頁</div>
    </Link>
    <Link to="ch29" class="chapter-card">
      <div class="chapter-num">Ch 29</div>
      <div>MyBatis（上）</div>
      <div class="chapter-subtitle">@Mapper / @Insert / @Update / @Delete</div>
    </Link>
    <Link to="ch30" class="chapter-card">
      <div class="chapter-num">Ch 30</div>
      <div>MyBatis（中）</div>
      <div class="chapter-subtitle">@Select / 自動映射</div>
    </Link>
    <Link to="ch31" class="chapter-card">
      <div class="chapter-num">Ch 31</div>
      <div>MyBatis（下）</div>
      <div class="chapter-subtitle">XML Mapper / 動態 SQL</div>
    </Link>
    <Link to="ch32" class="chapter-card">
      <div class="chapter-num">Ch 32</div>
      <div>@Transactional 事務管理</div>
      <div class="chapter-subtitle">ACID / rollbackFor / noRollbackFor</div>
    </Link>
    <Link to="ch33" class="chapter-card">
      <div class="chapter-num">Ch 33</div>
      <div>樂觀鎖 & 悲觀鎖</div>
      <div class="chapter-subtitle">@Version / @Lock / LockModeType</div>
    </Link>
    <Link to="ch34" class="chapter-card">
      <div class="chapter-num">Ch 34</div>
      <div>SQL Injection 防範</div>
      <div class="chapter-subtitle">參數化查詢 / PreparedStatement</div>
    </Link>
    <Link to="ch35" class="chapter-card">
      <div class="chapter-num">Ch 35</div>
      <div>MVC 架構模式</div>
      <div class="chapter-subtitle">Controller-Service-Dao 三層架構</div>
    </Link>
    <Link to="ch36" class="chapter-card">
      <div class="chapter-num">Ch 36</div>
      <div>Spring Boot 資料物件</div>
      <div class="chapter-subtitle">PO / DTO / VO / DAO</div>
    </Link>
    <Link to="ch37" class="chapter-card">
      <div class="chapter-num">Ch 37</div>
      <div>實戰：JPA CRUD API</div>
      <div class="chapter-subtitle">Entity / Repository / Service / Controller</div>
    </Link>
    <Link to="ch38" class="chapter-card">
      <div class="chapter-num">Ch 38</div>
      <div>OpenAPI 與 Swagger UI</div>
      <div class="chapter-subtitle">springdoc / @Operation / @Schema</div>
    </Link>
    <Link to="ch39" class="chapter-card">
      <div class="chapter-num">Ch 39</div>
      <div>Spring Boot Validation</div>
      <div class="chapter-subtitle">Bean Validation / @Valid / @Validated</div>
    </Link>
    <Link to="ch40" class="chapter-card">
      <div class="chapter-num">Ch 40</div>
      <div>HttpSession 管理</div>
      <div class="chapter-subtitle">Session / JSESSIONID / invalidate</div>
    </Link>
    <Link to="ch41" class="chapter-card">
      <div class="chapter-num">Ch 41</div>
      <div>單元測試與日誌</div>
      <div class="chapter-subtitle">JUnit 5 / Mockito / SLF4J / Logback</div>
    </Link>
    <Link to="ch42" class="chapter-card">
      <div class="chapter-num">Ch 42</div>
      <div>Spring Boot 排程</div>
      <div class="chapter-subtitle">@Scheduled / @EnableScheduling / Cron</div>
    </Link>
    <Link to="ch43" class="chapter-card">
      <div class="chapter-num">Ch 43</div>
      <div>Spring Boot Cache</div>
      <div class="chapter-subtitle">@Cacheable / @CacheEvict / @CachePut</div>
    </Link>
    <Link to="ch44" class="chapter-card">
      <div class="chapter-num">Ch 44</div>
      <div>Spring Security</div>
      <div class="chapter-subtitle">SecurityFilterChain / BCrypt / CSRF</div>
    </Link>
    <Link to="ch45" class="chapter-card">
      <div class="chapter-num">Ch 45</div>
      <div>JWT 認證</div>
      <div class="chapter-subtitle">jjwt / OncePerRequestFilter / Stateless</div>
    </Link>
    <Link to="ch46" class="chapter-card">
      <div class="chapter-num">Ch 46</div>
      <div>Spring Cloud 微服務</div>
      <div class="chapter-subtitle">Eureka / Gateway / OpenFeign / Config</div>
    </Link>
    <Link to="ch47" class="chapter-card">
      <div class="chapter-num">Ch 47</div>
      <div>實戰：動態問卷系統</div>
      <div class="chapter-subtitle">CRUD / Session / JWT Auth</div>
    </Link>

  </div>
</div>

---
src: ./01-springboot-intro.md
---
---
src: ./02-setup-env.md
---
---
src: ./03-first-spring-boot.md
---
---
src: ./04-spring-ioc.md
---
---
src: ./05-ioc-di-bean.md
---
---
src: ./06-component-autowired.md
---
---
src: ./07-qualifier.md
---
---
src: ./08-post-construct.md
---
---
src: ./09-value-properties.md
---
---
src: ./10-spring-aop-intro.md
---
---
src: ./11-aop-aspect.md
---
---
src: ./12-spring-mvc-intro.md
---
---
src: ./13-http-protocol.md
---
---
src: ./14-request-mapping.md
---
---
src: ./15-json-format.md
---
---
src: ./16-restcontroller-json.md
---
---
src: ./17-get-post.md
---
---
src: ./18-request-param-body.md
---
---
src: ./19-request-header-pathvariable.md
---
---
src: ./20-restful-api.md
---
---
src: ./21-restful-api-impl.md
---
---
src: ./22-spring-jdbc-intro.md
---
---
src: ./23-db-connection.md
---
---
src: ./24-jdbc-update.md
---
---
src: ./25-jdbc-query.md
---
---
src: ./26-jpa-upper.md
---
---
src: ./27-jpa-lower.md
---
---
src: ./28-jpa-query.md
---
---
src: ./29-mybatis-upper.md
---
---
src: ./30-mybatis-lower.md
---
---
src: ./31-mybatis-xml.md
---
---
src: ./32-transactional.md
---
---
src: ./33-lock.md
---
---
src: ./34-sql-injection.md
---
---
src: ./35-mvc-architecture.md
---
---
src: ./36-data-objects.md
---
---
src: ./37-jpa-practice.md
---
---
src: ./38-openapi.md
---
---
src: ./39-validation.md
---
---
src: ./40-httpsession.md
---
---
src: ./41-unit-test-logging.md
---
---
src: ./42-scheduling.md
---
---
src: ./43-cache.md
---
---
src: ./44-spring-security.md
---
---
src: ./45-jwt.md
---
---
src: ./46-spring-cloud.md
---
---
src: ./47-dynamic-survey.md
---

