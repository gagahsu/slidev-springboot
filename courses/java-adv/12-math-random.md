---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 內建 Math 和 Random 類別（進階／自學）
routeAlias: ch12
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">內建 Math 和 Random 類別</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">進階自學內容</p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，歡迎來到「內建 Math 和 Random 類別」的進階自學篇！基礎版我們已經學過 Math 的常數、隨機數、比較、絕對值、捨入方法，還有一般數學運算（次方、開方、對數），這份自學內容會把重點放在「三角函數」這個比較硬核的主題上。

為什麼要學這個？因為三角函數雖然在日常寫程式不常用到，但只要遇到「角度」、「方向」、「距離」相關的問題——例如遊戲裡的角色轉向、地圖上兩點的距離——三角函數就是繞不過去的工具。學會它，我們才能挑戰本章最後的實戰專題：計算地球上兩個經緯度座標之間的距離。

學完這份自學內容，我們會知道 Java 的三角函數參數單位是什麼、怎麼互相轉換，以及如何把這些方法組合起來，寫出一個能算出「台北到東京有多遠」的程式。準備好就開始吧！
-->

---
layout: default
---

# Outline

- **三角函數方法**：sin / cos / tan、反三角函數、toRadians / toDegrees
- **專題：Haversine 公式**：計算地球上兩個經緯度座標之間的距離

<!--
這份自學內容分成兩個主題：先認識三角函數家族的方法，搞懂角度跟弧度的轉換；接著用這些方法搭配前面學過的 pow、sqrt 等運算，完成一個業界等級的「地球兩點距離」計算專題。

如果大家還記得基礎版教過的 Math.pow、Math.sqrt，這份內容會非常順。準備好的話，我們開始吧！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 三角函數

<!--
第一部分，我們來認識三角函數。工程師常用到的部分，但陷阱不少，最大的陷阱就是「角度」跟「弧度」的單位問題。
-->

---
layout: default
---

# 三角函數方法

| 方法 | 說明 |
| --- | --- |
| `Math.sin(radians)` | 正弦值，參數單位為**弧度** |
| `Math.cos(radians)` | 餘弦值，參數單位為**弧度** |
| `Math.tan(radians)` | 正切值，參數單位為**弧度** |
| `Math.asin(value)` | 反正弦，回傳弧度 |
| `Math.acos(value)` | 反餘弦，回傳弧度 |
| `Math.atan(value)` | 反正切，回傳弧度 |
| `Math.toRadians(degrees)` | 度數 → 弧度 |
| `Math.toDegrees(radians)` | 弧度 → 度數 |

<!--
這張表整理了三角函數家族的所有方法：sin、cos、tan 是基本的三角函數，asin、acos、atan 是它們的反函數，最後兩個 toRadians 和 toDegrees 則是「單位轉換器」。

如果大家要算角度，記得 Java 認的是「弧度」，不是我們日常生活中習慣的「度數」。

⚠️ 學生常見誤解：
如果直接傳 90 進去 `Math.sin(90)`，得到的不是 1，而是 -0.89 左右。因為電腦以為你要算「90 弧度」，而不是「90 度」。這就是接下來這頁要解決的問題。
-->

---
layout: default
---

# 三角函數 — 範例

```java
// toRadians 將度數轉為弧度，再傳入三角函數
System.out.println(Math.sin(Math.toRadians(90)));  // 1.0
System.out.println(Math.cos(Math.toRadians(0)));   // 1.0
System.out.println(Math.tan(Math.toRadians(45)));  // 0.9999... ≈ 1.0

// 反三角函數：回傳弧度，再轉為度數
double angle = Math.toDegrees(Math.asin(1.0));
System.out.println(angle);  // 90.0

// 直角三角形：已知對邊 3，斜邊 5，求角度
double sinValue = 3.0 / 5.0;
System.out.println(Math.toDegrees(Math.asin(sinValue))); // 36.87...
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>Java 的三角函數參數單位是弧度（radians），不是角度（degrees）。一定要先用 <code>Math.toRadians()</code> 轉換。
</div>

<!--
這個範例的目標是：示範三角函數和反三角函數的標準用法。

帶大家看關鍵行：`Math.sin(Math.toRadians(90))`——我們先把「90 度」用 `toRadians` 轉成弧度，再丟進 `sin`，這樣才會得到正確的 1.0。反過來，`asin` 算出來的角度是弧度，要再用 `toDegrees` 轉回我們熟悉的度數。

最後一個例子是直角三角形：已知對邊 3、斜邊 5，求對應的角度，答案是 36.87 度左右。

⚠️ 易錯點：忘記套 `toRadians()` 或 `toDegrees()` 是最常見的錯誤。這就像是你跟美國人講公里他們聽不懂，要先轉成英哩（Miles）一樣，電腦跟人類的角度單位也是有代溝的。

預期結果：依序印出 `1.0`、`1.0`、約 `0.9999...`、`90.0`、約 `36.87`。
-->

---
layout: default
---

# 練習 1 (自學)：直角三角形角度計算

### 任務說明

撰寫一個程式，已知一個直角三角形的兩個邊長：

1. 對邊（opposite）= `8.0`
2. 鄰邊（adjacent）= `6.0`

請計算並印出：

1. 斜邊長度（使用 `Math.sqrt` 和 `Math.pow`）
2. 對邊與斜邊的夾角角度（使用 `Math.atan` 與 `Math.toDegrees`）

<!--
回顧一下，我們剛剛學到三角函數的參數是弧度，反三角函數回傳的也是弧度，要用 `toDegrees` 轉換才會變成我們熟悉的角度。

引導思考：如果已知對邊和鄰邊，要怎麼用 `Math.atan` 算出角度？`Math.atan` 的參數應該放什麼值進去？
-->

---
layout: default
---

# 練習 1 (自學)：解題提示

### 提示說明

1. 斜邊長度可以用畢氏定理：`Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2))`
2. 角度的正切值 = 對邊 / 鄰邊，所以先算 `Math.atan(opposite / adjacent)` 得到弧度
3. 再用 `Math.toDegrees()` 把弧度轉成角度

```java
double opposite = 8.0;
double adjacent = 6.0;

double hypotenuse = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2));
System.out.printf("斜邊：%.1f%n", hypotenuse); // 10.0

double angleRad = Math.atan(opposite / adjacent);
double angleDeg = Math.toDegrees(angleRad);
System.out.printf("角度：%.2f 度%n", angleDeg); // 53.13 度
```

<!--
這題的重點在於把「畢氏定理」和「反三角函數」串在一起用。斜邊長度其實就是基礎版學過的 pow 和 sqrt 的應用，算出來是 10.0（這是經典的 6-8-10 直角三角形）。

角度的部分，`atan(對邊 / 鄰邊)` 算出來是弧度，記得一定要套 `toDegrees` 才會變成我們熟悉的 53.13 度。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 專題：地球兩點距離

<!--
第二部分，我們來挑戰一個實戰專題。把學到的數學工具拿來算地球兩點間的距離。
-->

---
layout: default
---

# Haversine 公式

**問題：** 已知兩地的經緯度，如何計算地球表面的直線距離？

**Haversine 公式** 將地球視為完美球體，利用球面幾何計算大圓距離：

| 變數 | 說明 |
| --- | --- |
| `φ₁, φ₂` | 兩點的緯度（轉為弧度）|
| `λ₁, λ₂` | 兩點的經度（轉為弧度）|
| `R` | 地球半徑（6371 km）|
| `a` | haversine 中間值 |
| `c` | 圓心角 |

```java
final double R = 6371; // 地球半徑（公里）
```

<!--
接下來我們要來點硬核的。假設我們要寫一個外送 App，要算外送員離我們有幾公里。

地球是圓的（雖然有人說是平的），所以不能直接用畢氏定理算直線距離。Haversine 公式就是用來處理球面距離計算的標準方法——把地球當成一個完美的球體，利用球面幾何算出兩點之間的「大圓距離」。

這張表列出公式裡會用到的變數：兩點的經緯度（要先轉成弧度）、地球半徑 R，以及兩個中間計算值 a 和 c。下一頁我們就來看實際的程式碼。
-->

---
layout: default
---

# Haversine 實作 (一)

```java
static double haversine(double val) {
    return Math.pow(Math.sin(val / 2), 2);
}

static double calcDistance(double lat1, double lon1,
                           double lat2, double lon2) {
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    lat1 = Math.toRadians(lat1);
    lat2 = Math.toRadians(lat2);
    double a = haversine(dLat)
             + Math.cos(lat1) * Math.cos(lat2) * haversine(dLon);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
}
```

<!--
這個範例的目標是：把 Haversine 公式翻譯成實際的 Java 程式碼。

帶大家看關鍵行：`haversine` 這個輔助方法只是把公式裡重複出現的 `sin(x/2)²` 包成一個小函式。`calcDistance` 則是主體——先用 `toRadians` 把經緯度差和兩點緯度都轉成弧度，再套進公式算出中間值 `a`，最後用 `atan2` 算出圓心角 `c`，乘上地球半徑 6371 公里就是距離。

⚠️ 易錯點：這段程式碼看起來很嚇人，但其實就是把前面學的 sin、cos、atan2、toRadians、pow、sqrt 串在一起。這就像是在組裝樂高，零件（方法）我們都有了，只要照著說明書（公式）拼起來就好，不需要逐行硬背。

預期結果：這個方法會回傳兩個經緯度座標之間的距離，單位是公里。
-->

---
layout: default
---

# Haversine 實作 (二) — 測試

```java
// 台北 (25.033, 121.565)  →  東京 (35.689, 139.692)
double dist = calcDistance(25.033, 121.565, 35.689, 139.692);
System.out.printf("台北 → 東京：%.1f 公里%n", dist);
// 約 2097.9 公里
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>用到的 Math 方法：</b><code>Math.sin()</code>、<code>Math.cos()</code>、<code>Math.sqrt()</code>、<code>Math.atan2()</code>、<code>Math.toRadians()</code>、<code>Math.pow()</code>——一次整合本章所有方法！
</div>

<!--
這個範例的目標是：實際呼叫 `calcDistance`，驗證 Haversine 公式算出來的結果是否合理。

帶大家看關鍵行：把台北和東京的經緯度傳入 `calcDistance`，算出來大約是 2097.9 公里——這跟我們平常查到的「台北飛東京約 2100 公里」非常接近，證明這個公式是可信的。

下方的提示告訴我們，這個專題一次用到了本章學過的六個 Math 方法，可以說是本章所有概念的「總驗收」。

預期結果：輸出「台北 → 東京：2097.9 公里」（實際數字可能因小數位數略有差異）。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
學完三角函數和 Haversine 公式，我們來做最後一題綜合練習，把整份自學內容的概念串起來。
-->

---
layout: default
---

# 練習 2 (綜合)：自家到學校的距離

### 任務說明

延伸 Haversine 公式的 `calcDistance` 方法：

1. 假設家裡座標為 (25.047, 121.517)，學校座標為 (25.018, 121.540)
2. 呼叫 `calcDistance` 計算兩地距離（公里）
3. 再用 `Math.round()`（基礎版學過的方法）把結果四捨五入到整數公里
4. 印出「從家到學校約 X 公里」

<!--
回顧一下，我們在 Haversine 實作中算出了台北到東京的距離；這題請大家把同樣的方法套用到「自家到學校」這種更貼近生活的距離計算上。

引導思考：這題還用到了基礎版學過的 `Math.round()`。如果 `calcDistance` 回傳的是 `double`，要怎麼把它轉成整數並四捨五入？回傳型別會是什麼？
-->

---
layout: default
---

# 練習 2 (綜合)：解題提示

### 提示說明

1. 直接呼叫前面寫好的 `calcDistance(lat1, lon1, lat2, lon2)`
2. `Math.round(double)` 回傳 `long`，所以用 `long` 變數接住結果
3. 印出時可以搭配字串相加或 `printf`

```java
double home2School = calcDistance(25.047, 121.517, 25.018, 121.540);
long rounded = Math.round(home2School);
System.out.println("從家到學校約 " + rounded + " 公里");
// 從家到學校約 4 公里
```

<!--
這題的重點在於「組合」：把 Haversine 計算出來的精確距離（double），交給 `Math.round()` 處理成方便閱讀的整數公里數。

提醒大家，`Math.round(double)` 回傳的型別是 `long`，這是基礎版「捨入方法」小節提過的細節——如果忘記了可以回去翻一下。把三角函數、Haversine、以及捨入方法串在一起，這份自學內容就算完整收尾了！
-->

---
layout: end
---
