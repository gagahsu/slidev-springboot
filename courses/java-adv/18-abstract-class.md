---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 抽象類別 (Abstract Class)（進階／自學）
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
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到抽象類別的進階自學篇！基礎版我們已經學會了抽象類別的基本玩法，這裡要再加碼兩個業界常用的進階技巧。

【為什麼要學這個？】
想像我們寫的程式越來越大，團隊裡的人越來越多，這時候光靠「大家自己注意」是不夠的，我們需要更明確的規則和流程來避免混亂。這正是這份自學內容要解決的問題。

【學習目標】
學完這份內容後，我們就能用 Template Method（模板方法）設計模式把固定流程「鎖死」，再用 Sealed Class 把繼承關係「圈起來」，寫出更有架構感、更不容易被誤用的程式碼。
-->
---
layout: default
---

# Outline

- **Sealed 抽象類別** — `sealed` + `permits`、子類別修飾詞
- **Template Method 設計模式** — 固定流程骨架、子類別客製細節
- **實作練習**

<!--
【帶讀大綱】
這份自學內容只有兩個主題：第一個是「密封抽象類別」，讓我們可以精確控制誰能繼承我們的類別；第二個是「Template Method 設計模式」，讓我們學會用抽象類別寫出有架構的流程。

【重點預告】
這兩個主題雖然不是寫出基本程式的必要條件，但在中大型專案或框架設計裡非常常見，學會之後會讓我們的程式碼看起來更專業。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Sealed 抽象類別

<!--
【段落轉換】
我們先來看第一個進階主題：如何替抽象類別的繼承關係「上鎖」。
-->
---
layout: default
---

# 密封抽象類別 (Sealed Abstract Class)

Java 17 起，`sealed` 可搭配 `abstract` 一起使用，**精確限制**哪些類別可以繼承該抽象類別：

| 關鍵字 | 說明 |
| --- | --- |
| `sealed` | 宣告該類別為密封類別 |
| `permits` | 指定允許繼承的子類別清單 |

```java
// 限制只有 Circle 和 Square 可以繼承 Shape
public abstract sealed class Shape permits Circle, Square {
    public abstract double area();
}
```

<!--
【情境切入】
想像我們設計了一個 Shape 抽象類別，原本任何人都可以寫一個新的類別來 `extends` 它。但如果這是一個重要的核心類別，我們其實希望「繼承名單」是可控的，不要讓人隨便加入奇怪的子類別。

【概念定義】
這時候就可以用 `sealed`：「這個類別只允許特定幾個子類別繼承，名單我說了算」。`permits` 後面列出的，就是唯一被授權繼承的類別。

【生活化比喻】
這就像社區大樓的門禁系統（sealed class），管理員（permits）手上有一份「核准住戶名單」，名單上的人才能刷卡進來，名單外的人，刷卡機直接不給過。

💼 業界實務：
如果我們在開發一套金融系統，可能只想讓「信用卡」和「轉帳」繼承「支付方式」，避免有人莫名其妙寫出一個「神秘支付」類別搞亂整個架構，這時 sealed 就非常實用。
-->
---
layout: default
---

# 密封子類別的修飾詞

繼承密封類別的子類別，**必須**使用以下修飾詞之一：

| 修飾詞 | 說明 |
| --- | --- |
| `final` | 終止繼承，不能再有子類別 |
| `sealed` | 繼續密封，需指定新的 `permits` |
| `non-sealed` | 解除限制，任何類別皆可繼承 |

```java
public final class Circle extends Shape { /*...*/ }
public non-sealed class Square extends Shape { /*...*/ }
```

<!--
【情境切入】
被列入 `permits` 名單的子類別，並不是就此自由了——它們還得各自表態，說明「我這一支血脈接下來要怎麼發展」。

【概念定義】
每個繼承密封類別的子類別，都「必須」三選一：用 `final` 表示到此為止、用 `sealed` 表示繼續設名單、或用 `non-sealed` 表示開放給任何人繼承。

【生活化比喻】
這就像家族企業傳承：`final` 代表「我這一代不開分店了」；`sealed` 代表「我繼續挑分店店長，但只給特定幾個人」；`non-sealed` 代表「算了，誰想加盟都可以」。

⚠️ 易錯點提醒：
忘記加上這三個修飾詞之一，編譯器會直接報錯。`sealed` 不是「裝飾用」的關鍵字，它會強制我們把繼承關係想清楚。
-->
---
layout: default
---

# 練習 1：密封圖形系統
### 任務說明

請將練習中設計的抽象類別 `Shape` 改寫為 **sealed 抽象類別**，使用 `permits` 限制只允許 `Rectangle` 和 `Circle` 繼承，並為這兩個子類別各自選擇合適的修飾詞（`final` 或 `non-sealed`）。

**預期輸出：**
```
矩形面積：6.0
矩形周長：10.0
圓面積：12.566370614359172
圓周長：12.566370614359172
```

<!--
【任務鋪陳】
我們在基礎版已經寫過 Shape、Rectangle、Circle 的面積周長計算，現在要幫這個小型圖形系統「上鎖」，明確規定只有這兩種圖形可以存在。

【引導思考】
如果之後有人想新增一個 `Triangle` 類別並繼承 `Shape`，在沒有修改 `permits` 的情況下，會發生什麼事？這正是 sealed 想要達成的效果。
-->
---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. 將 `abstract class Shape` 改為 `public abstract sealed class Shape permits Rectangle, Circle`
2. `Rectangle` 與 `Circle` 都不會再有子類別，因此宣告為 `public final class`
3. 其餘 `area()`、`perimeter()` 的實作與基礎版相同，**不需修改**
4. 嘗試額外新增一個 `Triangle extends Shape`，觀察編譯器顯示的錯誤訊息

<!--
【帶讀解法】
重點只在 class 宣告那一行：加上 `sealed` 和 `permits`，子類別補上 `final`，其他程式碼完全不用動。

⚠️ 易錯點提醒：
`permits` 的類別名稱必須與實際子類別的繼承關係完全對應，少寫一個或拼錯名字都會編譯錯誤。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Template Method 設計模式

<!--
【段落轉換】
接下來我們要學的是抽象類別的「經典戲法」：用一個固定不變的方法，串接起一堆「待填空」的抽象方法。
-->
---
layout: default
---

# Template Method Pattern

抽象類別的經典設計模式：用 `final` 方法固定流程骨架，用 `abstract` 方法讓子類別填入細節：

| 方法角色 | 宣告方式 | 說明 |
| --- | --- | --- |
| 骨架方法 | `final` 普通方法 | 定義固定流程，子類別不可 `override` |
| 可變步驟 | `abstract` 方法 | 子類別各自實作細節 |

```java
abstract class Game {
    abstract void start();    // 可變步驟
    abstract void end();      // 可變步驟
    final void play() { start(); end(); }  // 骨架固定
}
```

<!--
【情境切入】
想像我們要設計很多種遊戲：象棋、足球、桌遊。每種遊戲玩法天差地遠，但「開始遊戲、進行遊戲、結束遊戲」這個大流程卻是固定的。如果每個子類別都自己重寫一遍整個流程，很容易有人寫錯順序，甚至漏掉某個步驟。

【概念定義】
Template Method（模板方法）就是「把固定流程寫在父類別、用 `final` 鎖住，讓子類別不能更動順序；流程中會變動的步驟則宣告成 `abstract`，交給子類別各自實作」。

【生活化比喻】
這就像泡泡麵：步驟永遠是「撕開蓋子、加熱水、等三分鐘、開吃」，這個流程是死的（`final`），誰都不能跳過或調換順序。但「泡哪一種麵」？這就是子類別自己決定的部分（`abstract`）。

💼 業界實務：
許多框架（例如測試框架的 setup/test/teardown 流程）都是用 Template Method 設計的：流程固定，細節讓使用者填空。
-->
---
layout: default
---

# Template Method Pattern — 子類別實作

```java
class Chess extends Game {
    @Override void start() { System.out.println("走棋"); }
    @Override void end()   { System.out.println("將軍"); }
}
class Soccer extends Game {
    @Override void start() { System.out.println("踢球"); }
    @Override void end()   { System.out.println("進球"); }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>new Chess().play()</code> → 走棋 → 將軍；新增遊戲只需新增子類別，骨架流程不需修改
</div>

<!--
【範例目的】
這個範例示範同一套流程（`play()`），套用在兩種完全不同的遊戲上會發生什麼事。

【帶讀關鍵行】
`Chess` 和 `Soccer` 都只覆寫 `start()` 和 `end()`，完全沒有觸碰 `play()`。但呼叫 `new Chess().play()` 時，依然會自動依照「先 start 再 end」的順序執行。

⚠️ 易錯點提醒：
`play()` 是 `final`，子類別不能也不需要覆寫它；如果想新增第三種遊戲（例如桌遊），只需要新增一個子類別並實作 `start()`、`end()`，完全不用修改 `Game` 或既有的子類別。

【預期結果】
```
new Chess().play();   → 走棋 → 將軍
new Soccer().play();  → 踢球 → 進球
```
-->
---
layout: default
---

# 練習 2：訂單處理流程
### 任務說明

請設計一個**抽象類別 `OrderProcess`**，使用 Template Method Pattern：

- `final void process()`：固定流程，依序呼叫 `validate()`、`pay()`、`ship()`
- `abstract void validate()`、`abstract void pay()`、`abstract void ship()`：交由子類別實作

設計子類別 `OnlineOrder`，實作三個步驟分別印出對應訊息。

**預期輸出：**
```
檢查線上訂單
信用卡付款
宅配出貨
```

<!--
【任務鋪陳】
剛才的遊戲範例示範了「固定流程＋可變步驟」，現在我們把這個套路套用到更貼近實務的情境：訂單處理流程。

【引導思考】
不論是線上訂單還是門市訂單，「驗證 → 付款 → 出貨」這個大流程通常不會變，會變的只是每個步驟「具體怎麼做」。想想看，哪個方法該宣告成 `final`，哪些該宣告成 `abstract`？
-->
---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. `OrderProcess` 中宣告 `abstract void validate();`、`abstract void pay();`、`abstract void ship();`
2. `final void process()` 依序呼叫上述三個方法：`validate(); pay(); ship();`
3. `OnlineOrder extends OrderProcess`，三個方法依序印出「檢查線上訂單」、「信用卡付款」、「宅配出貨」
4. 在 `main` 中執行：`new OnlineOrder().process();`

<!--
【帶讀解法】
重點跟 Chess／Soccer 範例一樣：`process()` 是 `final`，三個步驟方法是 `abstract`，`OnlineOrder` 只需要負責「填空」。

💼 業界實務：
如果之後要新增「門市訂單」`StoreOrder`，只需要新增一個子類別並實作三個步驟，`process()` 的流程完全不用改，這就是 Template Method 帶來的擴充彈性。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這份自學內容學了 Sealed 抽象類別和 Template Method 設計模式，最後這個練習要把兩招合體，動手做一個「有固定流程、又限制繼承名單」的完整框架。
-->
---
layout: default
---

# 練習 3 (綜合)：密封式遊戲框架
### 任務說明

請結合本份自學內容的兩個主題：

1. 設計 `abstract sealed class Game permits Chess, Soccer`，內含 `final void play()`（依序呼叫 `start()`、`end()`）與兩個 `abstract` 方法 `start()`、`end()`
2. `Chess`、`Soccer` 皆宣告為 `final class`，各自實作 `start()`、`end()`
3. 嘗試新增第三個子類別 `Poker`，觀察編譯器錯誤

**預期輸出：**
```
走棋 → 將軍
踢球 → 進球
```

<!--
【任務鋪陳】
我們把這份自學內容學到的兩招合體：用 Template Method 固定遊戲流程，再用 sealed 把「能玩的遊戲種類」鎖死。

【引導思考】
這樣設計之後，`Game` 這個抽象類別同時做了兩件事：「規定流程順序」和「規定誰能加入這個遊戲家族」。想一想，這對團隊開發大型專案會帶來什麼好處？
-->
---
layout: default
---

# 練習 3 (綜合)：解題提示
### 提示說明

1. `Game` 宣告為 `public abstract sealed class Game permits Chess, Soccer`
2. `final void play() { start(); end(); }` 與 Template Method 範例相同
3. `Chess`、`Soccer` 改為 `public final class Chess extends Game`、`public final class Soccer extends Game`
4. 新增 `class Poker extends Game` 時，因 `Poker` 不在 `permits` 名單中，編譯器會直接報錯

<!--
【帶讀解法】
這題其實沒有新的語法，只是把前面兩個主題的程式碼「疊」在同一個類別上：`sealed` 管繼承名單，`final void play()` 管執行流程。

⚠️ 易錯點提醒：
`permits` 名單與 `final void play()` 是兩件獨立的事——`sealed` 限制的是「誰能繼承」，`final` 限制的是「這個方法能不能被覆寫」，兩者互不影響，但可以同時使用。
-->
---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[收尾]
這份自學內容到這裡就結束了！我們學會了用 sealed 精確控制繼承名單，也學會了用 Template Method 把固定流程鎖死、把可變步驟留給子類別。這兩招在中大型專案裡會經常派上用場，之後遇到類似情境時，記得回來看看這份投影片。
-->
