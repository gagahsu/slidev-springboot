---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題：轉角咖啡後端
routeAlias: ch50
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題：轉角咖啡後端
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「菜單 API、訂位 API，一次用上整門課」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第五十章，基礎學程的專題。

這一章我們要從零做出一個真正的後端：轉角咖啡一頁式網站的 API。客人可以看菜單、可以線上訂位。

用到的東西都學過：建專案、JPA、三層架構、DTO、欄位檢查，還有上一章的 CORS。這一章是把它們組起來。
-->

---

# 先看成品

轉角咖啡的一頁式網站，由上到下：

<v-clicks>

- **導覽列**、**主視覺**：寫死在前端，不用後端
- **菜單**：分類分頁，每個品項有圖、名稱、說明、價格 → 需要**菜單 API**
- **線上訂位**：填姓名、手機、日期、時段、人數 → 需要**訂位 API**
- **營業資訊**：地址、電話、營業時間，寫死在前端
- （加分）店家輸入日期，查當天的訂位 → **查訂位 API**

</v-clicks>

<!--
先看我們要做的成品。這是一個一頁式網站，由上到下有五個區塊。

（下一步）導覽列和主視覺，內容不會變，直接寫在前端。

（下一步）菜單，有分類分頁，每個品項有圖片、名稱、說明和價格。菜單會改，所以資料放資料庫，需要菜單 API。

（下一步）線上訂位，客人填好資料送出，要存進資料庫，需要訂位 API。

（下一步）營業資訊也是寫死在前端。

（下一步）加分題：店家輸入日期，查看那一天的訂位。

所以後端要做的，就是這三支 API。完整的需求寫在 specs 資料夾的 CAFE-SPEC.md，這份就是我們的規格書。
-->

---

# 故事：開店前的準備

開一家咖啡店，老闆不會一開門才想菜單。開店前要先準備好：

<v-clicks>

- **企劃書**：賣什麼、怎麼訂位、有哪些規矩
- **倉庫和帳本**：菜單和訂位要記在哪裡
- **分工**：倉管、店長、櫃台各做什麼
- **櫃台的規矩**：哪些訂位要當場退回
- **門口的公告**：歡迎哪些人來拿菜單

</v-clicks>

<!--
用開店來想這件事。開一家咖啡店，老闆不會等到開門才想菜單。

（下一步）要先有企劃書：賣什麼、怎麼訂位、有哪些規矩。

（下一步）要有倉庫和帳本：菜單和訂位要記在哪裡。

（下一步）要分工：倉管、店長、櫃台，各自負責什麼。

（下一步）櫃台要有規矩：哪些訂位當場就要退回去。

（下一步）門口要有公告：歡迎哪些人來拿菜單，這就是上一章的 CORS。
-->

---

# 對應到程式

<Pairs left="開店" right="後端專案" rows="doc,企劃書=doc,規格書 CAFE-SPEC.md（API 路徑、欄位、規則）|cabinet,倉庫和帳本=cabinet,MySQL 的 corner_cafe 資料庫|staff,倉管=code,Entity + Repository（JPA）|teacher,店長=code,Service：店家的規則|clerk,櫃台=code,Controller + DTO + @Valid|guard,門口的公告=code,CorsConfig" />

<!--
對應到程式。

（下一步）企劃書，就是規格書 CAFE-SPEC.md，裡面寫好了 API 的路徑、欄位和規則。我們照著做，前端的同學也照著做，兩邊才接得起來。

（下一步）倉庫和帳本，是 MySQL 的 corner_cafe 資料庫。

（下一步）倉管負責拿東西、放東西，是 Entity 和 Repository。

（下一步）店長負責店家的規則，例如只收三十天內的訂位，是 Service。

（下一步）櫃台負責接待客人、檢查表單，是 Controller、DTO 和 @Valid。

（下一步）門口的公告，是 CorsConfig。
-->

---

# 想一想

<Poll question="「只能預約 30 天內的日期」這條規則，最適合寫在哪一層？" options="Entity|Repository|Service|CorsConfig" answer="3" />

<!--
想一想。「只能預約三十天內的日期」這條規則，最適合寫在哪一層？

答案是 Service，也就是店長。這是店家自己的規矩，跟資料怎麼存、網址長什麼樣子都沒關係。第三十六章說過，商業規則放 Service。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 企劃書與資料庫

<!--
先看企劃書和資料庫。
-->

---

# 三支 API

| 方法 | 路徑 | 用途 | 成功 |
| --- | --- | --- | --- |
| GET | `/api/categories` | 菜單分類 | 200 |
| GET | `/api/products?categoryId=1` | 供應中的品項（`categoryId` 可省略） | 200 |
| POST | `/api/reservations` | 新增訂位 | **201** |
| GET | `/api/reservations?date=2026-11-20` | （加分）某天的訂位 | 200 |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 路徑、欄位名稱、錯誤格式都照規格書，<b>一個字都不要改</b>：前端是照同一份規格寫的。
</div>

</v-click>

<!--
規格書裡定義了這幾支 API。

查分類、查品項，都是 GET。品項可以帶 categoryId 只查一個分類，不帶就是全部。注意只回傳供應中的品項，暫停供應的不出現。

新增訂位是 POST，成功回 201 Created，代表新建立了一筆資料。

加分題是用日期查訂位。

（下一步）提醒大家，路徑、欄位名稱、錯誤的格式，都照規格書寫，一個字都不要改。前端是照同一份規格書寫的，你改了一個字，前端就接不起來了。
-->

---

# 資料庫：corner_cafe

在 MySQL 課已經建過。還沒有的話，下載兩個檔案，用 Workbench 的 **File → Open SQL Script** 打開，按閃電圖示依序執行：

- <a href="/downloads/corner_cafe/schema.sql" download><code>schema.sql</code></a>：建立 `corner_cafe` 與三張表
- <a href="/downloads/corner_cafe/seed.sql" download><code>seed.sql</code></a>：5 個分類、12 個品項、6 筆訂位

<v-clicks>

- `categories`：咖啡、茶飲、甜點、輕食、季節限定（還沒有品項）
- `products`：`category_id` 指向分類；`available` = 0 表示暫停供應
- `reservations`：姓名、手機、日期、時段、人數、備註

</v-clicks>

<!--
資料庫在 MySQL 課已經建過了。如果還沒有，點投影片上的兩個檔名下載，在 Workbench 用 File、Open SQL Script 打開，按閃電圖示執行。先執行 schema，再執行 seed。

（下一步）categories 是分類，有五個，其中季節限定還沒有品項。

（下一步）products 是品項，category_id 指向分類。available 是零，表示暫停供應，例如季節水果塔。

（下一步）reservations 是訂位。範例資料的日期是相對於今天的，所以什麼時候執行，今天都會有訂位可以查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 建專案、分資料夾

<!--
接下來建立專案。
-->

---

# 建立 cafe-api 專案

到 `start.spring.io`：

<v-clicks>

- **Gradle - Groovy**、**Java**、Spring Boot **4.1.x**、Java **21**
- Group `com.example`、Artifact `cafe-api`、Package name `com.example.cafe`
- Dependencies：**Spring Web**、**Spring Data JPA**、**Validation**、**MySQL Driver**、**Lombok**、**Spring Boot DevTools**
- 下載、解壓縮，把 `cafe-api` 資料夾**裡面的檔案**全部複製到 Git 課建好的 `cafe-api` repository 資料夾（和 `README.md` 放在一起）
- Eclipse 匯入那個資料夾（Import → Existing Gradle Project）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 不要把整個資料夾拖進去變成 <code>cafe-api/cafe-api</code>：GitHub Desktop 要看得到 <code>build.gradle</code> 就在第一層。
</div>

</v-click>

<!--
到 start.spring.io 建立專案。

（下一步）一樣選 Gradle Groovy、Java，Spring Boot 4.1 版，Java 21。

（下一步）Artifact 填 cafe-api，Package name 改成 com.example.cafe，短一點比較好讀。

（下一步）Dependencies 加六個：Spring Web 寫 API、Spring Data JPA 存取資料庫、Validation 做欄位檢查、MySQL Driver 連 MySQL、Lombok 省掉 getter setter，還有 DevTools，改完程式會自動重新啟動。

（下一步）下載後解壓縮。Git 課的時候，我們已經用 GitHub Desktop 建好一個 cafe-api 的 repository，裡面只有 README。把解壓縮出來的 cafe-api 資料夾打開，裡面的檔案全部複製到那個 repository 的資料夾，跟 README 放在一起。

（下一步）然後在 Eclipse 用 Import，選 Existing Gradle Project，匯入那個資料夾。

（下一步）注意不要把整個資料夾拖進去，變成 cafe-api 裡面又有一個 cafe-api。打開 GitHub Desktop，應該看到 build.gradle、src 這些新檔案等著 commit。
-->

---

# 連線設定與資料夾

`application.properties`：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/corner_cafe
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=none
```

<v-click>

在 `com.example.cafe` 底下先建好七個資料夾：

`entity` · `repository` · `dto` · `service` · `controller` · `exception` · `config`

</v-click>

<!--
在 application.properties 設定資料庫連線，帳號密碼換成你自己的。

ddl-auto 設成 none，表示資料表由我們的 schema.sql 建立，JPA 不要自己去建表或改表。

（下一步）接著在 com.example.cafe 底下，先把資料夾建好：entity、repository、dto、service、controller、exception，還有放 CORS 設定的 config。一開始就分好，程式寫多了也不會亂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 菜單 API

<!--
先做菜單 API，由裡往外寫。
-->

---

# Entity：Product

```java {all|1-2|8-9|15|17-18}
@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "category_id")
    private Integer categoryId;
    private String name;
    private String description;
    private Integer price;
    @Column(name = "image_url")
    private String imageUrl;
    private Boolean available;
    @Column(name = "sort_order")
    private Integer sortOrder;
}
```

<!--
從最裡面的 Entity 開始。

（下一步）@Entity 和 @Table，對應到 products 這張表。

（下一步）欄位名稱有底線的，例如 category_id，用 @Column 寫出資料表的欄位名稱，Java 這邊用駝峰式的 categoryId。

（下一步）available 用 Boolean，資料庫的 1 和 0 會自動轉成 true 和 false。

（下一步）sortOrder 也一樣用 @Column 對應。Category 和 Reservation 兩個 Entity 照同樣的方式寫，下一頁就是。
-->

---

# 另外兩個 Entity

<div class="grid grid-cols-2 gap-4">
<div>

```java
@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Column(name = "sort_order")
    private Integer sortOrder;
}
```

</div>
<div>

```java
@Entity
@Table(name = "reservations")
@Getter
@Setter
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String phone;
    private String email;
    @Column(name = "reserve_date")
    private LocalDate reserveDate;
    @Column(name = "reserve_time")
    private LocalTime reserveTime;
    private Integer people;
    private String note;
}
```

</div>
</div>

<!--
另外兩張表的 Entity，寫法跟 Product 完全一樣，一樣放在 entity 資料夾。

左邊是分類，只有編號、名稱和排序。

右邊是訂位。日期用 LocalDate，時間用 LocalTime，對應資料表的 DATE 和 TIME。有底線的欄位一樣用 @Column 寫出資料表的名稱。

資料表還有一個 created_at，由資料庫自己填上現在的時間，我們用不到，所以不寫也沒關係。
-->

---

# Repository：用方法名稱查詢

```java {all|4|7}
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 供應中的品項，先依分類、再依排序欄位
    List<Product> findByAvailableTrueOrderByCategoryIdAscSortOrderAsc();

    // 某個分類裡供應中的品項
    List<Product> findByCategoryIdAndAvailableTrueOrderBySortOrder(Integer categoryId);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 第 27 章學過：方法名稱照規則寫，JPA 會自動產生 SQL。<code>AvailableTrue</code> 就是 <code>WHERE available = 1</code>。
</div>

</v-click>

<!--
Repository 用第二十七章學過的方法名稱查詢。

（下一步）第一個方法：available 是 true 的品項，依分類、再依排序欄位排好。名字很長，但讀起來就是一句英文。

（下一步）第二個方法：多一個條件，分類編號等於參數。

（下一步）AvailableTrue 就是 available 等於 1，暫停供應的品項就這樣被濾掉了。
-->

---

# 另外兩個 Repository

```java {all|2|6}
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByOrderBySortOrder();   // 全部分類，依排序欄位
}

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByReserveDateOrderByReserveTime(LocalDate reserveDate);  // 加分題用
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 新增訂位用的 <code>save</code>、檢查分類存不存在的 <code>existsById</code>，<code>JpaRepository</code> 都已經有了，不用自己寫。
</div>

</v-click>

<!--
分類和訂位也各要一個 Repository，一樣放在 repository 資料夾，一個檔案一個介面。

（下一步）分類：findAll 加上 OrderBySortOrder，就是查全部、依排序欄位排好。

（下一步）訂位：用日期查，依時段排好。這是加分題「店家查訂位」要用的，先寫好放著。

（下一步）新增訂位用的 save，還有等一下檢查分類存不存在的 existsById，JpaRepository 都已經幫我們準備好了。
-->

---

# DTO 與 Service

```java {all|1-2|8-12|13-14}
public record ProductDto(Integer id, Integer categoryId, String name,
        String description, Integer price, String imageUrl) {}

@Service
public class MenuService {
    @Autowired private ProductRepository productRepository;

    public List<ProductDto> getProducts(Integer categoryId) {
        List<Product> products = (categoryId == null)
            ? productRepository.findByAvailableTrueOrderByCategoryIdAscSortOrderAsc()
            : productRepository.findByCategoryIdAndAvailableTrueOrderBySortOrder(categoryId);
        return products.stream()
            .map(p -> new ProductDto(p.getId(), p.getCategoryId(), p.getName(),
                    p.getDescription(), p.getPrice(), p.getImageUrl()))
            .toList();
    }
}
```

<!--
接著是 DTO 和 Service。

（下一步）ProductDto 用 record，只放前端需要的欄位。available、sortOrder、建立時間這些內部資料，就不送出去。

（下一步）Service 判斷有沒有帶 categoryId：沒有就查全部，有就只查那個分類。

（下一步）最後用 Stream 的 map，把每個 Entity 轉成 DTO，再收集成 List。這是第三十八章學過的寫法。

規格書還要求：帶了不存在的分類編號，要回 404。下一頁補上。
-->

---

# 查分類，找不到就 404

```java {all|1|5-9|12-16}
public record CategoryDto(Integer id, String name, Integer sortOrder) {}

// MenuService 再加上：
@Autowired private CategoryRepository categoryRepository;
public List<CategoryDto> getCategories() {
    return categoryRepository.findAllByOrderBySortOrder().stream()
        .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSortOrder()))
        .toList();
}

// getProducts 裡，有帶 categoryId 時先檢查：
if (categoryId != null && !categoryRepository.existsById(categoryId)) {
    throw new NotFoundException("找不到這個分類");
}
```

<!--
菜單還需要分類的資料，前端要用它做分類頁籤。

（下一步）CategoryDto 也是 record，三個欄位跟規格書的 JSON 一樣。放在 dto 資料夾。

（下一步）MenuService 多注入一個 CategoryRepository，加上 getCategories：查出全部分類，一樣用 Stream 轉成 DTO。

（下一步）getProducts 的最前面，加上這個檢查：有帶分類編號，而且這個分類不存在，就丟出 NotFoundException。這是我們自己寫的例外，等一下在統一的錯誤處理裡，會把它變成 404。
-->

---

# Controller

```java {all|2|7-9|11-15}
@RestController
@RequestMapping("/api")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping("/categories")
    public List<CategoryDto> getCategories() {
        return menuService.getCategories();
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts(
            @RequestParam(name = "categoryId", required = false) Integer categoryId) {
        return menuService.getProducts(categoryId);
    }
}
```

<!--
最外面是 Controller。

（下一步）@RequestMapping 寫 /api，底下的路徑都會以 /api 開頭。

（下一步）查分類，直接交給 Service。

（下一步）查品項，categoryId 是網址問號後面的參數，用 @RequestParam。required 等於 false，表示可以不帶，不帶的時候就是 null。

寫完之後，用瀏覽器打開 localhost 8080 斜線 api 斜線 products，應該看到十一個品項，季節水果塔不在裡面。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 訂位 API

<!--
接下來是訂位 API，重點在檢查。
-->

---

# 兩道關卡

客人送來的訂位，要過兩道關卡才能存進資料庫：

<v-clicks>

- **櫃台（`@Valid`）**：格式對不對
  - 姓名必填、手機 `09` 開頭共 10 碼、人數 1～8、備註最多 200 字
- **店長（Service）**：符不符合店家的規矩
  - 日期在今天到 30 天後、時段在 10:00～19:30 而且是整點或半點
- 任何一關沒過 → **400**，告訴前端是哪個欄位、什麼原因

</v-clicks>

<!--
訂位的資料是客人填的，什麼都可能出現，所以要過兩道關卡。

（下一步）第一道是櫃台，用第四十一章的 @Valid 檢查格式：姓名必填、手機要 09 開頭共十碼、人數一到八位、備註最多兩百字。

（下一步）第二道是店長，也就是 Service，檢查店家的規矩：日期要在今天到三十天後，時段要在營業時間內，而且是整點或半點。這種跟「今天是幾號」有關的規則，寫在 Service 比較清楚。

（下一步）任何一關沒過，都回 400，而且要告訴前端是哪個欄位、什麼原因。
-->

---

# 第一關：Request DTO 加上規則

```java {all|2-3|5-6|8-10|all}
public record ReservationRequest(
        @NotBlank(message = "請輸入姓名") @Size(max = 20, message = "姓名最多 20 字")
        String name,

        @NotBlank(message = "請輸入手機") @Pattern(regexp = "09\\d{8}", message = "手機格式不正確")
        String phone,

        @NotNull(message = "請輸入人數")
        @Min(value = 1, message = "至少 1 位") @Max(value = 8, message = "一次最多預約 8 位")
        Integer people,

        @Email(message = "Email 格式不正確") String email,
        @NotNull(message = "請選擇日期") LocalDate reserveDate,
        @NotNull(message = "請選擇營業時段") LocalTime reserveTime,
        @Size(max = 200, message = "備註最多 200 字") String note) {}
```

<!--
第一關，在 Request DTO 的欄位上加規則。

（下一步）姓名不能空白，最多二十字。

（下一步）手機用 @Pattern 寫規則：09 開頭，後面八個數字。

（下一步）人數不能是空的，最少一位、最多八位。

（下一步）其他欄位也一樣，message 就是要給客人看的中文訊息，照規格書寫。日期和時間用 LocalDate 和 LocalTime，前端送來的 2026-11-20 和 15:30 會自動轉換。
-->

---

# 第二關：Service 檢查店家規則

```java {all|3-6|8-11|13}
public ReservationDto create(ReservationRequest req) {
    LocalDate today = LocalDate.now();
    if (req.reserveDate().isBefore(today)
            || req.reserveDate().isAfter(today.plusDays(30))) {
        throw new FieldException("reserveDate", "只能預約 30 天內的日期");
    }
    LocalTime t = req.reserveTime();
    boolean onSlot = t.getMinute() == 0 || t.getMinute() == 30;
    if (!onSlot || t.isBefore(LocalTime.of(10, 0)) || t.isAfter(LocalTime.of(19, 30))) {
        throw new FieldException("reserveTime", "請選擇營業時段");
    }
    // …下一頁：把 req 的欄位複製到 Reservation，save 之後轉成 ReservationDto 回傳
}
```

<!--
第二關在 Service。

（下一步）日期不能早於今天，也不能晚於三十天後。不符合就丟出例外。FieldException 是我們自己寫的例外，多帶了一個欄位名稱，等一下會把它變成 400。

（下一步）時段要是整點或半點，而且在十點到七點半之間。

（下一步）都通過了，才建立 Reservation 物件、存進資料庫，再轉成 DTO 回傳。下一頁就是這一段。
-->

---

# 存進資料庫，再轉成 DTO

```java {all|1-3|6-13|14-16}
public record ReservationDto(Integer id, String name, String phone, String email,
        LocalDate reserveDate, @JsonFormat(pattern = "HH:mm") LocalTime reserveTime,
        Integer people, String note) {}

// create() 的後半段：
Reservation r = new Reservation();
r.setName(req.name());
r.setPhone(req.phone());
r.setEmail(req.email() == null || req.email().isBlank() ? null : req.email());
r.setReserveDate(req.reserveDate());
r.setReserveTime(req.reserveTime());
r.setPeople(req.people());
r.setNote(req.note());
Reservation saved = reservationRepository.save(r);
return new ReservationDto(saved.getId(), saved.getName(), saved.getPhone(), saved.getEmail(),
        saved.getReserveDate(), saved.getReserveTime(), saved.getPeople(), saved.getNote());
```

<!--
這一頁把 create 寫完。

（下一步）先看回傳的 ReservationDto，放在 dto 資料夾。比 Request 多了一個 id，前端才知道這筆訂位的編號。時間加上 @JsonFormat，回傳的格式是規格書的 18:30；沒加的話，會變成 18:30:00，多了秒數。

（下一步）兩關都過了，建立一個 Reservation，把客人填的欄位一個一個抄過去。Email 是選填，客人沒填的時候前端會送空字串，我們存成 null，資料庫比較乾淨。

（下一步）save 存進資料庫，回傳的物件已經有資料庫產生的 id。最後轉成 DTO 回給 Controller。
-->

---

# 兩個自己寫的例外

放在 `exception` 資料夾：

```java {all|1-11|13-17}
// 欄位格式對，但是不符合店家規則（日期、時段）→ 400
public class FieldException extends RuntimeException {
    private final String field;          // 哪個欄位出錯
    public FieldException(String field, String message) {
        super(message);
        this.field = field;
    }
    public String getField() {
        return field;
    }
}

// 找不到資料（例如分類不存在）→ 404
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
```

<!--
剛才 Service 丟出了兩種例外，都是我們自己寫的，放在 exception 資料夾。

（下一步）FieldException 用在第二關：格式都對，但是不符合店家的規則。它比一般的例外多記了一個欄位名稱，這樣才知道錯誤訊息要顯示在哪個欄位下面。super(message) 是把訊息交給父類別保管，之後用 getMessage 拿得到。

（下一步）NotFoundException 用在找不到資料的時候，例如分類編號不存在。它只需要一句訊息。

兩個都繼承 RuntimeException，所以丟出來的時候，方法上不用寫 throws。
-->

---

# 統一的錯誤格式

規格書規定：所有錯誤都回同一個格式，前端才好處理。

```java {all|1|5-11|12-16|17-21}
public record ApiError(String message, Map<String, String> fields) {}

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleInvalid(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(e -> fields.putIfAbsent(e.getField(), e.getDefaultMessage()));
        return new ApiError("資料格式不正確", fields);
    }
    @ExceptionHandler(FieldException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleField(FieldException ex) {
        return new ApiError("資料格式不正確", Map.of(ex.getField(), ex.getMessage()));
    }
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(NotFoundException ex) {
        return new ApiError(ex.getMessage(), Map.of());
    }
}
```

<!--
兩道關卡丟出來的錯誤不一樣，但規格書規定，所有的 400 都要回同一個格式。

（下一步）ApiError 有兩個欄位：message 是一句總結，fields 是每個欄位的錯誤訊息。

（下一步）第一個方法處理第一關。@Valid 沒過，Spring 會丟出 MethodArgumentNotValidException，我們把每個欄位的訊息整理進 fields。putIfAbsent 讓同一個欄位只留第一個訊息。

（下一步）第二個方法處理第二關的 FieldException，欄位名稱和訊息直接放進 fields。

（下一步）第三個方法處理 NotFoundException，回 404。fields 是空的，因為不是哪個欄位填錯。

ApiError 和 GlobalExceptionHandler 都放在 exception 資料夾。

這兩個方法都在第四十一章學過的 @RestControllerAdvice 裡，所有 Controller 共用。
-->

---

# Controller：成功回 201

```java {all|5-6|7|11-14}
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired private ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDto create(@Valid @RequestBody ReservationRequest req) {
        return reservationService.create(req);
    }

    @GetMapping   // 加分題：GET /api/reservations?date=2026-11-20
    public List<ReservationDto> findByDate(@RequestParam(name = "date") LocalDate date) {
        return reservationService.findByDate(date);
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 最後別忘了上一章的 <code>CorsConfig</code>，允許 <code>http://localhost:4200</code>，否則前端接不起來。
</div>

</v-click>

<!--
Controller 很短。

（下一步）@PostMapping 接收新增訂位，@ResponseStatus 讓成功的時候回 201，而不是預設的 200。

（下一步）參數前面的 @Valid 千萬別忘了，沒有它，第一關的規則全部不會檢查。

（下一步）下面是加分題，店家用日期查訂位。同一個路徑，GET 就是查詢。網址上的日期 2026-11-20 會自動轉成 LocalDate。ReservationService 裡的 findByDate，就是呼叫剛才 Repository 的 findByReserveDateOrderByReserveTime，再用 Stream 轉成 DTO，跟 getCategories 的寫法一樣，請大家自己完成。前端的加分題會用到這支 API。

（下一步）最後，把上一章的 CorsConfig 也放進 config 資料夾，允許 localhost 4200，前端才接得起來。
-->

---

# 想一想

<Poll question="用 Postman 送出 people: 9、reserveDate 是 60 天後，後端會回什麼？" options="201，兩個都存進去|400，fields 只有 people（第一關就退件，Service 沒有執行）|400，fields 有 people 和 reserveDate|500" answer="2" />

<!--
想一想。人數九位、日期是六十天後，後端會回什麼？

答案是 400，而且 fields 只有 people。第一關 @Valid 就退件了，Controller 的方法根本沒有執行，Service 的日期檢查也就不會跑到。等客人把人數改好再送，才會看到日期的錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 驗收

<!--
最後是驗收。
-->

---

# 用 Postman 逐項驗收

<v-clicks>

- `GET /api/products`：11 個品項，**沒有**季節水果塔
- `GET /api/products?categoryId=999`：**404**
- `POST /api/reservations`，資料正確：**201**，資料庫多一筆
- 手機 `0912`、人數 `9`、日期 60 天後、時段 `10:15`：**400**，`fields` 說明原因
- （加分）`GET /api/reservations?date=今天`：當天的訂位，依時段排序
- 從 Angular 網頁呼叫：Console **沒有** CORS 錯誤

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 每完成一支 API，就用 GitHub Desktop commit 一次。專題至少要有 5 個有意義的 commit。
</div>

</v-click>

<!--
最後用 Postman 逐項驗收，這些都寫在規格書的驗收清單裡。

（下一步）查全部品項，應該是十一個，暫停供應的季節水果塔不在裡面。

（下一步）帶一個不存在的分類，回 404。

（下一步）送出正確的訂位，回 201，去資料庫看，多了一筆。

（下一步）故意送錯的資料：手機只有四碼、人數九位、日期六十天後、時段十點十五分，每一個都要回 400，而且 fields 說明原因。注意前兩個和後兩個要分開送，原因剛才的想一想說過了。

（下一步）加分題：用今天的日期查訂位，範例資料裡今天就有訂位，應該依時段排好。

（下一步）最後從 Angular 網頁呼叫，Console 沒有 CORS 錯誤。

（下一步）提醒大家，每完成一支 API，就用 GitHub Desktop commit 一次，訊息寫清楚做了什麼。
-->

---

# 重點回顧

<Pairs left="開店" right="後端專案" rows="doc,企劃書=doc,CAFE-SPEC.md：路徑、欄位、錯誤格式照寫|staff,倉管=code,Entity + Repository（方法名稱查詢）|teacher,店長=code,Service：30 天內、營業時段|clerk,櫃台=code,Controller + DTO + @Valid|no,統一的退件單=code,ApiError + @RestControllerAdvice|guard,門口的公告=code,CorsConfig" />

<!--
回顧一下。

（下一步）企劃書是規格書，路徑、欄位、錯誤格式都照寫。

（下一步）倉管是 Entity 和 Repository。

（下一步）店長是 Service，負責店家的規則。

（下一步）櫃台是 Controller、DTO 和 @Valid。

（下一步）統一格式的退件單，是 ApiError 加上 @RestControllerAdvice。

（下一步）門口的公告，是 CorsConfig。

後端完成了。前端的部分在 Angular 課的專題章，把菜單和訂位表單接上這幾支 API，轉角咖啡就可以開張了。
-->

---
layout: end
---

# 後端完成！

下一步：Angular 專題章，把前端接上來

<Link to="angular/ch58">→ 專題：轉角咖啡前端</Link>

<!--
後端完成了，恭喜大家。下一步到 Angular 課的專題章，把前端接上來。
-->
