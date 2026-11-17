/** Course units shown on the home page and in the sidebar. Edit freely: `from`/`to` are chapter numbers (inclusive). */
export interface Unit { title: string, desc: string, from: number, to: number, color: string }

export const units: Unit[] = [
  { title: 'Spring 核心', desc: 'Spring Boot 入門、IoC、DI、Bean 與 AOP', from: 1, to: 11, color: 'green' },
  { title: 'Spring MVC 與 RESTful API', desc: 'HTTP、JSON、請求參數與 API 設計', from: 12, to: 21, color: 'blue' },
  { title: '資料庫存取', desc: 'Spring JDBC、JPA、MyBatis、交易與鎖', from: 22, to: 35, color: 'purple' },
  { title: '架構與實務', desc: 'MVC 分層、資料物件、API 文件與驗證', from: 36, to: 41, color: 'orange' },
  { title: '進階功能', desc: 'Session、測試與日誌、排程、快取', from: 42, to: 45, color: 'pink' },
  { title: '安全與微服務', desc: 'Spring Security、JWT、Spring Cloud', from: 46, to: 48, color: 'teal' },
  { title: '實戰專題', desc: '把整門課串起來的完整專案', from: 49, to: 99, color: 'yellow' },
]

export const unitOf = (num: number) => units.find(u => num >= u.from && num <= u.to) ?? units[0]
