---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（三）：商品與後台商品管理
routeAlias: ch53
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
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題（三）<br>商品與後台商品管理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「貨架上找得到、倉庫裡管得好」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十三章。這一章做商品：前台讓客人搜尋、排序、分頁瀏覽；後台讓店家新增、修改商品和規格、上下架、上傳圖片。
-->

---

# 今天要完成的事

<v-clicks>

- **前台**：`GET /api/products`：分類、關鍵字、排序、分頁
- **前台**：`GET /api/products/{id}`：商品含規格
- **後台**：新增、修改商品（連同規格一起）、上下架
- **後台**：上傳圖片；分類放進快取

</v-clicks>

<!--
今天要完成四件事。

（下一步）前台的商品列表，可以依分類、關鍵字篩選，依價格或上架時間排序，還要分頁。

（下一步）前台的商品頁，包含所有規格。

（下一步）後台新增和修改商品，規格跟著商品一起送。還有上下架。

（下一步）後台上傳商品圖片，另外把分類放進快取。
-->

---

# 故事：貨架與倉庫

<v-clicks>

- 店裡的**貨架**一次只擺 12 樣，客人可以說「我要看咖啡豆」「便宜的排前面」「下一排」
- 每樣商品有一張**價目卡**，寫著各種包裝的價錢和剩幾包
- 店長整理商品時，**價目卡整張重寫**：舊的包裝劃掉、新的包裝加上
- 不賣的商品**收回倉庫**，不丟掉：以前的收據還查得到它

</v-clicks>

<!--
用貨架和倉庫來想。

（下一步）店裡的貨架一次只擺十二樣。客人可以說：我只看咖啡豆、便宜的排前面、我要看下一排。

（下一步）每樣商品有一張價目卡，寫著半磅、一磅各多少錢，還剩幾包。

（下一步）店長整理商品的時候，把價目卡整張重寫：不賣的包裝劃掉、新的包裝加上去。

（下一步）不賣的商品收回倉庫，不丟掉，因為以前的收據還要查得到它。
-->

---

# 對應到程式

<Pairs left="貨架與倉庫" right="程式" rows="shop,一次擺 12 樣、下一排=code,Pageable：page、size；PageResponse|what,只看咖啡豆、便宜的排前面=code,@Query 的選填條件 + Sort|card,價目卡=code,ProductDetailVO + variants|doc,價目卡整張重寫=code,PUT 送整份規格清單，用 id 比對|cabinet,收回倉庫=code,status 改成 OFF_SHELF（下架，不刪除）" />

<!--
對應到程式。

（下一步）一次擺十二樣、看下一排，是 Spring Data 的 Pageable，用 page 和 size 決定第幾頁、一頁幾筆。

（下一步）只看咖啡豆、便宜的排前面，是 @Query 的選填條件，加上排序 Sort。

（下一步）價目卡，是商品明細的 VO，裡面有規格清單。

（下一步）價目卡整張重寫，是修改商品時，前端送出整份規格清單，後端用 id 比對誰要改、誰要新增、誰要刪除。

（下一步）收回倉庫，是把狀態改成下架，不真的刪除。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 前台：搜尋、排序、分頁

<!--
先做前台的商品列表。
-->

---

# 一個查詢，條件都是選填

```java {all|3|4|5|7}
@Query("""
        SELECT p FROM Product p
        WHERE (:status IS NULL OR p.status = :status)
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:keyword IS NULL OR p.name LIKE CONCAT('%', :keyword, '%'))
        """)
Page<Product> search(@Param("status") ProductStatus status, @Param("categoryId") Integer categoryId,
                     @Param("keyword") String keyword, Pageable pageable);
```

<!--
前台和後台的商品列表，共用一個查詢。

（下一步）技巧是「參數是 null 就不篩選」：status 是 null，OR 前面就成立，這個條件等於沒寫。前台固定傳 ON_SALE，後台可以傳 null 看全部。

（下一步）分類也一樣，沒選分類就不篩選。

（下一步）關鍵字用 LIKE，前後加百分比。參數一律用冒號綁定，不要自己拼字串，第三十五章的 SQL Injection 就不會發生。

（下一步）最後一個參數是 Pageable，回傳 Page。分頁和排序不用寫在 SQL 裡，Spring Data 會自動加上 LIMIT 和 ORDER BY，還會多跑一次 COUNT 算總筆數。
-->

---

# 排序與分頁

```java {all|2-7|8}
private Pageable pageable(String sort, int page, int size) {
    Sort s = switch (sort == null ? "" : sort) {
        case "price,asc"      -> Sort.by("price").ascending();
        case "price,desc"     -> Sort.by("price").descending();
        case "createdAt,desc" -> Sort.by("createdAt").descending();
        default               -> Sort.by("sortOrder").ascending();
    };
    return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), s.and(Sort.by("id")));
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 排序欄位<b>只接受白名單</b>；一頁最多 50 筆，免得有人一次要一百萬筆把伺服器拖垮。
</div>

</v-click>

<!--
排序和分頁。

（下一步）前端送來的 sort 只接受規格書列的三種，其他值一律用預設的排序欄位。

（下一步）PageRequest.of 建立分頁：頁碼不能小於 0，一頁最少 1 筆、最多 50 筆。最後多加一個依 id 排序，價格一樣的商品，每次的順序才會固定，換頁時不會重複或漏掉。

（下一步）排序欄位只接受白名單，不要直接把前端給的字串丟進去；一頁的筆數也要設上限。
-->

---

# 分頁的回應格式

```java
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
    public static <E, T> PageResponse<T> of(Page<E> page, Function<E, T> mapper) {
        return new PageResponse<>(page.getContent().stream().map(mapper).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }
}
```

```json
{ "code": 200, "data": {
    "content": [ { "id": 7, "name": "磨豆機", "price": 1890, "soldOut": false } ],
    "page": 0, "size": 12, "totalElements": 7, "totalPages": 1 } }
```

<!--
Page 物件裡東西很多，我們只挑前端需要的，包成 PageResponse：這一頁的資料、第幾頁、一頁幾筆、總筆數、總頁數。

of 方法用到兩個型別參數：E 是 Entity，T 是 VO，再傳一個轉換的函式。這樣不管商品、訂單、會員，都能用同一個方法轉。

下面是實際的回應。soldOut 是所有規格都沒庫存的時候為 true，前端可以顯示「售完」。
-->

---

# 商品頁：只看得到上架的

```java {all|1|4-6}
@Transactional(readOnly = true)
public ProductDetailVO detail(Integer id) {
    Product p = find(id);
    if (p.getStatus() != ProductStatus.ON_SALE) {
        throw new BizException(RspCode.NOT_FOUND, "找不到這個商品");
    }
    return ProductDetailVO.of(p);   // 讀 p.getCategory()、p.getVariants()
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>open-in-view=false</code>：LAZY 的關聯一定要在 <code>@Transactional</code> 的方法裡讀完，轉成 VO 再交給 Controller。
</div>

</v-click>

<!--
商品頁。

（下一步）方法加上 @Transactional，readOnly 表示只讀不寫。為什麼要加？因為等一下要讀分類和規格，它們是 LAZY 的。

（下一步）下架的商品，前台當作不存在，回 404。

（下一步）我們把 open-in-view 關掉了，所以 LAZY 的關聯一定要在交易裡讀完。做法是在 Service 裡就轉成 VO，Controller 拿到的是普通的資料，不會再去碰資料庫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 後台：商品與規格

<!--
接下來做後台的商品管理。
-->

---

# 新增、修改：規格跟著商品一起送

```json
PUT /api/admin/products/9
{ "categoryId": 4, "name": "咖啡禮盒", "description": "兩包豆子＋濾掛",
  "variants": [
    { "id": 15, "name": "標準", "sku": "GIFT-STD",  "price": 890, "stock": 5 },
    {           "name": "迷你", "sku": "GIFT-MINI", "price": 590, "stock": 9 } ] }
```

<v-clicks>

- 有 `id`：修改這個規格
- 沒有 `id`：新增的規格
- 原本有、清單裡沒有的（例如「豪華」）：**刪除**

</v-clicks>

<!--
後台修改商品的時候，規格清單整份一起送。對應 Angular 課的 FormArray，畫面上可以動態新增、刪除規格。

（下一步）有 id 的，是修改既有的規格。

（下一步）沒有 id 的，是新增的規格。

（下一步）原本有、但清單裡沒有的，例如原本的豪華版，就刪除。價目卡整張重寫。
-->

---

# 用 id 比對規格

```java {all|1-2|5-12|14-15|17}
Map<Integer, ProductVariant> existing = p.getVariants().stream()
        .collect(Collectors.toMap(ProductVariant::getId, Function.identity()));
List<ProductVariant> result = new ArrayList<>();
for (VariantRequest vr : req.variants()) {
    ProductVariant v;
    if (vr.id() == null) {
        v = new ProductVariant();
        v.setProduct(p);
    } else {
        v = existing.get(vr.id());
        if (v == null) throw new BizException(RspCode.PARAM_ERROR, "規格不屬於這個商品");
    }
    v.setName(vr.name()); v.setSku(vr.sku()); v.setPrice(vr.price()); v.setStock(vr.stock());
    result.add(v);
}
p.getVariants().clear();       // orphanRemoval：不在清單裡的會被刪除
p.getVariants().addAll(result);
p.setPrice(result.stream().mapToInt(ProductVariant::getPrice).min().orElse(0));  // 起始價
```

<!--
比對的程式。

（下一步）先把原本的規格做成一個 Map，key 是 id，方便查。

（下一步）逐一處理送來的規格：沒有 id 就 new 一個；有 id 就從 Map 拿。拿不到，代表有人送了別的商品的規格 id，要擋下來。

（下一步）把清單清空再放回處理好的規格。因為 Entity 設了 orphanRemoval，被拿掉的規格存檔時會自動刪除。

（下一步）商品列表顯示的價格，是最便宜的規格，由後端算，不讓前端填。
-->

---

# 下架與上傳圖片

```java
@PatchMapping("/products/{id}/status")       // { "status": "OFF_SHELF" }
public AppResponse<ProductDetailVO> status(@PathVariable("id") Integer id,
                                           @Valid @RequestBody StatusRequest req) { … }

@PostMapping("/uploads")                     // multipart/form-data，欄位名稱 file
public AppResponse<UploadVO> upload(@RequestPart("file") MultipartFile file) { … }
```

<v-clicks>

- 上傳只收 **jpg、png、webp**，**2 MB** 以內（`spring.servlet.multipart.max-file-size=2MB`）
- 檔名改成 **UUID**，不用客人給的檔名：不會重複，也擋掉 `../../` 這種路徑攻擊
- 存在 `uploads/`，用 `/uploads/檔名` 提供（`WebConfig` 的 `addResourceHandlers`）

</v-clicks>

<!--
下架用 PATCH，只改一個欄位。PATCH 的意思就是「修改一部分」。

上傳圖片用 multipart form data，參數用 @RequestPart 接收，型別是 MultipartFile。

（下一步）只收三種圖片格式，最大 2 MB。設定檔裡的上限擋住太大的檔案，Service 再檢查一次格式。

（下一步）存檔的時候檔名改成 UUID。不要用使用者給的檔名，同名會互相覆蓋，而且有人會把檔名取成點點斜線，想把檔案寫到別的資料夾。

（下一步）檔案存在 uploads 資料夾，用 WebConfig 把 /uploads 的網址對應到這個資料夾。上傳完回傳網址，前端放進商品的 imageUrl 一起存。
-->

---

# 分類：放進快取（第 45 章）

```java {all|1-4|6-7}
@Cacheable("categories")
public List<CategoryVO> list() {
    return categoryRepository.findAllByOrderBySortOrder().stream().map(CategoryVO::of).toList();
}

@CacheEvict(value = "categories", allEntries = true)
public CategoryVO create(CategoryRequest req) { … }
```

<!--
分類每一頁都要用，又很少改，適合放進快取。

（下一步）@Cacheable：第一次查資料庫，結果存起來，之後直接拿。記得主程式要加 @EnableCaching。

（下一步）新增或修改分類的時候，用 @CacheEvict 把快取清掉，下一次再重新查。不清的話，後台改了名字，前台一直看到舊的。
-->

---

# 想一想

<Poll question="後台把「轉角特調」下架了。王小明上個月買過它，他打開「我的訂單」會看到什麼？" options="訂單裡的這一項消失了|顯示「轉角特調」和當時的價格|整張訂單打不開|顯示錯誤" answer="2" />

<!--
想一想。轉角特調下架了，王小明上個月的訂單會怎樣？

還是顯示轉角特調和當時的價格。第一，下架不是刪除，商品還在；第二，訂單明細存的是快照，就算商品改名、改價，訂單也不受影響。
-->

---

# 重點回顧

<Pairs left="貨架與倉庫" right="程式" rows="shop,一排 12 樣=code,Pageable + PageResponse|what,只看咖啡豆、便宜的排前面=code,選填條件的 @Query + 白名單排序|doc,價目卡整張重寫=code,用 id 比對 + orphanRemoval|cabinet,收回倉庫=code,下架 OFF_SHELF|card,常用又少改=code,@Cacheable / @CacheEvict" />

<!--
回顧。

（下一步）一排十二樣，是 Pageable 和 PageResponse。

（下一步）篩選和排序，是選填條件的 @Query，排序欄位只收白名單。

（下一步）價目卡整張重寫，是用 id 比對加上 orphanRemoval。

（下一步）收回倉庫，是下架。

（下一步）常用又少改的分類，放進快取。
-->

---

# 小結

<v-clicks>

- 前台：搜尋、排序、分頁；下架的商品看不到
- 後台：商品和規格一起存；SKU 重複回 409；下架不刪除
- 圖片：格式、大小檢查；檔名用 UUID
- **練習**：後台商品列表加上「只看售完的商品」篩選

</v-clicks>

<!--
小結。

（下一步）前台可以搜尋、排序、分頁，下架的商品看不到。

（下一步）後台商品和規格一起存，SKU 重複會因為唯一約束回 409，下架不刪除。

（下一步）上傳圖片檢查格式和大小，檔名用 UUID。

（下一步）練習：在後台商品列表加一個篩選，只看所有規格都賣完的商品，方便店家補貨。下一章做購物車。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
