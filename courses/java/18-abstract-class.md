---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 抽象類別 (Abstract Class)
routeAlias: ch18
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
    Java Programming Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    抽象類別
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「定義骨架，交由子類別實作」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到抽象類別的世界！「抽象」聽起來很玄，其實它就是一個「沒做完的半成品」。想像主管跟我們說「我們要做一個系統」，但細節要怎麼做？主管不管，留給我們去想——這就是抽象的概念。

【為什麼要學這個？】
在實際開發中，我們常常需要扮演「定規則的人」：定義一個類別，要求「所有繼承我的類別都要會做某件事」，但具體怎麼做不用我們操心。抽象類別就是讓我們優雅地「定規則、不做事」的工具。

【學習目標】
學完這一章，我們就能設計出有架構感的程式，像個小小架構師一樣，幫團隊定下規範，讓子類別各自去填補細節。
-->
---
layout: default
---

# Outline

- **抽象類別 (Abstract Class)**
- **抽象方法 (Abstract Method)**
- **觀念整理**
- **進階應用** — 建構方法、Upcasting
- **抽象類別 vs 介面**
- **實作練習**

<!--
【帶讀大綱】
大綱在這裡：我們會先從「什麼是抽象類別」開始，再看連大括號都沒有的「抽象方法」。接著聊聊它和「介面」之間的差異，最後一起動手做兩個練習。

【重點預告】
特別提醒一下，「抽象類別 vs 介面」是很多人剛學 Java 時容易搞混的地方，也是面試常見的題目，這一章我們會把這個概念講清楚。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象類別

<!--
【段落轉換】
接下來，讓我們把「抽象」這個聽起來有點虛無的概念具象化，來看看 Abstract Class 到底是什麼。
-->
---
layout: default
---

# 什麼是抽象類別

- 使用關鍵字 `abstract` 宣告的類別稱為**抽象類別**
- 抽象觀念主要是**隱藏工作細節**，使用者只需知道如何使用
  - 例如 `+` 符號可以執行數值加法，也可以執行字串相加
  - 但不需要知道內部程式如何設計 `+` 號的功能
- 這個類別中可以有**抽象方法**（abstract method）和**實體方法**（method）

<!--
【重點解說】
看到 `abstract` 這個關鍵字，我們就可以把它想成「這裡只負責定義規則，不負責動手做」。

【生活化比喻】
抽象類別有點像百貨公司的「櫃位招租計畫」：百貨公司（抽象類別）規定這個位置一定要賣吃的（定義方法），但具體是賣拉麵還是炸雞，由進駐廠商（子類別）自己決定。

又像我們平常用遙控器轉台，我們只需要知道按鈕在哪裡，不需要知道電視內部怎麼接收訊號——抽象類別就是幫我們把這些內部細節藏起來。

【業界實務】
這種「先定規則、細節留給實作端」的設計方式，在許多框架的核心類別裡都能看到，目的是讓程式之間的關係更有彈性。
-->
---

# 使用抽象類別的場合

- 有一個 `Shape` 類別包含計算繪製外型的 `draw()` 方法
  - `Circle` 和 `Rectangle` 繼承 `Shape`，各自重新定義外型繪製
- `Shape` 的存在讓整個程式定義更加完整，**本身不處理任何工作**
  - 真正的工作交由子類別完成
  - 這就是一個適合使用**抽象類別**（abstract class）的場合

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>核心概念：</b> 抽象類別是「模板」，子類別依照各自情境對此模板擴展和建構。
</div>

<!--
【情境切入】
想像我們在寫一套繪圖軟體：如果直接定義一個 `Shape` 類別，我們其實不知道要怎麼畫它，因為「形狀」這個詞本身太抽象了，沒有具體的畫法。

【重點解說】
但如果我們定義 `Shape` 並規定「只要是形狀都要會 `draw()`」，那麼 `Circle` 就可以畫圓形、`Rectangle` 就可以畫矩形。`Shape` 就像是一份「家族規範」——它自己不做事，只負責規定子類別一定要做什麼。

【業界實務】
在許多框架裡，只要看到類別名稱開頭是 `Abstract`，通常就是框架設計者留給我們的「填空題」：規則已經訂好，細節由我們補上。
-->
---

# 抽象類別語法

- 在定義類別名稱的 `class` 左邊加上 `abstract` 關鍵字

```java
abstract class Shape {
    // 類別內容
}
```

- 抽象類別定義的方法（實際執行的部分）交由子類別重新定義
- 可以把抽象類別想成是一個**模板**，子類別依照各自情境擴展和建構

<!--
【範例目的】
這個範例示範抽象類別最基本的宣告語法。

【帶讀關鍵行】
語法很直覺：就是在 `class` 前面加上 `abstract`。可以把它想成在類別貼上一張「未完工」的標籤。

⚠️ 易錯點提醒：
雖然標示「未完工」，但抽象類別裡面還是可以放已經寫好的一般方法，這點和下一章會學到的介面（Interface）不太一樣。
-->
---

# 抽象類別不能實例化

- 抽象類別**不能使用 `new` 建立物件**（不能實例化）
- 繼承（實作）的子類別可以實例化

```java
abstract class Shape {
    public void draw() { }
}
// Shape shape = new Shape(); // 編譯錯誤！
Circle circle = new Circle(); // 子類別可以
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>錯誤訊息：</b> 'Shape' is abstract; cannot be instantiated
</div>

<!--
【重點解說】
這點非常重要：如果我們對抽象類別下 `new`，Java 會直接給我們一個編譯錯誤。

【生活化比喻】
這就像我們去餐廳，不能跟服務生說「給我一份食物」，服務生一定會問「你要什麼食物？」，因為「食物」是抽象的概念，我們只能點具體的「排骨飯」或「牛肉麵」。抽象類別就是那個點不到的「食物」。

【帶讀關鍵行】
`new Shape()` 這行會編譯失敗，因為 `Shape` 只是一個概念；而 `new Circle()` 沒問題，因為 `Circle` 是具體的子類別。

⚠️ 易錯點提醒：
看到錯誤訊息 `'Shape' is abstract; cannot be instantiated` 時，代表我們不小心對抽象類別下了 `new`，檢查一下是不是該換成具體的子類別。
-->
---

# 抽象類別實作 — 骨架定義

- 繪製框架（`Shape`）：抽象類別，定義 `draw()` 方法骨架
- 各自實作（`Circle`、`Square`）：子類別各自 override `draw()`

```java
abstract class Shape {
    public void draw() { }        // 純定義，無實作內容
}
class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("繪製圓形！");
    }
}
```

<!--
【範例目的】
這個範例示範用「空實作」的方式定義骨架方法。

【帶讀關鍵行】
`Shape` 裡的 `draw()` 有大括號 `{}`，但裡面什麼都沒寫，這就是「空實作」。`Circle` 繼承後再把實際的繪製內容補上。

⚠️ 易錯點提醒：
這樣寫雖然可以動，但無法「強制」子類別一定要實作 `draw()`。如果 `Circle` 忘了覆寫，它會直接執行父類別那個「什麼都不做」的版本，往往不是我們想要的結果——這也是為什麼我們接下來要學「抽象方法」。
-->
---

# 抽象類別實作 — 子類別範例

```java
class Square extends Shape {
    @Override
    public void draw() {
        System.out.println("繪製矩形！");
    }
}
// 使用方式：
// Circle cir = new Circle();  cir.draw();  → 繪製圓形！
// Square squ = new Square();  squ.draw();  → 繪製矩形！
```

<!--
【範例目的】
這個範例補上 `Square` 子類別，讓我們看到兩個子類別各自實作 `draw()` 的結果。

【帶讀關鍵行】
`Circle` 和 `Square` 都遵守 `Shape` 的規範，各自完成了自己的 `draw()`。

【預期結果】
```
cir.draw();  → 繪製圓形！
squ.draw();  → 繪製矩形！
```

【業界實務】
這就是多型的基礎：之後我們可以用一個 `Shape` 型態的容器同時裝圓形和方形，跑一個迴圈，每個物件就會自動執行自己的 `draw()`，不用一個個判斷型態。
-->
---
layout: default
---

# 🎬 AI 協作時刻：換成你的興趣重新理解

還在覺得抽象類別很抽象？把它丟給 AI，用你自己熟悉的場景換一個例子：

**要用的 Prompt：**

> 我還不太理解 Java 的「抽象類別」是什麼、為什麼需要它。
> 請用「{你熟悉的場景，例如：點餐、打電動、租房子}」舉一個例子解釋，
> 100 字以內，不要用程式碼，只能用生活化比喻。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個 prompt 你可以帶回家用：</b> 每次遇到聽不懂的概念，換成自己熟悉的場景讓 AI 重講一次，理解速度會快很多。
</div>

<!--
【操作提示】
可以請幾位同學分享自己選的場景與 AI 給出的比喻，比較看看哪個例子講得最清楚。

【收斂一句話】
不管換成什麼場景，核心都一樣：抽象類別負責「定規則」，子類別負責「動手做」。
-->
---
layout: default
---

# 練習 1：設計 Notification 抽象類別
### 任務說明

設計一套抽象類別，模擬「發送通知」的情境：
1. 建立抽象類別 `Notification`，內含一個方法 `void send()`（先用「空實作」`{}`，裡面不寫任何內容）
2. 建立子類別 `EmailNotification extends Notification`，`override` `send()`，印出 `"以 Email 發送通知"`
3. 建立子類別 `SmsNotification extends Notification`，`override` `send()`，印出 `"以 SMS 發送通知"`
4. 在 `main()` 中分別建立兩個子類別物件並呼叫 `send()`；接著嘗試 `new Notification()`，觀察會發生什麼事

**預期輸出：**
```
以 Email 發送通知
以 SMS 發送通知
```

<!--
【任務鋪陳】
這一節學到抽象類別不能用 `new` 建立物件，也學到用「空實作」`{}` 定義骨架方法的寫法。這個練習就是讓我們親手寫一次，並實際感受 `new Notification()` 會出現什麼錯誤訊息。

【引導思考】
想一想：`Notification` 裡的 `send()` 寫成空的 `{}`，跟完全不寫這個方法，有什麼不同？子類別一定要 `override` 它嗎？

【等待與觀察】
給大家 5 分鐘。提示：先把兩個子類別寫好並測試輸出，最後再嘗試 `new Notification()`，看看編譯器的錯誤訊息怎麼寫。
-->
---
layout: default
---

# 練習 1：設計 Notification 抽象類別
### 解題提示

1. `Notification` 宣告為 `abstract class`，`send()` 用空大括號 `{}`
2. 兩個子類別各自 `override` `send()`，印出不同的訊息
3. `new Notification()` 會出現 `'Notification' is abstract; cannot be instantiated` 編譯錯誤

```java
abstract class Notification {
    public void send() { } // 空實作骨架
}
class EmailNotification extends Notification {
    @Override
    public void send() { System.out.println("以 Email 發送通知"); }
}
class SmsNotification extends Notification {
    @Override
    public void send() { System.out.println("以 SMS 發送通知"); }
}
```

```java
Notification n1 = new EmailNotification();
Notification n2 = new SmsNotification();
n1.send(); // 以 Email 發送通知
n2.send(); // 以 SMS 發送通知
// Notification n3 = new Notification(); // 編譯錯誤！
```

<!--
【帶讀解法】
重點在於：`Notification` 雖然定義了 `send()`，但因為自己是 `abstract class`，沒辦法用 `new` 建立物件，只能透過子類別 `EmailNotification`、`SmsNotification` 來實際使用。

⚠️ 小提醒：
這裡的 `send() {}` 是「空實作」，如果 `EmailNotification` 忘記 `override`，程式仍能編譯通過，但執行 `n1.send()` 時什麼都不會發生——這正是下一節「抽象方法」要解決的問題：用 `abstract void send();` 強制子類別一定要實作。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象方法

<!--
【段落轉換】
剛才用「空實作」來定義骨架，其實不太可靠。接下來我們來看更明確的做法：抽象方法。
-->
---
layout: default
---

# 抽象方法的特性

| 特性 | 說明 |
| --- | --- |
| 沒有實體內容 | 無方法主體（no body） |
| 宣告以 `;` 結尾 | 不使用 `{}` 大括號 |
| 必須被子類別 override | 子類別**必須**重新定義，否則編譯錯誤 |
| 類別需宣告為 abstract | 含抽象方法的類別必須是抽象類別 |

<!--
【重點解說】
抽象方法有幾個明確的規則：沒有方法主體（沒有大括號）、以分號結尾、子類別「必須」覆寫，否則編譯錯誤，而且只有抽象類別才能宣告抽象方法。

【生活化比喻】
這有點像我們和建築商簽合約，合約上寫「這裡要蓋一間廁所」，後面直接接句號——我們不需要教他怎麼拉水管，但他如果沒蓋，合約就算違約。

【業界實務】
這種「先定規格、強制實作」的做法，常用在框架或團隊共用的核心類別上，確保每個子類別都不會漏掉關鍵功能。
-->
---

# 抽象方法的特性 — 範例

```java
abstract class Shape {
    public abstract void draw(); // 抽象方法（以 ; 結尾）
}
class Circle extends Shape {
    @Override
    public void draw() {         // 子類別重新定義
        System.out.println("繪製圓形！");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 子類別重新定義時，回傳值型態與參數個數、型態需與抽象方法一致，並建議加上 <code>@Override</code>。
</div>

<!--
【範例目的】
這個範例示範抽象方法的正確宣告方式，以及子類別如何覆寫它。

【帶讀關鍵行】
`public abstract void draw();` 連大括號都省了，直接用分號結尾——這代表「我不管你怎麼畫，但你一定要實作出來」。`Circle` 覆寫時補上 `@Override` 與實際內容。

⚠️ 易錯點提醒：
`abstract` 和 `{}` 不能同時出現，有 `abstract` 就不能寫方法主體。覆寫時記得回傳值型態與參數要與抽象方法一致，並建議加上 `@Override`。
-->
---

# 子類別未重新定義抽象方法

- 若子類別**沒有重新定義抽象方法**，編譯時會出現錯誤
- 解法：將子類別也宣告為抽象類別，延遲到孫類別實作

```java
abstract class Car {
    abstract void run();     // 抽象方法
}
class Bmw extends Car {
    // 未 override run() → 編譯錯誤！
    // Class 'Bmw' must implement abstract method 'run()' in 'Car'
}
```

<!--
【情境切入】
如果 `Bmw` 繼承了 `Car`，但完全沒有實作 `run()`，會發生什麼事？

【範例目的】
這個範例示範子類別沒有覆寫抽象方法時，編譯器會怎麼提醒我們。

【帶讀關鍵行】
看到 `Class 'Bmw' must implement abstract method 'run()' in 'Car'` 這個錯誤訊息時，代表「債還沒還清」——`Car` 規定的義務，`Bmw` 還沒履行。

【解法】
如果暫時不想在 `Bmw` 裡實作，可以把 `Bmw` 也宣告為 `abstract`，把這個義務延到 `Bmw` 的子類別去實作，這個做法叫「延遲實作」。
-->
---
layout: default
---

# 🎬 AI 協作時刻：編譯器說我沒實作，到底哪裡沒做？

忘記實作抽象方法時，編譯器會丟出一串看起來很兇的錯誤訊息，直接把錯誤訊息貼給 AI：

**要用的 Prompt：**

> 我的程式碼編譯出現這個錯誤：
> `Class 'XXX' must implement abstract method 'YYY()' in 'ZZZ'`
> 這是我的類別程式碼：
> `{貼上你的抽象類別和子類別程式碼}`
> 請告訴我為什麼會出現這個錯誤，以及有哪些修正方式。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> 這個錯誤代表子類別「欠了一筆債」——沒有實作父類別要求的抽象方法。還債方式有兩種：直接補上實作，或把子類別也宣告成 <code>abstract</code>，把債延到下一代。
</div>

<!--
【操作提示】
現場故意寫一個沒有實作 pay() 的子類別，讓它噴出 "must implement abstract method" 錯誤，把錯誤訊息連同程式碼貼給 AI，讓 AI 指出兩種修正方式並解釋差異。

【收斂一句話】
看到「must implement abstract method」不用慌，代表子類別還沒還清父類別要求的義務，補實作或宣告成 abstract 延後即可。
-->
---
layout: default
---

# 練習 2 (實作)：用抽象方法強制實作 pay()
### 任務說明

設計一套抽象類別，練習「抽象方法強制 override」與「延遲實作」：
1. 建立抽象類別 `Payment`，內含抽象方法 `abstract void pay(int amount);`
2. 建立子類別 `CreditCardPayment extends Payment`，`override` `pay(int amount)`，印出 `"信用卡支付 " + amount + " 元"`
3. 建立另一個子類別 `OnlinePayment extends Payment`，**先不要** `override` `pay()`，觀察編譯錯誤訊息；接著把 `OnlinePayment` 也宣告為 `abstract class`，讓編譯通過
4. 在 `main()` 中只測試 `CreditCardPayment`，呼叫 `pay(1000)`

**預期輸出：**
```
信用卡支付 1000 元
```

<!--
【任務鋪陳】
這一節學到抽象方法「子類別必須 override，否則編譯錯誤」，以及「延遲實作」的解法——把子類別也宣告成 `abstract`。這個練習就是讓我們親手製造一次這個編譯錯誤，再用兩種方式修正它。

【引導思考】
想一想：`OnlinePayment` 如果不想實作 `pay()`，有哪兩種解法？一種是補上實作，另一種呢？這兩種解法分別適合什麼情境？

【等待與觀察】
給大家 5 分鐘。提示：先寫 `CreditCardPayment` 確認可以正常運作，再嘗試 `OnlinePayment`，故意不寫 `pay()`，看看錯誤訊息怎麼描述。
-->
---
layout: default
---

# 練習 2 (實作)：用抽象方法強制實作 pay()
### 解題提示

1. `Payment` 宣告 `abstract void pay(int amount);`（無方法主體，以 `;` 結尾）
2. `CreditCardPayment` 必須 `override` `pay()`，否則編譯錯誤
3. `OnlinePayment` 若不想實作，加上 `abstract` 修飾整個類別即可編譯通過

```java
abstract class Payment {
    abstract void pay(int amount);
}
class CreditCardPayment extends Payment {
    @Override
    void pay(int amount) {
        System.out.println("信用卡支付 " + amount + " 元");
    }
}
// 解法一：補上實作
// class OnlinePayment extends Payment {
//     @Override
//     void pay(int amount) { System.out.println("線上支付 " + amount + " 元"); }
// }
// 解法二：延遲實作，類別也宣告為 abstract
abstract class OnlinePayment extends Payment {
    // pay() 留給 OnlinePayment 的子類別實作
}
```

<!--
【帶讀解法】
重點在於：`OnlinePayment extends Payment` 但沒有實作 `pay()`，編譯器會出現 `Class 'OnlinePayment' must implement abstract method 'pay(int)' in 'Payment'`——這就是「債還沒還清」的提醒。

解法一是直接補上實作（像 `CreditCardPayment` 一樣）；解法二是把 `OnlinePayment` 也宣告為 `abstract class`，把這筆「債」遞延給 `OnlinePayment` 未來的子類別。兩種解法都合法，選哪一種取決於：這個類別現在「準備好實作」了沒有。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 觀念整理

<!--
【段落轉換】
講了這麼多規則，我們花一點時間整理一下，免得大家被 `abstract` 搞得頭昏。
-->
---
layout: default
---

# 抽象類別與抽象方法 — 重要規則

| 規則 | 說明 |
| --- | --- |
| 抽象類別無法實例化 | 必須透過子類別建立物件 |
| 含抽象方法 → 必須宣告為 `abstract class` | 普通類別中不存在抽象方法 |
| 子類別必須 Override 所有抽象方法 | 否則子類別也必須宣告為 `abstract` |
| 抽象類別不一定要有抽象方法 | 可以只包含普通方法 |
| 抽象類別可以混用兩種方法 | 抽象方法 + 普通方法皆可存在 |

<!--
【重點解說】
這張表整理了抽象類別與抽象方法的重要規則，特別注意最後兩條：抽象類別不一定要有抽象方法，可以只放普通方法。

【互動引導】
我們可以想一想：一個完全沒有抽象方法的抽象類別，有什麼用途？答案是——單純用來當作父類別，強迫別人一定要繼承才能使用它。
-->
---

# 抽象類別可以有兩種方法

- 抽象類別內**可以同時有**抽象方法和普通方法

```java
abstract class Car {
    abstract void run();      // 抽象方法
    void refuel() {           // 普通方法
        System.out.println("汽車加油");
    }
}
```

<!--
【範例目的】
這個範例示範抽象類別內同時混用抽象方法與普通方法。

【帶讀關鍵行】
`run()` 宣告為抽象方法，因為每種車輛的行駛方式不同；`refuel()` 是普通方法，因為「補充能量」的邏輯各車型大致相同。

【概念定義】
這就是「求同存異」：把大家共同的部分寫在父類別（`refuel()`），把各自不同的部分留給子類別客製化（`run()`）。
-->
---

# 抽象類別兩種方法 — 子類別使用

```java
class Bmw extends Car {
    @Override
    public void run() {
        System.out.println("安全駕駛中 ...");
    }
}
// Bmw bmw = new Bmw();
// bmw.refuel();  → 汽車加油
// bmw.run();     → 安全駕駛中 ...
```

<!--
【範例目的】
這個範例示範子類別如何同時使用父類別的普通方法，以及自己覆寫的抽象方法。

【帶讀關鍵行】
`Bmw` 只需要實作 `run()`，`refuel()` 則直接繼承自 `Car`，不用重複寫一次。

【預期結果】
```
bmw.refuel();  → 汽車加油
bmw.run();     → 安全駕駛中 ...
```

【業界實務】
這種「共用邏輯寫一次、各自邏輯各自實作」的做法，就是程式碼重用的核心精神，也是我們喜歡用抽象類別的原因之一。
-->
---
layout: default
---

# 練習 3：Employee 抽象類別混用兩種方法
### 任務說明

設計一套抽象類別，練習「抽象方法 + 普通方法混用」：
1. 建立抽象類別 `Employee`，內含：
   - 普通方法 `void clockIn()`，印出 `"打卡上班"`（所有員工都一樣，不需 override）
   - 抽象方法 `abstract void work();`（每種員工的工作內容不同）
2. 建立子類別 `Engineer extends Employee`，`override` `work()`，印出 `"撰寫程式"`
3. 建立子類別 `Designer extends Employee`，`override` `work()`，印出 `"設計畫面"`
4. 在 `main()` 中分別建立 `Engineer` 與 `Designer` 物件，依序呼叫 `clockIn()` 與 `work()`

**預期輸出：**
```
打卡上班
撰寫程式
打卡上班
設計畫面
```

<!--
【任務鋪陳】
這一節學到抽象類別可以「同時擁有」抽象方法和普通方法——共同的部分（打卡）寫一次給大家用，各自不同的部分（工作內容）留給子類別實作。這個練習就是把這個概念套用到「員工」這個更貼近職場的情境。

【引導思考】
想一想：`clockIn()` 為什麼適合宣告成普通方法，而 `work()` 適合宣告成抽象方法？如果反過來，會發生什麼問題？

【等待與觀察】
給大家 5 分鐘。提示：`Engineer` 和 `Designer` 都不需要再寫一次 `clockIn()`，因為它是繼承來的。
-->
---
layout: default
---

# 練習 3：Employee 抽象類別混用兩種方法
### 解題提示

1. `clockIn()` 是普通方法，所有子類別共用同一份實作，不需要 `override`
2. `work()` 是抽象方法，每個子類別都必須 `override`，提供自己的工作內容

```java
abstract class Employee {
    void clockIn() {              // 普通方法，共用邏輯
        System.out.println("打卡上班");
    }
    abstract void work();         // 抽象方法，各自實作
}
class Engineer extends Employee {
    @Override
    void work() { System.out.println("撰寫程式"); }
}
class Designer extends Employee {
    @Override
    void work() { System.out.println("設計畫面"); }
}
```

```java
Employee e1 = new Engineer();
Employee e2 = new Designer();
e1.clockIn(); e1.work(); // 打卡上班 → 撰寫程式
e2.clockIn(); e2.work(); // 打卡上班 → 設計畫面
```

<!--
【帶讀解法】
重點在於：`Engineer` 和 `Designer` 都沒有重新寫 `clockIn()`，因為「打卡」這個動作對所有員工都一樣，寫在 `Employee` 裡讓大家共用就好；但 `work()` 因為每種職務的工作內容不同，所以宣告成抽象方法，強制每個子類別都要交出自己的版本。

💼 業界實務：
這正是「求同存異」的具體應用——團隊裡常見的 `BaseController`、`AbstractService` 這類抽象類別，通常都會把「共用的流程」寫成普通方法，把「各自不同的業務邏輯」設計成抽象方法。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進階應用

<!--
【段落轉換】
接下來要看兩個跟「繼承」結合在一起的概念：抽象類別的建構方法，以及 Upcasting。
-->
---
layout: default
---

# 抽象類別的建構方法

- 設計 Java 程式時，可以將**建構方法**（constructor）或**屬性**（成員變數）的觀念應用在抽象類別
- 子類別建立物件時，會先執行**父類別（抽象類別）的建構方法**

```java
abstract class Car {
    abstract void run();
    Car() {
        System.out.println("有車子了");
    }
    void refuel() {
        System.out.println("汽車加油");
    }
}
```

<!--
【情境切入】
很多人以為「抽象類別不能 `new`，所以沒有建構方法」，但其實不是這樣。

【概念定義】
抽象類別當然可以有建構方法（constructor），只是它不是給外部直接 `new` 用的，而是在子類別被建立時自動被呼叫。

【生活化比喻】
這就像我們買新家（子類別）時，雖然不需要自己打地基（父類別建構方法），但地基一定要先打好，房子才蓋得起來。
-->
---

# 抽象類別的建構方法 — 範例

```java
class Bmw extends Car {
    public void run() {
        System.out.println("安全駕駛中 ...");
    }
}
public static void main(String[] args) {
    Bmw bmw = new Bmw(); // 建立物件時先執行 Car()
    bmw.refuel();
    bmw.run();
}
// 輸出順序：有車子了 → 汽車加油 → 安全駕駛中 ...
```

<!--
【範例目的】
這個範例示範建立子類別物件時，父類別（抽象類別）的建構方法會先被執行。

【帶讀關鍵行】
雖然我們 `new` 的是 `Bmw`，但 `Car` 的建構方法會先執行，所以「有車子了」會最先印出來，這就是繼承的執行順序。

⚠️ 易錯點提醒：
如果父類別沒有無參數建構方法，子類別就要用 `super()` 手動呼叫對應的父類別建構方法，這跟一般繼承的規則完全相同。

【預期結果】
```
有車子了 → 汽車加油 → 安全駕駛中 ...
```
-->

---

# 抽象類別的屬性宣告

| 概念 | 說明 |
| --- | --- |
| `protected` 屬性 | 子類別可直接存取，外部無法存取 |
| `super(參數)` | 子類別透過 `super()` 初始化父類別屬性 |

```java
abstract class Car {
    protected String brand;
    Car(String brand) { this.brand = brand; }
    abstract void run();
}
```

<!--
【帶讀表格】
抽象類別也可以有自己的「私房錢」（屬性）。通常我們用 protected，這意思是：「這是我留給孩子們的，外人別碰。」
-->
---

# 抽象類別屬性 — 子類別使用範例

```java
class Bmw extends Car {
    Bmw() { super("BMW"); }
    @Override
    public void run() {
        System.out.println(brand + " 行駛中");
    }
}
Car bmw = new Bmw();    // Upcasting
bmw.run();              // BMW 行駛中
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 子類別直接使用 <code>brand</code>，無需重複宣告，因為 <code>protected</code> 屬性可由子類別繼承
</div>

<!--
【帶讀程式碼】
這裡展示了 super("BMW") 把品牌名字傳給老爸。然後在 run() 裡面直接拿來用。

💡 注意這行：Car bmw = new Bmw();
這就是 Upcasting。雖然 Car 是抽象的，但它還是可以用來當作變數的型態，去承接它的子類別。這在多形裡是至關重要的概念。
-->
---

# 使用 Upcasting 宣告抽象類別的物件

- 抽象類別**無法實例化**，但可以用 **Upcasting（向上轉型）** 宣告物件
- 用父類別型態接住子類別 `new` 出來的物件

```java
Car bmw = new Bmw();    // Upcasting（合法）
// Car car = new Car(); // 編譯錯誤！
bmw.refuel();
bmw.run();
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見用法：</b> 許多 Java 程式設計師會使用 Upcasting 宣告抽象類別物件，由所宣告物件的參考是子類別，所以可以正常執行工作。
</div>

<!--
【核心說明】
這招叫「指鹿為馬」...不對，是「指 BMW 為車」。

【帶讀程式碼】
雖然我們宣告變數型態是 Car，但實際跑的是 Bmw。這樣做的好處是，以後如果你想把 Bmw 換成 Audi，你的程式碼其他部分幾乎不用動。

💼 業界實務：
老鳥都喜歡寫 Car car = getCar(); 而不是 Bmw car = getBmw();。因為我們追求的是「彈性」，而不是死板板的型別。
-->
---
layout: default
---

# 🎬 AI 協作時刻：Upcasting 之後，我還能呼叫什麼？

抽象類別的建構方法執行順序、以及 Upcasting 之後到底能呼叫哪些方法，是這一節最容易搞混的兩件事，考前讓 AI 幫你出題驗收：

**要用的 Prompt：**

> 請針對「抽象類別的建構方法執行順序」和「Upcasting 之後能呼叫哪些方法」
> 這兩個主題，出 3 題容易猜錯的情境選擇題，
> 先不要公布答案，等我回答後才公布並解釋為什麼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見誤解：</b> <code>Account acc = new SavingsAccount(...)</code> 之後，<code>acc</code> 只能呼叫 <code>Account</code> 宣告過的方法，即使 <code>SavingsAccount</code> 有自己專屬的方法，也不能直接透過 <code>acc</code> 呼叫（除非 Downcasting）。
</div>

<!--
【操作提示】
現場貼上 prompt，讓 AI 出題考驗大家對「父類別建構方法先執行」與「Upcasting 後只能呼叫宣告型態的方法」這兩個規則的理解，答錯的地方回頭對照「抽象類別的建構方法」和「使用 Upcasting 宣告抽象類別的物件」這兩張投影片複習。

【收斂一句話】
建構方法一定父先子後執行；Upcasting 後變數只認得宣告型態的方法，想用回子類別專屬方法要 Downcasting。
-->
---
layout: default
---

# 練習 4：Account 抽象類別的建構方法與 Upcasting
### 任務說明

設計一套抽象類別，練習「抽象類別的建構方法、`protected` 屬性與 Upcasting」：
1. 建立抽象類別 `Account`，內含：
   - `protected String owner`，建構方法 `Account(String owner)` 接收參數並印出 `"開戶完成"`
   - 抽象方法 `abstract void showType();`
2. 建立子類別 `SavingsAccount extends Account`：
   - 建構方法呼叫 `super(owner)`
   - `override` `showType()`，印出 `owner + " 的帳戶類型：活存"`
3. 在 `main()` 中：
   - 用 `Account acc = new SavingsAccount("古古");`（Upcasting）建立物件
   - 呼叫 `acc.showType()`
   - 觀察建構方法的執行順序

**預期輸出：**
```
開戶完成
古古 的帳戶類型：活存
```

<!--
【任務鋪陳】
這一節學到抽象類別也可以有建構方法和 `protected` 屬性，而且可以用 Upcasting 宣告物件。這個練習就是把這幾個概念整合到一個更貼近生活的「帳戶」情境。

【引導思考】
想一想：`SavingsAccount` 的建構方法第一行要寫什麼？`Account acc = new SavingsAccount("古古")` 這一行，`acc` 能呼叫 `Account` 裡所有的方法嗎？

【等待與觀察】
給大家 6 分鐘。提示：`Account` 不能 `new`，但它的建構方法仍然會在 `new SavingsAccount(...)` 時被呼叫。
-->
---
layout: default
---

# 練習 4：Account 抽象類別的建構方法與 Upcasting
### 解題提示

1. `Account` 的建構方法接收 `owner`，存入 `protected` 屬性，並印出 `"開戶完成"`
2. `SavingsAccount` 建構方法第一行 `super(owner)`
3. `Account acc = new SavingsAccount("古古")` 是合法的 Upcasting，因為 `Account` 本身雖不能 `new`，但可以當作變數型態

```java
abstract class Account {
    protected String owner;
    Account(String owner) {
        this.owner = owner;
        System.out.println("開戶完成");
    }
    abstract void showType();
}
class SavingsAccount extends Account {
    SavingsAccount(String owner) {
        super(owner);
    }
    @Override
    void showType() {
        System.out.println(owner + " 的帳戶類型：活存");
    }
}
```

```java
Account acc = new SavingsAccount("古古"); // Upcasting，先印出「開戶完成」
acc.showType(); // 古古 的帳戶類型：活存
```

<!--
【帶讀解法】
重點有兩個：第一，`new SavingsAccount("古古")` 執行時，會先呼叫 `Account` 的建構方法（印出「開戶完成」），再執行 `SavingsAccount` 自己的建構方法；第二，`Account acc = ...` 是 Upcasting——雖然 `Account` 不能直接 `new`，但完全可以當作變數的宣告型態。

💼 業界實務：
這種「父類別管共用初始化、子類別補上細節」的設計，在企業系統的帳戶、訂單等模組裡很常見，例如所有帳戶開戶都要做的「建檔、發送通知」邏輯放在父類別，各帳戶類型自己的規則放在子類別。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象類別 vs 介面

<!--
【段落轉換】
現在我們來解決那個讓無數學生想撞牆的問題：抽象類別跟介面到底差在哪？
-->
---
layout: default
---

# 抽象類別與介面的比較

| 比較項目 | 抽象類別 Abstract Class | 介面 Interface |
| --- | --- | --- |
| 父類別/父介面繼承 | 只能繼承一個類別 | 能繼承多個介面（Java 實現多重繼承） |
| 子類別繼承/實作 | `extends` 一個抽象類別 | `implements` 多個介面 |
| 方法 | 可包含非抽象方法 | 只能是抽象方法（Java 8 以前） |
| 必定為 | 父類別 | 可視為抽象類別的特例 |

<!--
【帶讀表格】
這裡有一份清單。最簡單的記法：
抽象類別是「出生（IS-A）」，你只能有一個老爸。
介面是「證照（CAN-DO）」，你可以考一堆證照。

⚠️ 現代 Java 的模糊地帶：
Java 8 之後介面也能寫 default 方法了，這讓兩者的界線變得很模糊。但記住，抽象類別還是能存「狀態（變數）」，而介面不行。
-->
---

# 介面的演進 (Java 8+)

Java 8 起，介面支援 `default` 與 `static` 方法（Java 9 加入 `private`），與抽象類別的差異縮小。但介面仍**無法儲存狀態**（無實例欄位），需要共用屬性時仍應使用抽象類別。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 介面 <code>default</code>、<code>static</code>、<code>private</code> 方法的詳細用法，將在 Ch 19 介紹。
</div>

<!--
【核心說明】
別被 Java 8 給騙了，介面變強了沒錯，但它依然不是類別。

【核心概念】
介面就像是「外掛」，你可以掛一堆。而抽象類別是你的「核心」，你只能有一個。如果你需要存一些變數（例如：年齡、姓名），你還是得乖乖用抽象類別。

💡 下一章我們會專門講介面，現在先別糾結，先把抽象類別搞定。
-->
---

# 抽象類別與介面 — 相同點與應用

**相同點：**
- 兩者都**無法直接實體化**
- 子類別都必須實作已宣告之抽象方法（或繼續抽象）

**應用場景比較：**
- **抽象類別**：關係密切的類別中，如定義抽象類別 `Car`，子類別 `Benz` 及 `Audi` 繼承 `Car`
- **介面**：定義一些功能給不相干類別使用，如定義介面 `Fly`，子類別 `AirPlane` 及 `Bird` 實作 `Fly`

<!--
【帶讀說明】
這是一個很好的準則：
如果是「親兄弟」，大家都有同樣的基因（Car）→ 用抽象類別。
如果是「跨界合作」，一個是鳥一個是飛機，大家都想飛（Fly）→ 用介面。

💼 業界實務：
如果你看到有人用繼承來實作「飛行能力」，導致飛機繼承了鳥類，那這程式碼基本上已經沒救了。
-->
---
layout: default
---

# 🎬 AI 協作時刻：抽象類別 vs 介面 面試題驗收

「抽象類別跟介面差在哪」幾乎是每一場 Java 面試都會被問到的題目，考前讓 AI 幫你出題：

**要用的 Prompt：**

> 根據「抽象類別 vs 介面」的觀念（IS-A vs CAN-DO、
> 能不能存狀態、單一繼承 vs 多重實作），
> 出 3 題情境選擇題，難度由淺到深。
> 一次只出一題，等我回答後才公布答案，
> 答錯時不要直接講答案，先給一個提示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>帶回家用：</b> 面試官很愛問「什麼時候該用抽象類別、什麼時候該用介面」，練到能立刻舉出情境例子，是加分關鍵。
</div>

<!--
【操作提示】
可以先讓大家自己跟 AI 對答，接著再一起做下一頁的認證模擬題，互相驗證兩種練習方式的效果。

【收斂一句話】
親兄弟關係（IS-A）用抽象類別，跨界共同能力（CAN-DO）用介面。
-->
---
layout: default
---

# 練習 5：抽象類別 vs 介面 的選擇
### 認證模擬題（單選）

我們要設計以下系統：`Dog`、`Cat`、`Robot` 三個類別都需要具備「叫聲」（`makeSound()`）的能力，而 `Dog` 和 `Cat` 還共享大量「動物」的共同屬性（如 `name`、`age`）與共同行為（如 `eat()`）；`Robot` 則完全不是動物，但也需要能「叫」。

下列設計方式，哪一個**最合適**？

A. 設計 `abstract class Animal`（含 `name`、`age`、`eat()`），`Dog`、`Cat extends Animal`；另外設計 `interface Soundable`（含 `makeSound()`），讓 `Dog`、`Cat`、`Robot` 都 `implements Soundable`
B. 設計 `abstract class Animal`，讓 `Dog`、`Cat`、`Robot` 都 `extends Animal`，並在 `Animal` 中宣告 `abstract void makeSound();`
C. 設計 `interface Animal`（含 `name`、`age`、`eat()`、`makeSound()`），讓 `Dog`、`Cat`、`Robot` 都 `implements Animal`
D. 分別在 `Dog`、`Cat`、`Robot` 中各自定義 `makeSound()`，不使用抽象類別或介面

<!--
【出題動機】
這題想測驗「抽象類別 vs 介面」的應用場景判斷——這是 OCA/OCP 常見的設計題型，也是實務上設計類別架構時最常遇到的抉擇。

【解題引導】
提示：先想想 `Robot` 跟 `Dog`、`Cat` 之間是不是「親兄弟」關係（IS-A，有沒有共同的 `name`、`age`、`eat()`）？「叫聲」這個能力，是不是「跨界合作」（CAN-DO）比較合適？另外，介面能不能存放 `name`、`age` 這種「狀態」？
-->
---
layout: default
---

# 練習 5：抽象類別 vs 介面 的選擇
### 解析

**正確答案：A**

- A. ✅ `Dog`、`Cat` 是「親兄弟」關係，共享 `name`、`age`、`eat()`，適合用 `abstract class Animal`；`makeSound()` 是跨越「動物」與「機器人」的「跨界能力」，適合用 `interface Soundable`
- B. ❌ `Robot` 不是動物，卻被迫繼承 `Animal` 並擁有 `name`、`age`、`eat()` 這些不合理的屬性與行為，語意上不正確
- C. ❌ `interface` 無法儲存 `name`、`age` 這種實例狀態（沒有實例欄位），`Dog`、`Cat` 之間的共用屬性會變成每個類別都要重複宣告
- D. ❌ 完全不使用抽象類別或介面，會讓 `Dog`、`Cat`、`Robot` 之間沒有任何共同型態，無法用多形統一處理，也無法強制每個類別都實作 `makeSound()`

<!--
【帶讀解法】
這題的關鍵在於分辨兩種關係：`Dog` 和 `Cat` 是 IS-A 關係（牠們都「是」一種 `Animal`，有共同的狀態與行為），適合用抽象類別；而「會叫」這個能力，`Robot` 也需要，但 `Robot` 顯然不是動物，這種「跨類別的共同能力」就是 CAN-DO 關係，適合用介面。

💼 業界實務：
實務上常見「抽象類別 + 介面」混合使用：抽象類別負責「血緣相近的共用狀態與邏輯」，介面負責「跨血緣的共同能力」。這也是為什麼 Java 允許一個類別同時 `extends` 一個抽象類別、又 `implements` 多個介面。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
好了，嘴砲時間結束，大家動動手吧！沒寫過程式碼的人是不配談架構的。
-->
---
layout: default
---

# 練習 6：Shape 面積與周長
### 任務說明

請設計一個**抽象類別 `Shape`**，包含計算面積（`area()`）和周長（`perimeter()`）的抽象方法，再設計 `Rectangle` 和 `Circle` 兩個子類別分別實作。

**預期輸出：**
```
矩形面積：6.0
矩形周長：10.0
圓面積：12.566370614359172
圓周長：12.566370614359172
```

<!--
【出題前的鋪陳】
練習 1：形狀大師。這題如果你寫不出來，那你剛才那半小時可能是在冥想而不是在聽課。

【問題引導】
Shape 類別要怎麼寫？那兩個計算的方法要加什麼關鍵字？Circle 裡面要存什麼？（小提示：半徑）。

【等待與觀察】
大家寫的時候注意括號跟分號。如果你被編譯器噴了，記得回頭看看投影片。
-->
---

# 練習 6：解題提示
### 提示說明

1. 在 `Shape` 中宣告 `abstract double area();` 與 `abstract double perimeter();`
2. `Rectangle` 需 `height`、`width` 屬性，透過建構方法傳入（高 2，寬 3）
3. `Circle` 需 `r`（半徑）屬性，透過建構方法傳入（半徑 2）
4. 計算公式：
   - 矩形面積 = `height * width`，周長 = `2 * (height + width)`
   - 圓面積 = `Math.PI * r * r`，圓周長 = `2 * Math.PI * r`

<!--
【帶讀解法】
解法在這裡。注意 area() 和 perimeter() 都要宣告成 abstract。

⚠️ 小細節：
記得用 double，不然你的圓面積可能會變成一個整數，然後你的數學老師就會想跟你談談。還有，Math.PI 是你的好朋友。
-->
---

# 練習 7：抽象數學計算器
### 任務說明

請設計一個**抽象類別 `MyMath`**，包含 `add()` 與 `mul()` 兩個帶參數的抽象方法，以及一個普通方法 `output()` 印出「我的計算器」。設計子類別 `MyTest` 重新定義這兩個抽象方法。

**預期輸出：**
```
我的計算器
加法結果：11
乘法結果：24
```

<!--
【出題前的鋪陳】
練習 2：我的計算器。這題是考你有沒有弄懂「混用方法」。

【問題引導】
output() 是普通方法喔，不要手癢去加 abstract。add() 跟 mul() 才是要讓子類別去頭大的。
-->
---

# 練習 7：解題提示
### 提示說明

1. 在 `MyMath` 中宣告 `abstract int add(int n1, int n2);` 與 `abstract int mul(int n1, int n2);`
2. 普通方法 `void output()` 直接印出「我的計算器」，不需 override
3. 在 `MyTest` 中實作：`add()` 回傳 `n1 + n2`，`mul()` 回傳 `n1 * n2`
4. 在 `main` 中使用 Upcasting：`MyMath obj = new MyTest();`
5. 呼叫 `obj.output()`、`obj.add(3, 8)`、`obj.mul(3, 8)`

<!--
【帶讀解法】
重點在那行 MyMath obj = new MyTest()。這就是 Upcasting。雖然 obj 被宣告為 MyMath，但它執行的是 MyTest 裡的加法跟乘法。這就是多形的力量！
-->
---

# 總結

- **抽象類別用 `abstract` 宣告，不能 `new`** — 必須透過子類別建立物件，是定義規則的「模板」
- **抽象方法沒有方法主體，以 `;` 結尾** — 子類別必須 override，否則編譯錯誤（除非子類別也宣告為 `abstract`）
- **抽象類別可以混用抽象方法與普通方法** — 共同邏輯寫成普通方法讓子類別共用，各自不同的邏輯才宣告成抽象方法
- **抽象類別可以有建構方法與 `protected` 屬性** — 子類別建立物件時會先執行父類別的建構方法
- **Upcasting 讓抽象類別可以當作變數型態**，接住子類別 `new` 出來的物件，是多型的基礎
- **抽象類別 vs 介面：IS-A 用抽象類別，CAN-DO 用介面** — 抽象類別可以存狀態（成員變數），介面（Java 8 以前）不行

<!--
我們把這一章整理成六個重點。

第一，抽象類別用 abstract 宣告，不能直接 new 建立物件，只能透過子類別；它本質上是一個「模板」，負責定規則。

第二，抽象方法沒有方法主體，直接用分號結尾；子類別繼承後一定要 override，不然編譯會直接報錯，除非把子類別也宣告成抽象類別，把這個義務延後給孫類別。

第三，抽象類別裡可以同時有抽象方法和普通方法——共同的邏輯寫成普通方法讓大家共用一份，各自不同的部分才寫成抽象方法交給子類別實作，這就是「求同存異」。

第四，抽象類別也可以有建構方法和 protected 屬性，子類別建立物件時，父類別的建構方法會先被自動呼叫。

第五，雖然抽象類別不能 new，但可以用來當作變數的宣告型態，去接住子類別 new 出來的物件，這就是 Upcasting，也是之後多型的重要基礎。

第六，抽象類別跟介面最關鍵的分辨方式：親兄弟關係（IS-A、有共同狀態）用抽象類別，跨界合作的共同能力（CAN-DO）用介面；抽象類別能存成員變數，介面在 Java 8 以前不行。

這六點加起來，就是抽象類別的完整概念。下一章我們要正式進入介面了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天我們從「出一張嘴」的抽象類別，講到「制定規矩」的抽象方法，最後還學會了老鳥專用的「模板模式」。

【核心帶走重點】
1. 抽象類別不能 new。
2. 抽象方法沒有大括號。
3. 繼承抽象類別，要嘛還債（實作），要嘛繼續欠（宣告抽象）。
4. 模板模式讓你寫出有架構感的程式碼。

有問題嗎？沒問題的話我們就下課，回去好好抽象一下。
-->
---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[依脈絡推斷]
下課！記住：定義骨架、交由子類別實作——這就是抽象類別的精髓。如果你沒聽懂，那你一定是太「抽象」了。我們下一章「介面」見！
-->
