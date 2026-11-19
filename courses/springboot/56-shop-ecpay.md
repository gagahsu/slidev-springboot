---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（六）：綠界金流
routeAlias: ch56
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
    專題（六）<br>綠界金流
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「錢交給綠界收，通知要驗過鋼印才算數」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十六章。這一章把模擬付款換成真的金流：綠界科技的全方位金流，使用測試環境，不會真的扣錢。

金流是整個專題最需要小心的地方。我們會看到為什麼要檢查碼、為什麼付款結果要由綠界的伺服器通知，以及怎麼讓綠界連到我們自己電腦上的後端。
-->

---

# 今天要完成的事

<v-clicks>

- **檢查碼** `CheckMacValue`：寫成類別，用官方範例做單元測試
- **產生付款表單**：`POST /api/orders/{orderNo}/payments/ecpay`
- **接收付款通知**：`POST /api/payments/ecpay/notify`，回 `1|OK`
- **付款完回到網站**：`POST /api/payments/ecpay/result` → 302 到前端
- **讓綠界連得到**：Cloudflare Tunnel；收不到通知時「向綠界查詢」

</v-clicks>

<!--
今天要完成五件事。

（下一步）先寫檢查碼，並且用官方文件的範例做單元測試。算對了，才開始接付款頁。

（下一步）產生付款表單的資料，前端用它跳到綠界的付款頁。

（下一步）接收綠界伺服器送來的付款結果通知，處理完回 1|OK。

（下一步）客人付完款，瀏覽器回到我們的網站。

（下一步）讓綠界的伺服器連得到我們電腦上的後端；萬一收不到通知，後台可以主動向綠界查詢。
-->

---

# 故事：請銀行代收貨款

<v-clicks>

- 店家不自己收信用卡，請**綠界**代收：客人到綠界的櫃台刷卡
- 店家開一張**繳費單**給客人帶去，單子上蓋了店家的**鋼印**，綠界驗過才收
- 刷卡成功，綠界**打電話到店裡**通知：「某某單號收到了」，店員回答「**收到**」
- 電話也要**驗鋼印**：不然誰都能打來說「我付過了」
- 客人刷完卡走回店裡，**看店裡的帳本**才算數，不聽客人口說

</v-clicks>

<!--
用請銀行代收貨款來想。

（下一步）店家不自己處理信用卡，請綠界代收。客人到綠界的櫃台刷卡。

（下一步）店家開一張繳費單給客人帶去，上面有金額、單號，還蓋了店家的鋼印。綠界驗過鋼印才收，客人不能自己改金額。

（下一步）刷卡成功，綠界打電話到店裡通知：某某單號的錢收到了。店員要回答「收到」，綠界才不會一直打來。

（下一步）這通電話也要驗鋼印。不驗的話，誰都可以打電話來說「我付過了」。

（下一步）客人刷完卡走回店裡說「我付了」，店員看的是店裡的帳本，不是聽客人說。
-->

---

# 對應到程式

<Pairs left="代收貨款" right="程式" rows="form,繳費單=code,付款表單的 fields（MerchantTradeNo、TotalAmount…）|key,店家的鋼印=code,CheckMacValue（HashKey + HashIV + SHA256）|teacher,綠界打電話通知=server,ReturnURL：綠界伺服器 POST 到 /notify|ok,回答「收到」=code,回應純文字 1｜OK|you,客人走回店裡=browser,OrderResultURL：瀏覽器 POST 到 /result，再 302 到前端" />

<!--
對應到程式。

（下一步）繳費單，是付款表單的欄位：交易編號、金額、商品名稱等等。

（下一步）店家的鋼印，是檢查碼 CheckMacValue。用只有店家和綠界知道的 HashKey、HashIV，加上 SHA256 算出來。

（下一步）綠界打電話通知，是 ReturnURL：綠界的伺服器 POST 到我們的 notify。

（下一步）回答收到，是回應純文字 1|OK。

（下一步）客人走回店裡，是 OrderResultURL：客人的瀏覽器 POST 到我們的 result，我們再轉到前端的結果頁。
-->

---

# 完整流程

```text
Angular                     Spring Boot                          綠界（測試環境）
  │ 1. POST /api/orders           │ 建立訂單（待付款）                    │
  │ 2. POST …/payments/ecpay      │ 新增 payments，回傳 { action, fields } │
  │ 3. 隱藏表單 POST 到 action（整頁跳到綠界）──────────────────────────▶│ 付款頁
  │                               │◀── 4. ReturnURL（伺服器對伺服器）────│
  │                               │ 驗檢查碼、改成已付款、回 1|OK ──────▶│
  │◀── 5. OrderResultURL（瀏覽器）─│ 302 到 /orders/{no}/result          │
  │ 6. GET /api/orders/{no} 看狀態 │                                    │
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 訂單只在第 4 步改成已付款。第 5 步只負責轉址：瀏覽器帶回來的東西，客人可以自己改。
</div>

</v-click>

<!--
完整流程有六步。

第一步，前端建立訂單。第二步，前端要付款，後端新增一筆付款紀錄，回傳綠界付款頁的網址和表單欄位。第三步，前端建立一個隱藏表單，POST 到綠界，整頁跳過去。綠界規定一定要由瀏覽器送出表單，不能由後端代送。

第四步，客人刷卡成功，綠界的伺服器直接呼叫我們的 notify，這是伺服器對伺服器，客人看不到。我們驗證、改狀態、回 1|OK。

第五步，綠界讓客人的瀏覽器回到我們的 result，我們轉到前端的結果頁。第六步，前端查自己後端的訂單狀態，顯示付款成功。

（下一步）最重要的一點：訂單只在第四步改成已付款。第五步只負責轉址，因為經過瀏覽器的資料，客人都可以動手腳。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 檢查碼

<!--
先做檢查碼。
-->

---

# CheckMacValue 的六個步驟

<v-clicks>

1. 參數（不含 `CheckMacValue`）依名稱 **A→Z** 排序，用 `&` 串成 `key=value`
2. 前面加 `HashKey=…&`，後面加 `&HashIV=…`
3. 整串 **URL encode**，再把 `%2d %5f %2e %21 %2a %28 %29` 換回 `- _ . ! * ( )`
4. 轉**小寫**
5. **SHA256**
6. 轉**大寫**，就是檢查碼

</v-clicks>

<!--
綠界的檢查碼有六個步驟，官方文件叫「檢查碼機制」。

（下一步）第一，把參數依名稱排序，串成 key 等於 value，中間用 & 連接。

（下一步）第二，前面加上 HashKey，後面加上 HashIV。這兩個值只有店家和綠界知道，不會送出去。

（下一步）第三，整串做 URL encode。綠界用的是 .NET 的編碼規則，跟 Java 有一點不同，所以要把這七個符號換回來。

（下一步）第四，轉小寫。

（下一步）第五，做 SHA256 雜湊。

（下一步）第六，轉大寫，就是檢查碼。
-->

---

# EcpayCheckMac

```java {all|2-5|6-8|9-11|12}
public static String compute(Map<String, String> params, String hashKey, String hashIv) {
    Map<String, String> sorted = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
    params.forEach((k, v) -> {
        if (!"CheckMacValue".equalsIgnoreCase(k)) sorted.put(k, v);
    });
    StringBuilder sb = new StringBuilder("HashKey=").append(hashKey);
    sorted.forEach((k, v) -> sb.append('&').append(k).append('=').append(v));
    sb.append("&HashIV=").append(hashIv);
    String encoded = URLEncoder.encode(sb.toString(), StandardCharsets.UTF_8).toLowerCase()
            .replace("%2d", "-").replace("%5f", "_").replace("%2e", ".").replace("%21", "!")
            .replace("%2a", "*").replace("%28", "(").replace("%29", ")");
    return HexFormat.of().withUpperCase().formatHex(sha256(encoded));
}
```

<!--
寫成程式。

（下一步）TreeMap 會自動依 key 排序，CASE_INSENSITIVE_ORDER 表示不分大小寫。CheckMacValue 自己不算進去。

（下一步）前面加 HashKey，串起參數，後面加 HashIV。

（下一步）URL encode 之後轉小寫，再把七個符號換回來。

（下一步）SHA256 之後，用 HexFormat 轉成大寫的十六進位字串。HexFormat 是 Java 17 加入的工具，很方便。
-->

---

# 先用官方範例測試（第 43 章）

```java
@Test
void computeMatchesOfficialExample() {
    Map<String, String> p = new LinkedHashMap<>();
    p.put("TradeDesc", "促銷方案");           p.put("PaymentType", "aio");
    p.put("MerchantTradeDate", "2023/03/12 15:30:23");
    p.put("MerchantTradeNo", "ecpay20230312153023");
    p.put("MerchantID", "3002607");           p.put("ReturnURL", "https://www.ecpay.com.tw/receive.php");
    p.put("ItemName", "Apple iphone 15");     p.put("TotalAmount", "30000");
    p.put("ChoosePayment", "ALL");            p.put("EncryptType", "1");
    assertEquals("6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840",
            EcpayCheckMac.compute(p, "pwFHCqoQZGmho4w6", "EkRm7iFT261dpevs"));
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 常見錯誤：HashKey / HashIV 貼反、看錯字（<code>l</code> / <code>I</code> / <code>1</code>）、忘了替換那七個符號。
</div>

</v-click>

<!--
寫完先別急著接付款頁，用官方文件的範例資料寫單元測試。參數、HashKey、HashIV 都是官方文件公布的，預期的結果也是官方算好的。

測試通過，代表我們的六個步驟跟綠界一模一樣。檢查碼只要錯一個字，整串就完全不同，用付款頁去試錯會非常痛苦，單元測試幾秒鐘就知道對不對。

（下一步）常見的錯誤：HashKey 和 HashIV 貼反、小寫的 l 和大寫的 I 看錯、忘了替換那七個符號。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 付款表單與通知

<!--
接下來產生付款表單。
-->

---

# 設定檔：測試特店

```properties
ecpay.merchant-id=${ECPAY_MERCHANT_ID:3002607}
ecpay.hash-key=${ECPAY_HASH_KEY:pwFHCqoQZGmho4w6}
ecpay.hash-iv=${ECPAY_HASH_IV:EkRm7iFT261dpevs}
ecpay.payment-url=https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5
ecpay.return-url=${ECPAY_RETURN_URL:http://localhost:8080/api/payments/ecpay/notify}
ecpay.order-result-url=${ECPAY_ORDER_RESULT_URL:http://localhost:8080/api/payments/ecpay/result}
```

```java
@ConfigurationProperties(prefix = "ecpay")
public record EcpayProperties(String merchantId, String hashKey, String hashIv, String paymentUrl,
                              String queryUrl, String returnUrl, String orderResultUrl) {}
```

<!--
綠界的設定放在設定檔。3002607 和這組 HashKey、HashIV，是綠界官方公開的測試特店，網址是測試環境 payment-stage。正式環境的金鑰，絕對不能 commit 進 Git，用環境變數設定。

下面的 @ConfigurationProperties 把 ecpay 開頭的設定，一次綁進一個 record，比寫一堆 @Value 整齊。merchant-id 這種有連字號的寫法，會自動對應到 merchantId。主程式要加 @ConfigurationPropertiesScan。
-->

---

# 產生付款表單

```java {all|2-3|5-15|16}
public EcpayFormVO createEcpayForm(String email, String orderNo) {
    Order order = orderService.findOwn(email, orderNo);   checkPayable(order);
    Payment p = newPayment(order, "ECPAY");                // 每次都是新的 MerchantTradeNo
    Map<String, String> fields = new LinkedHashMap<>();
    fields.put("MerchantID", ecpay.merchantId());
    fields.put("MerchantTradeNo", p.getMerchantTradeNo()); // CS + yyMMddHHmmss + 4 碼 = 18 碼
    fields.put("MerchantTradeDate", p.getCreatedAt().format(ECPAY_TIME));  // yyyy/MM/dd HH:mm:ss
    fields.put("PaymentType", "aio");
    fields.put("TotalAmount", String.valueOf(order.getTotalAmount()));
    fields.put("TradeDesc", "轉角咖啡線上商店");
    fields.put("ItemName", itemName(order.getItems()));    // 品項用 # 串接
    fields.put("ReturnURL", ecpay.returnUrl());
    fields.put("OrderResultURL", ecpay.orderResultUrl());
    fields.put("ChoosePayment", "Credit");
    fields.put("EncryptType", "1");
    fields.put("CheckMacValue", EcpayCheckMac.compute(fields, ecpay.hashKey(), ecpay.hashIv()));
    return new EcpayFormVO(ecpay.paymentUrl(), fields);
}
```

<!--
產生付款表單。

（下一步）確認是自己的、待付款的訂單，然後新增一筆付款紀錄。每次按付款都產生新的交易編號，因為綠界規定交易編號不能重複使用。

（下一步）依規格書填入參數：特店編號、交易編號、交易時間、金額、商品名稱、兩個回呼網址、付款方式選信用卡。商品名稱用井字號串接，太長的話改成「第一項 等 N 項」，超過 400 字會被綠界截斷，檢查碼就對不上了。

（下一步）最後算檢查碼，一起放進去。回傳付款頁的網址和所有欄位，前端照著組一個隱藏表單送出。
-->

---

# 接收付款通知：九個步驟的重點

```java {all|2-4|5-6|7|8-9|10|11|12-13}
public String handleNotify(Map<String, String> params) {
    if (!EcpayCheckMac.verify(params, ecpay.hashKey(), ecpay.hashIv())) {
        return "0|CheckMacValue Error";                     // 1. 驗鋼印
    }
    Payment p = paymentRepository.findByMerchantTradeNo(params.get("MerchantTradeNo")).orElse(null);
    if (p == null) return "0|Payment Not Found";            // 2. 找到這次付款
    p.setRawNotify(raw);                                    //    存原始內容，除錯用
    if (Payment.PAID.equals(p.getStatus())) return OK;      // 3. 處理過了：綠界會重送
    if (!String.valueOf(p.getAmount()).equals(params.get("TradeAmt"))) return "0|Amount Error";  // 4. 核對金額
    if ("1".equals(params.get("SimulatePaid"))) { p.setSimulatePaid(true); return OK; }  // 5. 模擬通知
    if (!"1".equals(params.get("RtnCode"))) { p.setStatus(Payment.FAILED); return OK; }  // 6. 付款失敗
    markPaid(p, params.get("TradeNo"), parseTime(params.get("PaymentDate")));             // 7. 成功
    return OK;                                              // "1|OK"
}
```

<!--
接收通知是這一章的重點，每一步都有原因。

（下一步）第一，驗檢查碼。不相符，可能是假的通知，或內容被改過，什麼都不做。

（下一步）第二，用交易編號找到付款紀錄。

（下一步）把原始內容存起來，出問題的時候才查得到綠界到底送了什麼。

（下一步）第三，防重複。綠界沒收到 1|OK，會在五到十五分鐘後重送，一天最多四次。已經處理過的，直接回 1|OK，不能再處理一次。

（下一步）第四，核對金額，必須跟我們記錄的一樣。

（下一步）第五，SimulatePaid 等於 1，是從綠界廠商後台按出來的模擬通知，沒有真的付款，只記錄，不改訂單。

（下一步）第六，RtnCode 不是 1，就是付款失敗，記下失敗，客人可以再付一次。

最後，都沒問題才算付款成功，在同一個交易裡更新付款紀錄和訂單。回應的 1|OK，大小寫和符號都要一模一樣。
-->

---

# 付款完回到網站：只轉址

```java
@PostMapping("/result")
public ResponseEntity<Void> result(@RequestParam Map<String, String> params) {
    String orderNo = paymentService.orderNoOf(params.get("MerchantTradeNo"));
    String target = orderNo == null ? frontendUrl + "/me/orders"
                                    : frontendUrl + "/orders/" + orderNo + "/result";
    return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(target)).build();
}
```

<v-clicks>

- 綠界讓瀏覽器用 **POST** 回來，Angular 的頁面收不到 POST，所以先到後端
- 後端回 **302**，瀏覽器跳到前端的結果頁
- 結果頁查 `GET /api/orders/{orderNo}`：還沒收到通知就顯示「處理中」，每 3 秒再查

</v-clicks>

<!--
付款完，客人的瀏覽器回到我們的網站。

（下一步）綠界讓瀏覽器用 POST 帶著結果回來，但 Angular 的頁面是靜態檔案，收不到 POST，所以先回到後端。

（下一步）後端回 302，瀏覽器就跳到前端的結果頁。這裡完全不改訂單。

（下一步）結果頁去查自己後端的訂單狀態。通知通常比客人早到；如果還沒到，就顯示處理中，每三秒再查一次。
-->

---

# 想一想

<Poll question="有人照著格式，自己 POST 一筆「付款成功」的通知到 /api/payments/ecpay/notify，但他不知道 HashKey。會發生什麼事？" options="訂單變成已付款|檢查碼對不上，回錯誤訊息，什麼都不改|後端當機|綠界會阻止他" answer="2" />

<!--
想一想。有人自己偽造一筆付款成功的通知，但不知道 HashKey，會怎樣？

檢查碼對不上，我們回 CheckMacValue Error，什麼都不改。notify 這個網址是公開的，誰都能呼叫，所以檢查碼是唯一的防線，這也是 HashKey 和 HashIV 絕對不能外流的原因。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 讓綠界連得到

<!--
最後一個問題：綠界連不到我們的電腦。
-->

---

# Cloudflare Tunnel：臨時的公開網址

ReturnURL 是**綠界的伺服器**呼叫的，`localhost:8080` 它連不到。

<v-clicks>

- 安裝 `cloudflared`：macOS `brew install cloudflared`；Windows 到 Cloudflare 的下載頁裝 `cloudflared-windows-amd64.msi`
- 執行 `cloudflared tunnel --url http://localhost:8080`
- 拿到 `https://<隨機名稱>.trycloudflare.com`，**不用註冊帳號**
- 設定環境變數 `ECPAY_RETURN_URL=https://<隨機名稱>.trycloudflare.com/api/payments/ecpay/notify`，重啟後端
- 網址**每次啟動都會變**，只用於開發測試

</v-clicks>

<!--
ReturnURL 是綠界的伺服器呼叫的。我們的 localhost 8080 只有自己的電腦連得到，綠界在網路的另一端，當然連不到。

（下一步）用 Cloudflare Tunnel 解決。先安裝 cloudflared：Mac 用 Homebrew，Windows 到 Cloudflare 的下載頁下載 MSI 安裝檔。

（下一步）執行 cloudflared tunnel 加上 url，指向我們的後端。

（下一步）它會印出一個 trycloudflare.com 的網址，任何人連到這個網址，都會被轉到你電腦的 8080。不用註冊帳號。

（下一步）把這個網址加上 notify 的路徑，設定成 ECPAY_RETURN_URL 環境變數，重啟後端。這就是為什麼網址要放設定檔、不寫死在程式裡。

（下一步）注意，這個網址每次啟動都會變，每次上課都要重新設定。它只適合開發測試，正式上線要部署到有固定網域的主機，Docker 課會講。
-->

---

# 用測試卡付款

| 欄位 | 填什麼 |
| --- | --- |
| 卡號 | `4311-9522-2222-2222` |
| 安全碼 | 任意 3 碼 |
| 有效期限 | 晚於今天的月 / 年 |
| 3D 驗證簡訊碼 | `1234` |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 測試環境不會向銀行請款，也不會產生任何費用。卡號以綠界官方「測試介接資訊」頁面為準。
</div>

</v-click>

<!--
跳到綠界的付款頁之後，用官方公布的測試卡號付款。安全碼隨便填三碼，有效期限填比今天晚的月份，3D 驗證的簡訊碼固定是 1234，不用真的手機。

（下一步）測試環境不會向銀行請款，不會產生任何費用。卡號以綠界官方的「測試介接資訊」頁面為準，如果以後換了，以官方為準。

付款成功後，看後端的 Console：會先收到 notify，訂單改成已付款；接著瀏覽器被轉到結果頁。
-->

---

# 收不到通知時：向綠界查詢

```java
Map<String, String> params = new LinkedHashMap<>();
params.put("MerchantID", ecpay.merchantId());
params.put("MerchantTradeNo", p.getMerchantTradeNo());
params.put("TimeStamp", String.valueOf(Instant.now().getEpochSecond()));   // 3 分鐘內有效
params.put("CheckMacValue", EcpayCheckMac.compute(params, ecpay.hashKey(), ecpay.hashIv()));
String body = RestClient.create().post().uri(ecpay.queryUrl())
        .contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(String.class);
// 回應：TradeStatus=1&TradeAmt=330&TradeNo=…&CheckMacValue=…  → 一樣要驗檢查碼
```

<v-clicks>

- 後台按「向綠界查詢」：`POST /api/admin/orders/{orderNo}/payments/query`
- `TradeStatus = 1` 而且金額相符，就補更新成已付款
- 不要太頻繁：信用卡建議付款後約 10 分鐘再查，太頻繁會被暫時擋下

</v-clicks>

<!--
萬一沒收到通知，例如 Tunnel 沒開，訂單會一直停在待付款。這時候後台可以主動向綠界查詢。

送出特店編號、交易編號、時間戳記和檢查碼，用 Spring 的 RestClient POST 到查詢網址。回應是 key 等於 value 的字串，裡面也有檢查碼，一樣要驗。

（下一步）這支 API 放在後台，管理員按一個按鈕就能查。

（下一步）TradeStatus 是 1、而且金額相符，就補更新成已付款。

（下一步）不要寫成排程每秒狂查，綠界會暫時擋掉太頻繁的請求。
-->

---

# 重點回顧

<Pairs left="代收貨款" right="程式" rows="key,鋼印=code,CheckMacValue，先用官方範例測試|form,繳費單=code,{ action, fields }，前端隱藏表單送出|teacher,打電話通知=server,/notify：驗檢查碼、防重複、核金額、回 1｜OK|you,客人走回店裡=browser,/result：只轉址，前端查自己的訂單|shop,讓綠界找得到店=code,Cloudflare Tunnel + ECPAY_RETURN_URL" />

<!--
回顧。

（下一步）鋼印是檢查碼，先用官方範例測試。

（下一步）繳費單是後端產生的欄位，前端用隱藏表單送出。

（下一步）綠界打電話通知，是 notify：驗檢查碼、防重複、核對金額、回 1|OK。

（下一步）客人走回店裡，是 result：只轉址。

（下一步）讓綠界找得到店，是 Cloudflare Tunnel 加上環境變數。
-->

---

# 小結

<v-clicks>

- 檢查碼寫成獨立類別，**單元測試通過**才接付款頁
- 每次付款都用**新的** `MerchantTradeNo`；`order_no` 不變
- 只有 **ReturnURL 的通知**能把訂單改成已付款，而且要驗檢查碼
- **練習**：用模擬的通知內容測試：竄改 `TradeAmt`、同一筆送兩次、`SimulatePaid=1`

</v-clicks>

<!--
小結。

（下一步）檢查碼寫成獨立類別，單元測試通過才接付款頁。

（下一步）每次付款都用新的交易編號，訂單編號不變。

（下一步）只有 ReturnURL 的通知能把訂單改成已付款，而且一定要驗檢查碼。

（下一步）練習：自己組幾筆通知內容送到 notify：竄改金額、同一筆送兩次、模擬通知，確認每一種都照規格處理。下一章，後台的訂單管理和報表。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
