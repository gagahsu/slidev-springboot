---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "實戰專題（三）：後台問卷管理"
routeAlias: ch51
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

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Project Practice
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    實戰專題（三）<br>後台問卷管理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「出題、修改、預覽、統計」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第五十一章，實戰專題的第三章。

前兩章把資料表、回覆單和登入都準備好了。今天做管理員的後台：新增、修改、刪除問卷，編輯時先暫存再確認，最後是填寫名單和統計。

今天的程式是整個專題最多的一章。我們分成五個部分，一個一個來。
-->

---

# 今天要完成的三件事

<v-clicks>

- **問卷的 DTO**：一份問卷裡有題目，題目裡有選項，一層包一層
- **新增、修改、刪除、查詢**：Entity 和 DTO 之間怎麼轉換
- **暫存、名單、統計**：先放置物櫃再確認；誰填了什麼；每個選項幾個人選

</v-clicks>

<!--
今天要完成三件事。

（下一步）第一，問卷的 DTO。一份問卷裡有題目，題目裡有選項，一層包一層。

（下一步）第二，新增、修改、刪除、查詢。重點是 Entity 和 DTO 之間怎麼轉換。

（下一步）第三，暫存、名單和統計。編輯的時候先放置物櫃再確認；看誰填了什麼；算出每個選項有幾個人選。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 一層包一層的 DTO

<!--
先看前端送來的問卷長什麼樣子。
-->

---

# 前端送來的一份問卷

```json
{
  "title": "2026 程式語言喜好大調查",
  "startDate": "2026-07-01", "endDate": "2026-08-31", "status": "PUBLISHED",
  "questions": [
    { "title": "您最常使用的程式語言是？", "type": "SINGLE", "required": true, "orderIndex": 0,
      "options": [ { "optionText": "Java", "orderIndex": 0 }, { "optionText": "Python", "orderIndex": 1 } ] },
    { "title": "對本課程有什麼建議嗎？", "type": "TEXT", "required": false, "orderIndex": 1,
      "options": [] }
  ]
}
```

<v-clicks>

- 外層是問卷；`questions` 是一份清單，每一題又有自己的 `options` 清單
- 簡答題沒有選項，送空的清單 `[]`
- 所以 DTO 也要做三層：`SurveyDTO` → `QuestionDTO` → `OptionDTO`

</v-clicks>

<!--
前端送來的一份問卷，是一個 JSON。

（下一步）外層是問卷：標題、開放日期、狀態。questions 是一份清單，每一題又有自己的 options 清單。一層包一層。

（下一步）簡答題沒有選項，送一個空的清單，中括號裡什麼都沒有。

（下一步）JSON 有三層，DTO 也要做三層：SurveyDTO 裡有很多 QuestionDTO，QuestionDTO 裡有很多 OptionDTO。
-->

---

# OptionDTO 和 QuestionDTO

```java
@Data
public class OptionDTO {
    private Long id;
    @NotBlank(message = "選項內容不可為空")
    private String optionText;
    private int orderIndex;
}
```

```java {10-11}
@Data
public class QuestionDTO {
    private Long id;
    @NotBlank(message = "題目名稱不可為空")
    @Size(max = 75, message = "題目不可超過 75 字")
    private String title;
    @NotBlank(message = "題目類型不可為空")
    private String type;
    private boolean required;
    private int orderIndex;
    @Valid
    private List<OptionDTO> options;
}
```

<!--
在 dto 資料夾新增兩個類別。這三個 DTO 都用 @Data 的類別，不用 record，因為等一下 Service 要用 setter 一格一格填。

OptionDTO：選項的編號、文字、順序。文字不能空白。

QuestionDTO：題目的編號、文字、題型、是不是必答、順序。

（下一步）最後是選項的清單。上面多了一個 @Valid。它的作用下一頁說明。
-->

---

# SurveyDTO

```java {11|16-19}
@Data
public class SurveyDTO {
    private Long id;
    @NotBlank(message = "問卷標題不可為空")
    @Size(max = 50, message = "標題長度不可超過 50 字")
    private String title;
    @Size(max = 300, message = "說明長度不可超過 300 字")
    private String description;
    @NotNull(message = "開始日期不可為空") private LocalDate startDate;
    @NotNull(message = "結束日期不可為空") private LocalDate endDate;
    @NotBlank(message = "狀態不可為空") private String status;
    private boolean hasResponses;

    @Valid
    @NotNull(message = "題目列表不可為空")
    @Size(min = 1, message = "至少需包含一個題目")
    private List<QuestionDTO> questions;
}
```

<v-clicks>

- `hasResponses`：已經有人填過了嗎？前端用它決定「刪除」按鈕能不能按
- `@Size(min = 1)` 用在清單上：至少要有一題

</v-clicks>

<!--
最外層的 SurveyDTO。欄位和 Survey 這個 Entity 很像，加上檢查規則。

（下一步）多了一個 hasResponses：已經有人填過了嗎？Entity 裡沒有這一格，它是查出來再填進去的。前端用它決定刪除按鈕能不能按。

（下一步）題目的清單。@Size 用在清單上，意思是清單的長度，min 等於 1 就是至少要有一題。上面一樣有 @Valid。
-->

---

# @Valid：翻開附件一頁一頁檢查

<v-clicks>

- 櫃台收到一份申請，只看封面，附件夾著就算數 → **沒有 `@Valid`**：只檢查清單本身（有沒有、長度），不看清單裡的每一題
- 櫃台把附件一頁一頁翻開檢查 → **有 `@Valid`**：清單裡的每一個物件，也照它自己的規則檢查
- 檢查的起點，是 Controller 的 `@Valid @RequestBody SurveyDTO dto`，然後一層一層往下

</v-clicks>

<v-click>

```text
@Valid @RequestBody SurveyDTO  →  @Valid questions（每一題）  →  @Valid options（每一個選項）
```

</v-click>

<!--
@Valid 加在清單上是什麼意思？想像櫃台收到一份申請，後面夾著很多頁附件。

（下一步）如果櫃台只看封面，附件夾著就算數。這就是沒有 @Valid：只檢查清單本身，有沒有、長度夠不夠，不看清單裡的每一題。題目名稱空白也不會被發現。

（下一步）如果櫃台把附件一頁一頁翻開檢查，這就是有 @Valid：清單裡的每一個物件，也照它自己類別上的規則檢查。

（下一步）檢查的起點，是 Controller 參數上的 @Valid。第四十一章學過。然後一層一層往下。

（下一步）從問卷，到每一題，到每一個選項。少了中間任何一個 @Valid，那一層以下就不會檢查了。
-->

---

# 想一想

<Poll question="如果拿掉 QuestionDTO 裡 options 上面的 @Valid，送一個 optionText 是空白的選項，會怎麼樣？" options="回 400「選項內容不可為空」|檢查不到，空白的選項會被存進資料庫|回 500|整份問卷都不會被檢查" answer="2" />

<!--
來想一題。

如果拿掉 QuestionDTO 裡 options 上面的 @Valid，送一個選項文字是空白的選項，會怎麼樣？

（等大家作答）

（下一步）答案是：檢查不到，空白的選項會被存進資料庫。

問卷和題目還是會檢查，因為它們的 @Valid 還在。只有選項這一層，櫃台不會翻開來看。等到存進資料庫，Option 的 optionText 是 nullable 等於 false，空字串還是可以存進去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# Entity 和 DTO 互相轉換

<!--
接下來是 SurveyService 的核心：Entity 和 DTO 怎麼互相轉換。
-->

---

# SurveyService 的開頭

在 `service` 資料夾新增 `SurveyService`，它同時負責後台和前台：

```java
@Service
public class SurveyService {
    @Autowired
    private SurveyRepository surveyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SurveyResponseRepository responseRepository;

    private static final String SURVEY_SESSION_KEY = "TEMP_SURVEY_RESPONSE";
    private static final String ADMIN_EDIT_SESSION_KEY = "TEMP_ADMIN_SURVEY";
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>static final</code>：一個固定不變的名字，整個類別共用。置物櫃裡的東西要取名字（第四十二章的 <code>setAttribute("名字", 值)</code>），先把名字定好，就不會兩個地方打得不一樣。
</div>

</v-click>

<!--
在 service 資料夾新增 SurveyService。它同時負責後台和前台，今天寫後台的部分，下一章寫前台。

上面是三個助理。

下面兩行是置物櫃裡東西的名字。一個是前台作答的暫存，一個是後台編輯的暫存。

（下一步）static final 的意思是：一個固定不變的值，整個類別共用。第四十二章學過，放東西進置物櫃要取名字。先把名字定好放在這裡，存和取的時候都用它，就不會兩個地方打得不一樣。習慣用全大寫加底線命名。
-->

---

# Entity → DTO：convertToDTO

<CodeSteps>

```java {2-5|6-10|11-15|16-18}
private SurveyDTO convertToDTO(Survey s) {
    SurveyDTO dto = new SurveyDTO();
    dto.setId(s.getId()); dto.setTitle(s.getTitle()); dto.setDescription(s.getDescription());
    dto.setStartDate(s.getStartDate()); dto.setEndDate(s.getEndDate()); dto.setStatus(s.getStatus());
    dto.setQuestions(s.getQuestions().stream().map(q -> {
        QuestionDTO qDto = new QuestionDTO();
        qDto.setId(q.getId()); qDto.setTitle(q.getTitle()); qDto.setType(q.getType());
        qDto.setRequired(q.isRequired()); qDto.setOrderIndex(q.getOrderIndex());
        qDto.setOptions(q.getOptions().stream().map(o -> {
            OptionDTO oDto = new OptionDTO();
            oDto.setId(o.getId()); oDto.setOptionText(o.getOptionText());
            oDto.setOrderIndex(o.getOrderIndex());
            return oDto;
        }).collect(Collectors.toList()));
        return qDto;
    }).collect(Collectors.toList()));
    return dto;
}
```

- 外層：問卷的欄位一格一格抄過去
- 輸送帶（第三十八章）：每一題 `q`，`map` 成一個 `QuestionDTO`
- 輸送帶裡面還有輸送帶：每一題的每一個選項 `o`，`map` 成 `OptionDTO`
- 箭頭右邊寫了好幾行時，要用大括號包起來，最後 `return`

</CodeSteps>

<!--
第一個方法，convertToDTO，把一份問卷 Entity 轉成 DTO。private 是因為只有這個類別自己用。

（下一步）外層很單純，問卷的欄位一格一格抄過去。為了放得下，一行寫了好幾句，每一句用分號結束就可以。

（下一步）題目的清單用第三十八章的輸送帶。把每一題放上輸送帶，map 換成一個 QuestionDTO。q 是輸送帶上的每一題。

（下一步）每一題裡面還有選項的清單，所以輸送帶裡面還有一條輸送帶。每一個選項 o，map 換成 OptionDTO。

（下一步）注意這裡的箭頭寫法。第三十八章的箭頭右邊只有一行。這裡要做好幾件事，所以箭頭右邊用大括號包起來，最後用 return 交出換好的東西。collect 是第三十八章說的舊收法，和 toList 一樣。
-->

---

# DTO → Entity：saveSurvey（上）

```java {3-5|6-8|9-14}
@Transactional
public AppResponse<SurveyDTO> saveSurvey(SurveyDTO dto) {
    if (dto.getId() != null && responseRepository.existsBySurveyId(dto.getId())) {
        throw new BizException(RspCode.PARAM_ERROR, "已有作答紀錄，不能修改");
    }
    Survey survey = (dto.getId() != null)
            ? surveyRepository.findById(dto.getId()).orElse(new Survey())
            : new Survey();
    survey.setTitle(dto.getTitle());
    survey.setDescription(dto.getDescription());
    survey.setStartDate(dto.getStartDate());
    survey.setEndDate(dto.getEndDate());
    survey.setStatus(dto.getStatus());
    survey.getQuestions().clear();
    // 下一頁：重新建立題目和選項
```

<v-clicks>

- 要修改的問卷，如果已經有人填過，就不准改（為什麼？等一下說明）
- 新增和修改用同一個方法：有 `id` 就先找出舊的，沒有就 `new` 一份新的
- 抄好問卷的欄位，然後把舊的題目**全部清掉**

</v-clicks>

<!--
反過來，把 DTO 存成 Entity。新增和修改用同一個方法 saveSurvey，加上第三十三章的 @Transactional，要嘛全部成功、要嘛全部不算。

（下一步）先檢查：如果是修改，而且這份問卷已經有人填過，就丟出例外，不准改。為什麼？等一下說明。

（下一步）新增和修改怎麼分？用第三十八章的三元運算子。DTO 有 id，代表是修改，先用 findById 找出舊的問卷。沒有 id，代表是新增，new 一份新的。

（下一步）把問卷的欄位抄過去。然後最後一行，把舊的題目全部清掉。題目和選項等一下會照 DTO 重新建立。
-->

---

# DTO → Entity：saveSurvey（下）

<CodeSteps>

```java {1-6|7-15|16|18}
    for (QuestionDTO qDto : dto.getQuestions()) {
        Question q = new Question();
        q.setSurvey(survey);
        q.setTitle(qDto.getTitle());
        q.setType(qDto.getType());
        q.setRequired(qDto.isRequired());
        q.setOrderIndex(qDto.getOrderIndex());
        if (qDto.getOptions() != null) {
            for (OptionDTO oDto : qDto.getOptions()) {
                Option o = new Option();
                o.setQuestion(q);
                o.setOptionText(oDto.getOptionText());
                o.setOrderIndex(oDto.getOrderIndex());
                q.getOptions().add(o);
            }
        }
        survey.getQuestions().add(q);
    }
    return AppResponse.success(convertToDTO(surveyRepository.save(survey)));
}
```

- 每一題建立一個 `Question`，**告訴它屬於哪一份問卷**
- 每個選項建立一個 `Option`，告訴它屬於哪一題，再放進題目的清單
- 把題目放進問卷的清單
- 只存問卷：`cascade` 會把題目和選項一起存；`orphanRemoval` 會刪掉剛才清掉的舊題目

</CodeSteps>

<!--
接下來，照 DTO 重新建立題目和選項。這裡用一般的 for 迴圈。

（下一步）每一題建立一個新的 Question。第一件事：setSurvey，告訴它屬於哪一份問卷。這是第二十九章的陷阱一，兩邊都要設定。

（下一步）每一題的每一個選項，建立一個 Option，setQuestion 告訴它屬於哪一題，再放進題目的選項清單。外面先檢查 options 不是 null，避免簡答題沒有送清單的時候出錯。

（下一步）把題目放進問卷的清單。

（下一步）最後只存問卷。cascade 會把題目和選項一起存。orphanRemoval 會把剛才清掉的舊題目，連同它們的選項，從資料庫刪掉。存好之後轉成 DTO，包進回覆單。
-->

---

# 為什麼要「清掉重建」？為什麼填過就不能改？

<v-clicks>

- **清掉重建**：前端送來的是「整份新的問卷」，可能刪了一題、加了一題、改了順序。一題一題比對太麻煩，全部清掉再照新的建立最簡單
- **代價**：題目和選項的編號都會換新
- **填過就不能改**：作答紀錄記著「回答了**第幾號**題目、勾了**第幾號**選項」。舊的題目一刪，這些紀錄就對不上了，資料庫也會拒絕刪除
- 所以已經有人填的問卷，只能看結果，不能再改

</v-clicks>

<!--
這裡說明兩個設計。

（下一步）為什麼要清掉重建？前端送來的是一整份新的問卷。管理員可能刪了一題、加了一題、改了順序。一題一題比對哪裡變了，很麻煩。全部清掉，再照新的建立，最簡單。

（下一步）代價是：題目和選項的編號都會換新。

（下一步）這就是填過就不能改的原因。作答紀錄記著：回答了第幾號題目、勾了第幾號選項。舊的題目一刪，這些紀錄就對不上了。實際上資料庫也會拒絕刪除，因為還有外鍵指著它們，結果是一個 500 的錯誤。原本的教材沒有處理這個情況，這裡加上了檢查。

（下一步）所以已經有人填的問卷，只能看結果，不能再改，連發佈、下架都不行。這也是一般問卷系統的做法：問卷一旦開始收資料，內容就要固定。
-->

---

# 想一想

<Poll question="修改一份還沒有人填的問卷之後，它的題目編號會怎麼樣？" options="維持原本的編號|全部換成新的編號|只有新加的題目有新編號|題目會被刪光" answer="2" />

<!--
來想一題。

修改一份還沒有人填的問卷之後，它的題目編號會怎麼樣？

（等大家作答）

（下一步）答案是：全部換成新的編號。

因為 saveSurvey 會把舊的題目全部清掉，再重新建立。重新建立的題目，資料庫會給新的編號。所以前端每次修改完，都要用回傳的新資料，不能再用舊的編號。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 查詢、刪除，和後台的櫃台

<!--
接著是查詢和刪除，然後寫後台的櫃台。
-->

---

# 列表、單一份、刪除

```java {1-8|10-14|16-23}
public AppResponse<List<SurveyDTO>> getSurveysByAdmin(String title, LocalDate start, LocalDate end) {
    List<Survey> surveys = surveyRepository.findByFilters(title, start, end);
    return AppResponse.success(surveys.stream().map(s -> {
        SurveyDTO dto = convertToDTO(s);
        dto.setHasResponses(responseRepository.existsBySurveyId(s.getId()));
        return dto;
    }).collect(Collectors.toList()));
}

public AppResponse<SurveyDTO> getSurveyDetails(Long id) {
    Survey survey = surveyRepository.findById(id)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    return AppResponse.success(convertToDTO(survey));
}

@Transactional
public AppResponse<?> deleteSurvey(Long id) {
    if (responseRepository.existsBySurveyId(id)) {
        throw new BizException(RspCode.PARAM_ERROR, "已有作答紀錄，不能刪除");
    }
    surveyRepository.deleteById(id);
    return AppResponse.success(null);
}
```

<!--
三個方法。

（下一步）後台列表。用第四十九章的 findByFilters 搜尋，三個條件都可以是 null。每一份轉成 DTO 之後，再填上 hasResponses：問一下助理，這份問卷有沒有人填過。

（下一步）單一份問卷。用第三十八章的 orElseThrow：找不到就丟 404。找到就轉成 DTO 回傳。

（下一步）刪除。和修改一樣，有人填過就不准刪。沒有的話，deleteById。cascade 會把題目和選項一起刪掉。成功的回覆單沒有附件，放 null。
-->

---

# AdminSurveyController（一）：列表

```java {4-12}
@RestController
@RequestMapping("/api/admin/surveys")
public class AdminSurveyController {
    @GetMapping
    public AppResponse<?> getSurveys(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return surveyService.getSurveysByAdmin(title, startDate, endDate);
    }
}
```

<!--
在 controller 資料夾新增 AdminSurveyController。網址開頭是 /api/admin/surveys，警衛的守則只讓管理員進來。@Autowired 的 SurveyService 這裡省略沒寫，請自己加上。

（下一步）第一支 API，列表。三個網址參數都是選填，required 等於 false。日期的參數上多了一個 @DateTimeFormat，等一下說明。
-->

---

# AdminSurveyController（二）：單一份、新增、修改、刪除

```java {1-4|6-15|17-20}
@GetMapping("/{id}")
public AppResponse<?> getSurveyById(@PathVariable("id") Long id) {
    return surveyService.getSurveyDetails(id);
}

@PostMapping
public AppResponse<?> createSurvey(@Valid @RequestBody SurveyDTO dto) {
    return surveyService.saveSurvey(dto);
}

@PutMapping("/{id}")
public AppResponse<?> updateSurvey(@PathVariable("id") Long id, @Valid @RequestBody SurveyDTO dto) {
    dto.setId(id);
    return surveyService.saveSurvey(dto);
}

@DeleteMapping("/{id}")
public AppResponse<?> deleteSurvey(@PathVariable("id") Long id) {
    return surveyService.deleteSurvey(id);
}
```

<!--
同一個類別裡，再加四支 API。

（下一步）單一份。

（下一步）新增和修改，都呼叫 saveSurvey。修改的時候，id 是從網址拿的，先放進 DTO，Service 就知道是修改。這是第二十章的 RESTful 風格：POST 新增、PUT 修改。

（下一步）刪除。
-->

---

# @DateTimeFormat：網址參數裡的日期

```text
GET /api/admin/surveys?title=2026&startDate=2026-07-01
```

<v-clicks>

- JSON 裡的日期，Spring 會自動轉成 `LocalDate`（第三十八章）
- **網址參數**裡的日期，Spring 不知道格式，要用 `@DateTimeFormat` 告訴它
- `iso = DateTimeFormat.ISO.DATE`：格式是「年-月-日」，例如 `2026-07-01`

</v-clicks>

<!--
網址參數裡也可以放日期，例如這一行：標題包含 2026，而且開始日期在 7 月 1 日之後。

（下一步）JSON 裡的日期，第三十八章說過，Spring 會自動轉成 LocalDate。

（下一步）但是網址參數裡的日期，Spring 不知道是什麼格式，要用 @DateTimeFormat 告訴它。沒有寫的話，會得到一個轉換失敗的錯誤。

（下一步）iso 等於 DateTimeFormat.ISO.DATE，意思是國際標準的日期格式，年減號月減號日。和 JSON 裡的格式一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 編輯時先暫存，再確認

<!--
後台還有一個流程：編輯問卷的時候，先暫存、預覽，再決定發佈或存成草稿。
-->

---

# 先放置物櫃，確認後再存

<Flow nodes="管理員:前端|AdminSurveyController|置物櫃:Session|資料庫" steps="1>2:POST /session-store（編輯好的問卷）|2>3:放進置物櫃|1>2:GET /session-get（預覽頁）|3>2:拿出來|2>1:顯示預覽|1>2:POST /confirm-commit?isPublish=true|3>4:saveSurvey()，清空置物櫃" />

<!--
編輯問卷的流程分三步。

（下一步）管理員在前端編輯好問卷，按下「預覽」。前端送出 POST /session-store。

（下一步）櫃台把這份問卷放進這位管理員的置物櫃。還沒有存進資料庫。

（下一步）前端換到預覽頁，送出 GET /session-get。

（下一步）櫃台從置物櫃把問卷拿出來。

（下一步）回給前端顯示。管理員確認內容沒問題。

（下一步）按下「發佈」或「存成草稿」，前端送出 POST /confirm-commit，網址參數 isPublish 說明要不要發佈。

（下一步）櫃台從置物櫃拿出問卷，設定好狀態，呼叫 saveSurvey 存進資料庫，再把置物櫃清空。

這就是第四十二章的置物櫃，用在「還沒確定的草稿」上。
-->

---

# 三個方法

```java {1-4|6-10|12-20}
public AppResponse<?> saveAdminSurveyToSession(SurveyDTO dto, HttpSession session) {
    session.setAttribute(ADMIN_EDIT_SESSION_KEY, dto);
    return AppResponse.success(null);
}

public AppResponse<SurveyDTO> getAdminSurveyFromSession(HttpSession session) {
    SurveyDTO dto = (SurveyDTO) session.getAttribute(ADMIN_EDIT_SESSION_KEY);
    if (dto == null) throw new BizException(RspCode.NOT_FOUND, "找不到編輯中的資料");
    return AppResponse.success(dto);
}

@Transactional
public AppResponse<SurveyDTO> commitAdminSurveyFromSession(boolean isPublish, HttpSession session) {
    SurveyDTO dto = (SurveyDTO) session.getAttribute(ADMIN_EDIT_SESSION_KEY);
    if (dto == null) throw new BizException(RspCode.NOT_FOUND, "找不到編輯中的資料");
    dto.setStatus(isPublish ? "PUBLISHED" : "DRAFT");
    AppResponse<SurveyDTO> response = saveSurvey(dto);
    session.removeAttribute(ADMIN_EDIT_SESSION_KEY);
    return response;
}
```

<!--
在 SurveyService 加三個方法。都是第四十二章的寫法，只是多了回覆單。

（下一步）放進置物櫃：setAttribute，名字用一開始定好的常數。

（下一步）拿出來：getAttribute，要轉型成 SurveyDTO。拿到 null 代表置物櫃裡沒有東西，丟 404。

（下一步）確認送出。一樣先拿出來。用三元運算子決定狀態：要發佈就是 PUBLISHED，不然是 DRAFT。呼叫 saveSurvey 存進資料庫。如果 saveSurvey 丟出例外，例如這份問卷已經有人填過，後面就不會執行，置物櫃裡的草稿還在。成功的話，removeAttribute 只拿走這一樣東西，清空草稿。
-->

---

# AdminSurveyController（中）

```java
@PostMapping("/session-store")
public AppResponse<?> storeSurveyInSession(@RequestBody SurveyDTO dto, HttpSession session) {
    return surveyService.saveAdminSurveyToSession(dto, session);
}

@GetMapping("/session-get")
public AppResponse<?> getSurveyFromSession(HttpSession session) {
    return surveyService.getAdminSurveyFromSession(session);
}

@PostMapping("/confirm-commit")
public AppResponse<?> confirmSurveyCommit(@RequestParam(name = "isPublish") boolean isPublish,
                                          HttpSession session) {
    return surveyService.commitAdminSurveyFromSession(isPublish, session);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 暫存的時候沒有加 <code>@Valid</code>：草稿可以還沒寫完。真正存進資料庫之前，管理員會在前端的表單上補齊。
</div>

</v-click>

<!--
在 AdminSurveyController 加三支 API。參數寫 HttpSession，Spring 就會把這個人的置物櫃交給我們，第四十二章學過。

（下一步）暫存的時候沒有加 @Valid。草稿可以還沒寫完。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 填寫名單和統計

<!--
最後是看結果：誰填了、填了什麼、統計出來是多少。
-->

---

# 填寫名單

```java
public AppResponse<?> getSurveyResponses(Long id) {
    List<SurveyResponse> responses = responseRepository.findBySurveyIdOrderByIdDesc(id);
    return AppResponse.success(responses.stream().map(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("responseId", r.getId());
        map.put("userName", r.getName());
        map.put("userEmail", r.getEmail());
        map.put("submittedAt", r.getSubmittedAt());
        return map;
    }).collect(Collectors.toList()));
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這裡用 <code>Map</code> 代替 DTO，前端照這些 key 的名字顯示，所以名字不能改。
</div>

</v-click>

<!--
填寫名單。找出這份問卷的所有作答，新的在前。每一份放上輸送帶，map 成一個 Map：編號、姓名、Email、送出時間。

（下一步）這裡用 Map 代替 DTO，是原本專題的寫法。前端照這些 key 的名字顯示，所以名字不能改。
-->

---

# 單一份的答案

```java {2-3|4-8|9-15}
public AppResponse<?> getResponseDetail(Long responseId) {
    SurveyResponse response = responseRepository.findById(responseId)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    Map<String, Object> result = new HashMap<>();
    result.put("responseId", response.getId());
    result.put("userName", response.getName());
    result.put("submittedAt", response.getSubmittedAt());
    result.put("surveyTitle", response.getSurvey().getTitle());
    result.put("details", response.getAnswers().stream().map(a -> {
        Map<String, Object> m = new HashMap<>();
        m.put("questionTitle", a.getQuestion().getTitle());
        m.put("type", a.getQuestion().getType());
        m.put("answer", a.getAnswerText());
        return m;
    }).collect(Collectors.toList()));
    return AppResponse.success(result);
}
```

<!--
單一份的答案。

（下一步）找出這一份作答，找不到就 404。

（下一步）放進一個 Map：編號、姓名、送出時間、問卷標題。getSurvey() 是 LAZY 的關聯，用到的時候助理才去拿，寫起來和一般的 getter 一樣。

（下一步）details 是每一題的答案，也是用輸送帶。每一個答案換成一個 Map：題目、題型、答案的文字。選擇題的答案文字，下一章送出的時候會把選項串起來存，所以這裡直接拿就好。
-->

---

# 統計要算出什麼

```json
{ "surveyTitle": "2026 程式語言喜好大調查", "totalResponses": 3,
  "questionStats": [
    { "questionTitle": "您最常使用的程式語言是？", "type": "SINGLE",
      "optionStats": { "7": { "optionText": "Java", "count": 1, "percentage": 33.3 }, … } },
    { "questionTitle": "對本課程有什麼建議嗎？", "type": "TEXT",
      "textAnswers": [ "希望增加更多實戰練習！", "很好" ] } ] }
```

<v-clicks>

- 總共收到幾份
- 選擇題：每個選項被選了幾次、佔幾 %（前端會畫成圓餅圖）
- 簡答題：把所有人寫的文字收成一份清單

</v-clicks>

<!--
最後是統計。先看要算出什麼。這是實際跑出來的結果，稍微整理過。

（下一步）總共收到幾份，totalResponses。

（下一步）選擇題，每個選項被選了幾次、佔幾 %。用選項的編號當 key。前端會把它畫成圓餅圖。

（下一步）簡答題，把所有人寫的文字收成一份清單。

接下來三頁，一步一步把它算出來。
-->

---

# 統計（一）：準備

```java {2-4|6-9|11-16|18-21}
public AppResponse<?> getSurveyStats(Long id) {
    Survey survey = surveyRepository.findById(id)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    List<SurveyResponse> responses = responseRepository.findBySurveyId(id);
    int totalResponses = responses.size();
    Map<String, Object> stats = new HashMap<>();
    stats.put("surveyId", survey.getId());
    stats.put("surveyTitle", survey.getTitle());
    stats.put("totalResponses", totalResponses);

    List<Map<String, Object>> qStatsList = new ArrayList<>();
    for (Question q : survey.getQuestions()) {
        Map<String, Object> qMap = new HashMap<>();
        qMap.put("questionId", q.getId());
        qMap.put("questionTitle", q.getTitle());
        qMap.put("type", q.getType());
        // 下兩頁：依題型分別統計
        qStatsList.add(qMap);
    }
    stats.put("questionStats", qStatsList);
    return AppResponse.success(stats);
}
```

<!--
統計的第一步，準備。

（下一步）找出問卷，以及這份問卷收到的所有作答。

（下一步）做一個 Map 放結果。先放問卷的編號、標題，和總份數。size() 是清單的長度。

（下一步）每一題做一個 Map，放題目的基本資料。中間空著的地方，下兩頁依題型分別統計。然後把它加進題目統計的清單。

（下一步）最後把題目統計的清單放進結果，包成回覆單。
-->

---

# 統計（二）：簡答題，攤開再挑

```java {2|3|4|5-7}
if (q.getType().equals("TEXT")) {
    qMap.put("textAnswers", responses.stream()
            .flatMap(r -> r.getAnswers().stream())
            .filter(a -> a.getQuestion().getId().equals(q.getId()))
            .map(ResponseAnswer::getAnswerText)
            .filter(Objects::nonNull)
            .collect(Collectors.toList()));
}
```

<v-clicks>

- 輸送帶上放的是「一份一份的作答」
- **`flatMap`**：每一份作答本身又是一疊答案，把它們**攤開**，變成一條「所有人的所有答案」
- 只留下回答這一題的
- 換成答案的文字；`Objects::nonNull` 是「不是 null 的才留下」；收成清單

</v-clicks>

<!--
簡答題。要把所有人在這一題寫的文字收成清單。

（下一步）輸送帶上放的是一份一份的作答。

（下一步）新的一站：flatMap。每一份作答本身又是一疊答案。map 會把每一份換成「一疊」，輸送帶上變成一疊一疊的。flatMap 則是把每一疊攤開，倒在輸送帶上，變成一條長長的「所有人的所有答案」。flat 是攤平的意思。

（下一步）filter，只留下回答這一題的答案。比較編號要用 equals，因為 Long 是物件。

（下一步）map 換成答案的文字，這裡用兩個冒號的寫法。再 filter 一次，Objects::nonNull 意思是「不是 null 的才留下」，有人沒寫就跳過。最後收成清單。
-->

---

# 統計（三）：選擇題，先歸零再數

```java {2-8|9-16|17-21}
} else {
    Map<Long, Map<String, Object>> optMap = new HashMap<>();
    for (Option o : q.getOptions()) {
        Map<String, Object> oData = new HashMap<>();
        oData.put("optionText", o.getOptionText());
        oData.put("count", 0);
        optMap.put(o.getId(), oData);
    }
    responses.stream()
            .flatMap(r -> r.getAnswers().stream())
            .filter(a -> a.getQuestion().getId().equals(q.getId()))
            .flatMap(a -> a.getSelectedOptions().stream())
            .forEach(o -> {
                Map<String, Object> oData = optMap.get(o.getId());
                if (oData != null) oData.put("count", (int) oData.get("count") + 1);
            });
    for (Map<String, Object> oData : optMap.values()) {
        double pct = totalResponses > 0 ? ((int) oData.get("count") * 100.0 / totalResponses) : 0;
        oData.put("percentage", Math.round(pct * 10.0) / 10.0);
    }
    qMap.put("optionStats", optMap);
}
```

<!--
選擇題。

（下一步）先替每個選項準備一格計數，從 0 開始。用選項的編號當 key，查的時候比較快。

（下一步）然後開始數。一樣先攤開成所有人的答案，只留下這一題的。再 flatMap 一次：每個答案勾了幾個選項，攤開成一條「所有被勾的選項」。最後一站換成 forEach：對每一個東西做一件事，不收成清單。做的事是：找到這個選項的那一格，把 count 加一。拿出來的是 Object，前面加 int 轉型。

（下一步）最後算百分比。values() 是 Map 裡所有的值。被選的次數乘以一百，除以總份數。沒有人填的時候是 0，避免除以 0。Math.round 是四捨五入，先乘 10 再除 10，就是留到小數點後一位。
-->

---

# AdminSurveyController（下）

```java
@GetMapping("/{id}/stats")
public AppResponse<?> getSurveyStats(@PathVariable("id") Long id) {
    return surveyService.getSurveyStats(id);
}

@GetMapping("/{id}/responses")
public AppResponse<?> getSurveyResponses(@PathVariable("id") Long id) {
    return surveyService.getSurveyResponses(id);
}

@GetMapping("/response-detail/{responseId}")
public AppResponse<?> getResponseDetail(@PathVariable("responseId") Long responseId) {
    return surveyService.getResponseDetail(responseId);
}
```

<!--
最後在 AdminSurveyController 加三支 API：統計、填寫名單、單一份的答案。都是把參數交給 Service。

到這裡，後台的程式全部完成了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 用 Postman 試試看

<!--
重新啟動，用管理員的通行證試試看。
-->

---

# 新增、查詢、修改、刪除

先登入管理員，Authorization 選 **Bearer Token**。

<v-clicks>

1. `POST /api/admin/surveys`，Body 是 Part 1 那份問卷 JSON → 200，回傳的問卷有了 `id`
2. `GET /api/admin/surveys` → 一份；`?title=2026&startDate=2026-07-01` → 篩選
3. `PUT /api/admin/surveys/1`，選項多加一個 `"Go"` → 200，題目的 `id` 都換新了
4. 把第一題的 `title` 改成空白 → **400**「題目名稱不可為空」
5. `DELETE /api/admin/surveys/1` → 200；再查一次 → **404**
6. 換成一般會員的通行證 → **403**

</v-clicks>

<!--
先登入管理員，Authorization 選 Bearer Token，貼上通行證。

（下一步）新增。Body 是 Part 1 那份問卷 JSON。得到 200，回傳的問卷有了 id，每一題、每個選項也都有 id。

（下一步）列表，有一份。加上網址參數，試試篩選。

（下一步）修改。第一題的選項多加一個 Go。得到 200，注意看題目的 id 都換新了。

（下一步）把第一題的 title 改成空白再送，得到 400，「題目名稱不可為空」。這就是巢狀 @Valid 的效果。

（下一步）刪除。得到 200。再查一次，得到 404。刪完之後請再新增一次，下一章要用。

（下一步）換成一般會員的通行證，後台全部是 403。
-->

---

# 暫存流程和統計

<v-clicks>

1. `POST /api/admin/surveys/session-store`，Body 是另一份問卷 → 200
2. `GET /api/admin/surveys/session-get` → 剛才那一份，`id` 還是 `null`（還沒存進資料庫）
3. `POST /api/admin/surveys/confirm-commit?isPublish=false` → 存成**草稿**，有了 `id`
4. 再 `GET /session-get` → **404**：置物櫃已經清空
5. `GET /api/admin/surveys/1/stats` → `totalResponses` 是 0，每個選項都是 0 次

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 Postman 會自動保存 Cookie，所以三個請求用的是同一格置物櫃（第四十二章）。統計要等下一章有人填寫之後，才會有數字。
</div>

</v-click>

<!--
接著試暫存流程。

（下一步）session-store，Body 是另一份問卷，例如社團滿意度調查。得到 200。

（下一步）session-get，拿回剛才那一份。注意 id 還是 null，因為還沒存進資料庫。

（下一步）confirm-commit，isPublish 等於 false。存成草稿，回傳的問卷有了 id，狀態是 DRAFT。

（下一步）再 session-get 一次，得到 404。置物櫃已經清空了。

（下一步）最後看統計。totalResponses 是 0，每個選項都是 0 次。

（下一步）Postman 會自動保存 Cookie，所以這三個請求用的是同一格置物櫃，第四十二章看過。統計要等下一章有人填寫之後，才會有數字。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動手練習

<!--
換大家動手。
-->

---

# 練習：複製一份問卷

每學期的課程意見調查都差不多。請做一個「複製」的功能：

<v-clicks>

1. `POST /api/admin/surveys/{id}/copy`
2. 照原本的問卷建立一份新的：標題後面加「（複本）」，狀態是草稿
3. 題目和選項都要複製過去
4. 原本的問卷就算已經有人填過，也可以複製

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：不用自己一題一題抄。先用 <code>getSurveyDetails()</code> 拿到 DTO，把 <code>id</code> 清掉，再交給 <code>saveSurvey()</code>。record 拿資料是 <code>data()</code>。
</div>

</v-click>

<!--
練習。每學期的課程意見調查都差不多，管理員希望能複製一份再改。

（下一步）新增一支 API：POST /api/admin/surveys/{id}/copy。

（下一步）照原本的問卷建立一份新的。標題後面加「（複本）」，狀態是草稿。

（下一步）題目和選項都要複製過去。

（下一步）原本的問卷就算已經有人填過，也可以複製。

（下一步）提示：不用自己一題一題抄。先用 getSurveyDetails 拿到 DTO，把 id 清掉，再交給 saveSurvey。getSurveyDetails 回傳的是回覆單，AppResponse 是 record，拿附件要用 data()。

請先暫停，自己試試看。
-->

---

# 練習：參考答案

```java
// SurveyService
@Transactional
public AppResponse<SurveyDTO> copySurvey(Long id) {
    SurveyDTO dto = getSurveyDetails(id).data();
    dto.setId(null);
    dto.setTitle(dto.getTitle() + "（複本）");
    dto.setStatus("DRAFT");
    return saveSurvey(dto);
}
```

```java
// AdminSurveyController
@PostMapping("/{id}/copy")
public AppResponse<?> copySurvey(@PathVariable("id") Long id) {
    return surveyService.copySurvey(id);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 為什麼填過的也能複製？<code>id</code> 清成 <code>null</code> 之後，<code>saveSurvey()</code> 會當成<b>新增</b>，不會去檢查原本那一份。DTO 裡題目和選項的 <code>id</code> 不用清：<code>saveSurvey()</code> 本來就會建立全新的題目和選項。
</div>

</v-click>

<!--
參考答案。

SurveyService 加 copySurvey。拿到原本那一份的 DTO，id 設成 null，標題加上複本，狀態改成草稿，交給 saveSurvey。

AdminSurveyController 加一支 POST 的 API。

（下一步）為什麼填過的也能複製？因為 id 清成 null 之後，saveSurvey 會當成新增，最前面那個「填過就不能改」的檢查不會成立。DTO 裡題目和選項的 id 不用清，因為 saveSurvey 本來就會建立全新的題目和選項，不看它們的 id。
-->

---

# 複習：後台對照表

<Pairs left="管理員要做的事" right="程式" rows="doc,一份問卷，一層包一層=code,SurveyDTO → QuestionDTO → OptionDTO + @Valid|machine,Entity 換成 DTO=code,convertToDTO：stream().map() 兩層|form,新增和修改=code,saveSurvey：清掉重建，填過就不准改|cabinet,先預覽再發佈=code,Session：session-store → session-get → confirm-commit|book,統計=code,flatMap 攤開、forEach 計數、百分比" />

<!--
複習今天的內容。

（下一步）一份問卷一層包一層，DTO 也是三層，每一層都要 @Valid。

（下一步）Entity 換成 DTO，用兩層的輸送帶。

（下一步）新增和修改用同一個方法，清掉重建，填過就不准改。

（下一步）先預覽再發佈，用置物櫃：暫存、拿出來、確認。

（下一步）統計，用 flatMap 攤開，forEach 計數，最後算百分比。
-->

---

# 章節總結

<v-clicks>

- **巢狀 DTO**：清單上加 `@Valid`，裡面的每一個物件才會被檢查
- **convertToDTO**：輸送帶裡還有輸送帶；箭頭右邊多行時用大括號和 `return`
- **saveSurvey**：有 `id` 是修改、沒有是新增；先清掉再重建，靠 `cascade` 和 `orphanRemoval`
- **已有人作答**：不能修改、不能刪除，避免答案對不上題目
- **暫存流程**：草稿先放置物櫃，確認後才存進資料庫
- **統計**：`flatMap` 把一疊一疊攤成一條，`forEach` 一個一個數

</v-clicks>

<v-click>

下一章：前台。訪客怎麼填問卷、確認、送出，會員怎麼看自己的紀錄。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）巢狀的 DTO，清單上要加 @Valid，裡面的每一個物件才會被檢查。convertToDTO 是輸送帶裡還有輸送帶，箭頭右邊多行的時候用大括號和 return。saveSurvey 有 id 是修改、沒有是新增，先清掉再重建，靠 cascade 和 orphanRemoval。已經有人作答的問卷，不能修改、不能刪除。暫存流程是草稿先放置物櫃，確認後才存進資料庫。統計用 flatMap 把一疊一疊攤成一條，再用 forEach 一個一個數。

（最後一步）下一章是前台。訪客怎麼填問卷、確認、送出，會員怎麼看自己的紀錄。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。程式很多，請一定要自己用 Postman 跑一遍。

有任何問題歡迎提出來。
-->
