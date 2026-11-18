---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "實戰專題（四）：前台作答流程"
routeAlias: ch52
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
    實戰專題（四）<br>前台作答流程
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「填寫、確認、送出，一步都不能少」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第五十二章，實戰專題的第四章，也是後端的最後一章。

上一章做好了管理員的後台。今天做前台：任何人都能看到進行中的問卷、填寫、在確認頁核對一次，再送出。會員還能看自己填過哪些問卷。

今天做完，整個後端就完成了。
-->

---

# 今天要完成的三件事

<v-clicks>

- **前台查詢**：列出進行中的問卷、看一份問卷的題目
- **三步驟作答**：暫存 → 確認頁 → 送出，並且擋下重複填寫
- **會員的紀錄**：登入的人送出時記下是誰，之後可以查「我填過哪些」

</v-clicks>

<!--
今天要完成三件事。

（下一步）第一，前台查詢。列出進行中的問卷，以及看一份問卷的題目。

（下一步）第二，三步驟作答。暫存、確認頁、送出，並且擋下重複填寫。

（下一步）第三，會員的紀錄。登入的人送出的時候，記下是誰，之後可以查「我填過哪些」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 前台查詢

<!--
先做最簡單的：讓大家看到問卷。
-->

---

# 進行中的問卷

在 `SurveyService` 加上：

```java
public AppResponse<List<SurveyDTO>> getActiveSurveys() {
    List<Survey> surveys = surveyRepository.findActiveSurveys();
    return AppResponse.success(surveys.stream().map(this::convertToDTO).collect(Collectors.toList()));
}
```

<v-clicks>

- `findActiveSurveys()`：第四十九章的便條，已發佈、而且今天在開放期間內
- `this::convertToDTO`：兩個冒號的寫法（第三十八章），`this` 代表「這個類別自己的方法」
- 等於 `.map(s -> convertToDTO(s))`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 看一份問卷的題目，直接用上一章的 <code>getSurveyDetails(id)</code>，不用另外寫。
</div>

</v-click>

<!--
在 SurveyService 加一個方法，找出進行中的問卷。

（下一步）用第四十九章的便條 findActiveSurveys：已發佈，而且今天在開放期間內。草稿和過期的都不會出現。

（下一步）每一份換成 DTO。這裡用了兩個冒號的寫法，第三十八章看過 Student::getName。這裡前面是 this，代表「這個類別自己的方法」，也就是上一章寫的 convertToDTO。

（下一步）它等於 s 箭頭 convertToDTO(s)。

（下一步）看一份問卷的題目，直接用上一章的 getSurveyDetails，不用另外寫。
-->

---

# 前端送來的作答

```json
{
  "surveyId": 1, "name": "測試人員", "phone": "0912345678", "email": "test@example.com", "age": 25,
  "answers": [
    { "questionId": 4, "optionIds": [7] },
    { "questionId": 5, "optionIds": [11, 12] },
    { "questionId": 6, "optionIds": [], "answerText": "希望增加更多實戰練習！" }
  ]
}
```

<v-clicks>

- 填寫人的資料，加上每一題的答案
- 單選題：`optionIds` 放**一個**選項編號
- 多選題：`optionIds` 放**好幾個**選項編號
- 簡答題：`optionIds` 是空的，文字放在 `answerText`

</v-clicks>

<!--
看一下前端送來的作答長什麼樣子。

（下一步）上面是填寫人的資料：問卷編號、姓名、手機、Email、年齡。下面 answers 是每一題的答案。

（下一步）單選題，optionIds 放一個選項編號。

（下一步）多選題，optionIds 放好幾個選項編號。

（下一步）簡答題，optionIds 是空的，文字放在 answerText。

注意：題目和選項的編號，要用 GET 問卷詳情拿到的編號。上一章說過，修改問卷之後編號會換新。
-->

---

# 兩個 record

```java
public record AnswerDTO(Long questionId, List<Long> optionIds, String answerText) {
}
```

```java
public record ResponseDTO(
        Long surveyId,
        @NotBlank(message = "姓名不可為空") String name,
        @NotBlank(message = "手機不可為空") String phone,
        @NotBlank(message = "Email 不可為空") String email,
        Integer age,
        List<AnswerDTO> answers) {
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 為什麼用 record？作答從前端送來之後，只會被讀取、放進置物櫃、再拿出來，<b>從頭到尾不會被修改</b>，正好是第三十八章說的「護貝的小卡」。
</div>

</v-click>

<!--
在 dto 資料夾新增兩個 record。

AnswerDTO 是一題的答案：題目編號、選項編號的清單、文字。

ResponseDTO 是整份作答。姓名、手機、Email 必填，年齡選填，最後是答案的清單。

（下一步）為什麼這兩個用 record？作答從前端送來之後，只會被讀取、放進置物櫃、再拿出來，從頭到尾不會被修改。正好是第三十八章說的護貝的小卡。上一章的問卷 DTO 要用 setter 一格一格填，所以用 @Data 的類別。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 三步驟作答

<!--
接下來是今天的重點：三步驟作答。
-->

---

# 交卷之前，先核對一次

<Flow nodes="Tom:前端|SurveyController|置物櫃:Session|資料庫" steps="1>2:① POST /session-store（填好的答案）|2>4:這個 Email 填過了嗎？|2>3:沒填過：先放進置物櫃|1>2:② GET /session-get（確認頁）|3>1:拿出來給 Tom 核對|1>2:③ POST /confirm|3>4:真正寫入，清空置物櫃" />

<!--
就像紙本考試，交卷之前，老師讓你再核對一次。

（下一步）第一步，Tom 填好了，按「下一步」。前端送出 POST /session-store。

（下一步）櫃台先問資料庫：這個 Email 填過這份問卷了嗎？

（下一步）沒填過，就先放進 Tom 的置物櫃。還沒有寫進資料庫。

（下一步）第二步，前端換到確認頁，送出 GET /session-get。

（下一步）櫃台從置物櫃拿出來，給 Tom 核對。

（下一步）第三步，Tom 確認沒問題，按「送出」。前端送出 POST /confirm。

（下一步）這時候才真正寫進資料庫，然後清空置物櫃。

和上一章管理員的暫存流程是同一個做法。Tom 如果是訪客，沒有通行證，一樣有自己的置物櫃。
-->

---

# 暫存和拿出來

```java {1-7|9-13}
public AppResponse<?> saveToSession(ResponseDTO submission, HttpSession session) {
    if (responseRepository.existsBySurveyIdAndEmail(submission.surveyId(), submission.email())) {
        throw new BizException(RspCode.DUPLICATE_ERROR, "此 Email 已填寫過本問卷");
    }
    session.setAttribute(SURVEY_SESSION_KEY, submission);
    return AppResponse.success(null);
}

public AppResponse<ResponseDTO> getFromSession(HttpSession session) {
    ResponseDTO data = (ResponseDTO) session.getAttribute(SURVEY_SESSION_KEY);
    if (data == null) throw new BizException(RspCode.NOT_FOUND, "找不到暫存的作答");
    return AppResponse.success(data);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 重複檢查放在<b>第一步</b>：Tom 一按「下一步」就知道填過了，不用等到確認頁按了送出才被拒絕。檢查的依據是 Email，用的是第四十九章的 <code>existsBySurveyIdAndEmail</code>。
</div>

</v-click>

<!--
在 SurveyService 加兩個方法。

（下一步）暫存。先用第四十九章的 existsBySurveyIdAndEmail，問這個 Email 有沒有填過這份問卷。record 拿資料是 surveyId()、email()。填過就丟出 409。沒填過，放進置物櫃。

（下一步）拿出來。和上一章一樣，拿不到就丟 404。

（下一步）重複檢查放在第一步。Tom 一按下一步就知道填過了，不用等到確認頁按了送出才被拒絕。這是使用者體驗上的考量。
-->

---

# 確認送出

```java {2-4|5|6}
@Transactional
public AppResponse<?> commitFromSession(HttpSession session, String email) {
    ResponseDTO submission = (ResponseDTO) session.getAttribute(SURVEY_SESSION_KEY);
    if (submission == null) throw new BizException(RspCode.NOT_FOUND, "找不到暫存的作答");
    AppResponse<?> response = submitResponse(submission.surveyId(), submission, email);
    session.removeAttribute(SURVEY_SESSION_KEY);
    return response;
}
```

<v-clicks>

- 從置物櫃拿出暫存的作答
- 交給 `submitResponse()` 真正寫入（下一個部分）
- 成功才清空；寫入失敗會丟出例外，置物櫃裡的作答還在，可以再試一次

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 參數多了一個 <code>email</code>：<b>登入的人</b>是誰。訪客就是 <code>null</code>。它和作答表單上填的 Email 是兩回事，下一頁說明。
</div>

</v-click>

<!--
確認送出。

（下一步）從置物櫃拿出暫存的作答。

（下一步）交給 submitResponse 真正寫入，這是下一個部分。

（下一步）成功之後才清空。如果寫入失敗，丟出例外，下一行就不會執行，置物櫃裡的作答還在，可以再試一次。

（下一步）注意參數多了一個 email。它是登入的人是誰，從通行證來的。訪客就是 null。它和作答表單上填的 Email 是兩回事：表單上的 Email 誰都可以填，通行證上的 Email 才是真正登入的會員。
-->

---

# 想一想

<Poll question="Tom 在第一步（session-store）就被回覆 409。最可能的原因是什麼？" options="Tom 沒有登入|這個 Email 已經填過這份問卷|置物櫃是空的|問卷已經被刪除" answer="2" />

<!--
來想一題。

Tom 在第一步 session-store 就被回覆 409。最可能的原因是什麼？

（等大家作答）

（下一步）答案是：這個 Email 已經填過這份問卷。

409 是資料重複。沒有登入不會被擋，因為前台是公開的。置物櫃是空的是第二步、第三步才會遇到的 404。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 真正寫入資料庫

<!--
接下來是 submitResponse，把一份作答變成資料庫裡的資料。這是前台最長的方法，分三頁看。
-->

---

# submitResponse（一）：建立一份作答

```java {3-4|5-11|12-14}
@Transactional
public AppResponse<?> submitResponse(Long surveyId, ResponseDTO submission, String email) {
    Survey survey = surveyRepository.findById(surveyId)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    SurveyResponse response = new SurveyResponse();
    response.setSurvey(survey);
    response.setSubmittedAt(LocalDateTime.now());
    response.setName(submission.name());
    response.setPhone(submission.phone());
    response.setEmail(submission.email());
    response.setAge(submission.age());
    if (email != null) {
        response.setUser(userRepository.findByEmail(email).orElse(null));
    }
    // 下一頁：每一題的答案
```

<!--
submitResponse 的第一部分，建立一份作答。

（下一步）找出問卷，找不到就 404。

（下一步）建立一個 SurveyResponse。屬於這份問卷，送出時間是現在，用第三十八章的 LocalDateTime.now()。然後把填寫人的資料抄過去。

（下一步）如果是登入的會員，email 不是 null，就找出這位會員，連上去。訪客的話，user 維持 null。第四十九章說過，這個外鍵可以是空的。
-->

---

# submitResponse（二）：找到這一題

```java {1|2-5|6|8-10}
    for (AnswerDTO aDto : submission.answers()) {
        Question question = survey.getQuestions().stream()
                .filter(q -> q.getId().equals(aDto.questionId()))
                .findFirst()
                .orElse(null);
        if (question == null) continue;

        ResponseAnswer answer = new ResponseAnswer();
        answer.setSurveyResponse(response);
        answer.setQuestion(question);
        // 下一頁：依題型存答案
```

<v-clicks>

- 每一題的答案，一個一個處理
- 在這份問卷的題目裡，找出編號一樣的那一題。`findFirst()`：輸送帶上的**第一個**，拿到的是信封
- `continue`：找不到這一題（前端送錯了），**跳過**，繼續處理下一題
- 建立一個答案，兩邊都設定：屬於這份作答、回答這一題

</v-clicks>

<!--
第二部分，每一題的答案。

（下一步）用 for 迴圈，一題一題處理。

（下一步）這一題的答案，回答的是哪一題？在這份問卷的題目裡找出編號一樣的那一題。用輸送帶 filter，再用 findFirst，拿輸送帶上的第一個。findFirst 拿到的是信封，因為可能一個都沒有，所以用 orElse(null) 拆開。

（下一步）continue 的意思是：這一圈到此為止，直接跳到下一圈。找不到這一題，代表前端送錯了，或是送了別份問卷的題目編號，就跳過它，繼續處理下一題。

（下一步）找到了，就建立一個答案。兩邊都要設定：它屬於這份作答，它回答這一題。
-->

---

# submitResponse（三）：依題型存答案

<CodeSteps>

```java {1-2|3-7|8-10|12|13-14}
        if (question.getType().equals("TEXT")) {
            answer.setAnswerText(aDto.answerText());
        } else {
            List<Option> selected = question.getOptions().stream()
                    .filter(o -> aDto.optionIds().contains(o.getId()))
                    .collect(Collectors.toList());
            answer.setSelectedOptions(selected);
            answer.setAnswerText(selected.stream()
                    .map(Option::getOptionText)
                    .collect(Collectors.joining(";")));
        }
        response.getAnswers().add(answer);
    }
    responseRepository.save(response);
    return AppResponse.success(null);
}
```

- 簡答題：文字直接存
- 選擇題：這一題的選項裡，挑出「編號在 `optionIds` 裡面」的。`contains()` 是問清單裡有沒有這個東西
- 同時把選項文字用分號串起來存一份，例如 `網頁前端;網頁後端`，看明細的時候直接用
- 把答案放進這份作答的清單
- 只存作答：`cascade` 會把每一題的答案、多對多的對照表一起存

</CodeSteps>

<!--
第三部分，依題型存答案。

（下一步）簡答題，文字直接存進 answerText。

（下一步）選擇題。在這一題的選項裡，挑出編號在 optionIds 裡面的。contains 是問清單裡有沒有這個東西。這樣就算前端送了別題的選項編號，也不會被存進來。挑出來的選項，放進多對多的 selectedOptions。

（下一步）同時把選項的文字，用第三十八章的 Collectors.joining 串起來，用分號隔開，也存進 answerText。上一章「單一份的答案」直接用的就是它。

（下一步）把答案放進這份作答的清單。

（下一步）迴圈結束之後，只存這份作答。cascade 會把每一題的答案，以及多對多的對照表，一起存進去。
-->

---

# 想一想

<Poll question="一位訪客（沒有登入）送出作答，survey_responses 這一列的 user_id 會是什麼？" options="0|null（空的）|他填的 Email|管理員的編號" answer="2" />

<!--
來想一題。

一位訪客送出作答，survey_responses 這一列的 user_id 會是什麼？

（等大家作答）

（下一步）答案是 null，空的。

訪客沒有通行證，email 參數是 null，所以 setUser 那一段不會執行。填寫人的姓名和 Email 還是存在這一列裡，只是沒有連到任何會員。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 前台的櫃台

<!--
最後寫前台的櫃台，以及會員的紀錄。
-->

---

# SurveyController（上）

```java {4-7|9-12|14-17|19-22}
@RestController
@RequestMapping("/api/surveys")
public class SurveyController {
    @GetMapping
    public AppResponse<?> getActiveSurveys() {
        return surveyService.getActiveSurveys();
    }

    @GetMapping("/{id}/details")
    public AppResponse<?> getSurveyDetails(@PathVariable("id") Long id) {
        return surveyService.getSurveyDetails(id);
    }

    @PostMapping("/session-store")
    public AppResponse<?> storeInSession(@Valid @RequestBody ResponseDTO submission, HttpSession session) {
        return surveyService.saveToSession(submission, session);
    }

    @GetMapping("/session-get")
    public AppResponse<?> getFromSession(HttpSession session) {
        return surveyService.getFromSession(session);
    }
}
```

<!--
在 controller 資料夾新增 SurveyController，網址開頭是 /api/surveys。@Autowired 的 SurveyService 一樣省略沒寫。

（下一步）進行中的問卷。

（下一步）一份問卷的題目。網址多了 /details，這是原本專題的網址，前端照這個寫，不要改。

（下一步）第一步暫存。加上 @Valid，姓名、手機、Email 沒填，就回 400。原本的教材這裡沒有加 @Valid，ResponseDTO 上的規則等於沒有作用，這裡補上。

（下一步）第二步拿出來。
-->

---

# SurveyController（下）：登入的人是誰

```java {1-5|7-12|14-17}
@PostMapping("/confirm")
public AppResponse<?> confirmSubmit(HttpSession session, Authentication authentication) {
    String email = (authentication != null) ? authentication.getName() : null;
    return surveyService.commitFromSession(session, email);
}

@PostMapping("/{id}/submit")
public AppResponse<?> submitResponse(@PathVariable("id") Long id, @Valid @RequestBody ResponseDTO submission,
                                     Authentication authentication) {
    String email = (authentication != null) ? authentication.getName() : null;
    return surveyService.submitResponse(id, submission, email);
}

@GetMapping("/history")
public AppResponse<?> getUserHistory(Authentication authentication) {
    return surveyService.getUserHistory(authentication.getName());
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 前台是公開的，訪客也能呼叫。<b>訪客的 <code>authentication</code> 是 <code>null</code></b>，直接 <code>getName()</code> 程式會出錯，所以先用三元運算子判斷。<code>/history</code> 在守則裡要登入，所以它一定不是 <code>null</code>。
</div>

</v-click>

<!--
後半部有三支 API。

（下一步）第三步，確認送出。參數多一個 Authentication。如果不是 null，代表是登入的會員，拿出他的 Email；是 null 就代表訪客。用三元運算子判斷，再交給 Service。

（下一步）直接送出，不經過置物櫃。原本的專題就有這支 API，給不需要確認頁的情況用。一樣判斷登入的人是誰。

（下一步）我填過哪些問卷。

（下一步）這裡要特別注意。前台是公開的，訪客也能呼叫。訪客的 authentication 是 null。如果直接呼叫 getName()，程式會丟出 NullPointerException，變成 500。所以先用三元運算子判斷。/history 在第五十章的守則裡要登入，警衛會先擋下訪客，所以進到這個方法的時候，它一定不是 null。
-->

---

# 我填過哪些問卷

```java {2-3|4|5-12}
public AppResponse<?> getUserHistory(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BizException(RspCode.UNAUTHORIZED));
    List<SurveyResponse> history = responseRepository.findByUserOrderBySubmittedAtDesc(user);
    return AppResponse.success(history.stream().map(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("responseId", r.getId());
        map.put("surveyId", r.getSurvey().getId());
        map.put("surveyTitle", r.getSurvey().getTitle());
        map.put("submittedAt", r.getSubmittedAt());
        return map;
    }).collect(Collectors.toList()));
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這裡找的是「<b>以會員身分</b>送出的」作答（<code>user_id</code> 是這位會員）。登入前用訪客身分填的，就算 Email 一樣，也不會出現在這裡。
</div>

</v-click>

<!--
最後在 SurveyService 加上 getUserHistory。

（下一步）用通行證上的 Email 找出會員。

（下一步）用第四十九章的方法名稱查詢：這位會員送出的作答，照送出時間新到舊。

（下一步）每一份換成一個 Map：作答編號、問卷編號、問卷標題、送出時間。

（下一步）注意：這裡找的是以會員身分送出的作答，也就是 user_id 是這位會員的。登入前用訪客身分填的，就算填的 Email 一樣，也不會出現在這裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 用 Postman 走一遍

<!--
重新啟動，從頭到尾走一遍。上一章新增的問卷請保持「已發佈」，而且今天在開放期間內。
-->

---

# 訪客填一份問卷

Authorization 選 **No Auth**：

<v-clicks>

1. `GET /api/surveys` → 進行中的問卷；`GET /api/surveys/1/details` → 記下題目和選項的編號
2. `POST /api/surveys/session-store`，Body 是 Part 1 的作答 JSON（編號換成自己的）→ 200
3. `GET /api/surveys/session-get` → 剛才的作答
4. `POST /api/surveys/confirm` → 200；再 `GET /session-get` → **404**（已清空）
5. 同一個 Email 再 `session-store` 一次 → **409**「此 Email 已填寫過本問卷」

</v-clicks>

<!--
先用訪客的身分。Authorization 選 No Auth。

（下一步）GET /api/surveys，看到進行中的問卷。再看問卷詳情，記下題目和選項的編號。

（下一步）session-store，Body 是剛才那份作答 JSON，題目和選項的編號換成自己查到的。得到 200。

（下一步）session-get，拿回剛才的作答。

（下一步）confirm，得到 200。再 session-get 一次，得到 404，置物櫃已經清空了。

（下一步）同一個 Email 再 session-store 一次，得到 409。
-->

---

# 會員填一份，再看結果

<v-clicks>

1. 登入 tom，帶著通行證，換一個 Email 再走一次三步驟
2. `GET /api/surveys/history` → 有剛才那一份；不帶通行證 → **401**
3. 換成管理員：`GET /api/admin/surveys/1/stats` → 有數字和百分比了
4. `GET /api/admin/surveys/1/responses` → 兩個人；`/response-detail/1` → 看到每一題的答案
5. 再試著 `PUT` 或 `DELETE` 這份問卷 → **400**：已經有人填過

</v-clicks>

<!--
接著用會員的身分。

（下一步）登入 tom，帶著他的通行證，換一個 Email，再走一次三步驟。

（下一步）history，看到剛才那一份。不帶通行證的話，得到 401。

（下一步）換成管理員的通行證，看統計。這次有數字和百分比了。

（下一步）填寫名單有兩個人。再看第一份的答案，每一題都有，選擇題的答案是選項的文字。

（下一步）最後試著修改或刪除這份問卷，得到 400。已經有人填過了。
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

# 練習：不在開放期間，不能送出

現在只要知道問卷編號，就算是草稿或已經過期，用 Postman 還是送得出去。請在 `submitResponse()` 加上檢查：

<v-clicks>

1. 問卷不是 `PUBLISHED` → 不能送出
2. 今天在開始日期**之前**，或是在結束日期**之後** → 不能送出
3. 不能送出的時候，回 400「這份問卷目前不開放填寫」
4. 測試：上一章用暫存流程存成草稿的那一份，直接 `POST /api/surveys/{id}/submit`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：第三十八章的 <code>LocalDate.now()</code>、<code>isBefore()</code>、<code>isAfter()</code>。檢查要放在找到問卷之後、建立作答之前。
</div>

</v-click>

<!--
練習。前台只會列出進行中的問卷，但是只要知道問卷編號，就算是草稿或已經過期，用 Postman 還是送得出去。請在 submitResponse 加上檢查。

（下一步）第一，問卷不是 PUBLISHED，不能送出。

（下一步）第二，今天在開始日期之前，或是在結束日期之後，不能送出。

（下一步）第三，不能送出的時候，回 400，「這份問卷目前不開放填寫」。

（下一步）第四，測試。上一章用暫存流程存成草稿的那一份，直接用 submit 送出看看。

（下一步）提示：第三十八章的 LocalDate.now()、isBefore、isAfter。檢查要放在找到問卷之後、建立作答之前。

請先暫停，自己試試看。
-->

---

# 練習：參考答案

```java {3-7}
Survey survey = surveyRepository.findById(surveyId)
        .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
LocalDate today = LocalDate.now();
if (!survey.getStatus().equals("PUBLISHED")
        || today.isBefore(survey.getStartDate()) || today.isAfter(survey.getEndDate())) {
    throw new BizException(RspCode.PARAM_ERROR, "這份問卷目前不開放填寫");
}
SurveyResponse response = new SurveyResponse();
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 放在 <code>submitResponse()</code> 裡，三步驟的 <code>confirm</code> 和直接 <code>submit</code> 都會檢查到，因為兩條路最後都會走到這裡。
</div>

</v-click>

<!--
參考答案。

先拿到今天的日期。三個條件用「或」連起來：不是 PUBLISHED，或今天在開始之前，或今天在結束之後。驚嘆號是「不是」的意思。任何一個成立，就丟出 400。

（下一步）為什麼放在 submitResponse 裡？三步驟的 confirm 和直接 submit，最後都會走到這個方法。放在這裡，兩條路都檢查得到，不用寫兩次。
-->

---

# 後端完成：全部的 API

<v-clicks>

- **會員**：`POST /api/auth/register`、`/login`；`GET`、`PUT /api/users/profile`
- **後台**（`ADMIN`）：`/api/admin/surveys` 的列表、單一份、新增、修改、刪除；`session-store`、`session-get`、`confirm-commit`；`/{id}/stats`、`/{id}/responses`、`/response-detail/{id}`
- **前台**（公開）：`GET /api/surveys`、`/{id}/details`；`session-store`、`session-get`、`confirm`、`/{id}/submit`
- **前台**（要登入）：`GET /api/surveys/history`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這些網址和回覆的格式，都和原本的專題一樣。下一章的 Angular 前端，就是一支一支呼叫它們。
</div>

</v-click>

<!--
到這裡，整個後端完成了。我們看一下全部的 API。

（下一步）會員：註冊、登入，以及查看和修改個人資料。

（下一步）後台，只有管理員：問卷的新增、查詢、修改、刪除，編輯時的暫存流程，以及統計、填寫名單、單一份的答案。

（下一步）前台，公開的：進行中的問卷、問卷詳情，三步驟作答，以及直接送出。

（下一步）前台，要登入的：我填過哪些問卷。

（下一步）這些網址和回覆的格式，都和原本的專題一樣。下一章的 Angular 前端，就是一支一支呼叫它們。
-->

---

# 複習：前台對照表

<Pairs left="填問卷的流程" right="程式" rows="doc,看到進行中的問卷=code,findActiveSurveys() + this::convertToDTO|cabinet,填好先放置物櫃=code,session-store（先檢查 Email 重複 → 409）|form,確認頁核對=code,session-get|ok,按下送出=code,confirm → submitResponse()|you,登入的會員記下是誰=code,authentication 是 null 就是訪客|book,我填過哪些=code,findByUserOrderBySubmittedAtDesc" />

<!--
複習今天的內容。

（下一步）看到進行中的問卷，用便條 findActiveSurveys，加上 this 兩個冒號的寫法。

（下一步）填好先放置物櫃，session-store，先檢查 Email 有沒有重複。

（下一步）確認頁核對，session-get。

（下一步）按下送出，confirm，交給 submitResponse 真正寫入。

（下一步）登入的會員記下是誰。authentication 是 null 就是訪客。

（下一步）我填過哪些，用方法名稱查詢。
-->

---

# 章節總結

<v-clicks>

- **前台查詢**：進行中的問卷用 `@Query` 便條；看題目沿用 `getSurveyDetails()`
- **作答的 DTO** 用 `record`：只讀、不修改
- **三步驟**：暫存（先擋重複）→ 確認頁 → 送出；成功才清空置物櫃
- **submitResponse**：找題目用 `findFirst()`；選擇題存選項，也存一份文字；`cascade` 一起存
- **登入的人**：`Authentication` 可能是 `null`（訪客），先判斷再用

</v-clicks>

<v-click>

後端完成了。下一章：用 Angular 做出畫面，把這些 API 接起來。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）前台查詢，進行中的問卷用便條，看題目沿用上一章的 getSurveyDetails。作答的 DTO 用 record，因為只讀、不修改。三步驟是暫存、確認頁、送出，暫存的時候先擋重複，成功才清空置物櫃。submitResponse 找題目用 findFirst，選擇題存選項，也存一份文字，最後靠 cascade 一起存。登入的人從 Authentication 拿，它可能是 null，要先判斷再用。

（最後一步）後端完成了。從第四十九章到這裡，我們從資料表一路做到全部的 API。下一章，用 Angular 做出畫面，把這些 API 接起來。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊，也是後端的最後一章。

有任何問題歡迎提出來。
-->
