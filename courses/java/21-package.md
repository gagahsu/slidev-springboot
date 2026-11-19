---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 套件 (Package)
routeAlias: ch21
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
    套件 (Package)
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「組織程式碼的容器，控制誰能存取什麼」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好，今天我們要來聊聊「套件（Package）」。前面我們已經寫了不少類別，這一章要學的是「怎麼把這些類別整理得有條有理」。

【為什麼要學這個？】
想像我們的電腦桌面上，所有檔案都直接放在桌面，從文件、圖片到安裝程式全部混在一起，找一個檔案要找半天。套件做的事情，就是幫程式碼建立資料夾結構，讓同類型的類別放在一起，也讓不同團隊寫的類別不會「撞名」。

【今天學完你會能做什麼】
學完這一章，我們會知道怎麼用 `package` 把類別分類、怎麼用 `import` 取用別人寫好的類別，最重要的是學會「存取控制修飾詞」——這是決定「誰可以看到、誰可以用」的規則，也是封裝（Encapsulation）真正落地的地方。
-->

---
layout: default
---

# Outline

- **認識套件** — 什麼是套件、為什麼需要套件
- **建立套件** — `package` 宣告、目錄結構
- **匯入套件** — `import`、萬用字元、靜態匯入
- **常用標準套件** — `java.lang`、`java.util`、`java.io` 等
- **存取控制修飾詞** — `public`、`protected`、預設（package）、`private`
- **實作綜合練習**

<!--
【帶讀大綱】
今天的安排是這樣：先搞懂套件是什麼、為什麼會有它，接著學怎麼自己建立套件、怎麼用 `import` 取用別人的套件。中間會認識幾個 JDK 內建的常用套件，最後——也是今天的重點——存取控制修飾詞。

【重點預告】
存取控制修飾詞這部分，幾乎每一份 Java 工作的面試都會問到，因為它直接關係到我們前面學過的「封裝」要怎麼真正落實。每一段結束後也都會有一個小練習，讓我們邊學邊練。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識套件

<!--
【段落轉換】
先了解套件是什麼、解決什麼問題，再進入實際操作。
-->

---
layout: default
---

# 什麼是套件？

- 套件（Package）是**一組相關類別與介面的集合**，對應到檔案系統的**目錄**
- 解決兩個核心問題：
  - **命名衝突**：不同套件可以有相同名稱的類別（如 `java.util.Date` 與 `java.sql.Date`）
  - **存取控制**：套件是 Java 存取控制的邊界單位之一

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>類比：</b>套件就像資料夾，類別就像檔案。不同資料夾裡可以有同名檔案，不會衝突
</div>

<!--
【情境切入】
想像我們現在要寫一個大型專案，類別一個一個增加：`Student`、`Teacher`、`StudentService`、`ReportPrinter`……如果全部都丟在同一層，過不了多久，這個資料夾就會變成一團混亂，根本不知道哪個檔案在做什麼。

【概念定義】
「套件就是『一組相關類別與介面的集合』，對應到檔案系統裡的一個目錄」。它幫我們把程式碼分類整理，同時也劃出了一個「存取控制的邊界」。

【生活化比喻】
這就像收納盒：套件是收納盒，類別是裡面的小物件。我們可以有「文具收納盒」裡裝一支「剪刀」，也可以有「廚房收納盒」裡裝另一支「剪刀」——兩支剪刀同名沒關係，因為它們放在不同的盒子裡，不會搞混。

💼 業界實務：
在 Spring Boot 專案裡，我們常會看到 `controller`、`service`、`repository` 這些套件名稱，這不是隨便分的，而是讓團隊一看資料夾名稱，就知道這個類別負責什麼角色。
-->

---

# 套件的命名慣例

| 層級 | 說明 | 範例 |
| --- | --- | --- |
| 最外層 | 以公司或組織的網域名稱反轉 | `com.google` / `org.apache` |
| 第二層 | 專案或產品名稱 | `com.google.gson` |
| 第三層以後 | 功能模組 | `com.google.gson.stream` |

- 全部**小寫**，不使用底線或大寫
- JDK 標準套件以 `java.` 或 `javax.` 開頭

<!--
【情境切入】
如果大家各自隨便取套件名稱，例如都叫 `utils` 或 `model`，當這些程式碼被打包在一起使用時，難保不會撞名。

【概念定義】
Java 的慣例是「把公司或組織的網域名稱反過來寫」當作套件最外層，例如網域 `google.com` 就變成 `com.google`。因為網域名稱在全世界是唯一的，反過來寫出來的套件名稱自然也不會跟別人撞。

【生活化比喻】
這有點像寄信時寫地址，從大範圍寫到小範圍：先寫「國家、城市」，再寫「街道、門牌」。套件名稱也是先寫「公司」，再寫「專案」，最後寫「功能模組」。

⚠️ 命名規則提醒：
套件名稱一律小寫，不能有大寫字母也不能用底線。`Com.Google` 或 `com_google` 這類寫法都不符合慣例，編譯器不會報錯，但會被視為不專業的寫法。
-->

---
layout: default
---

# 練習 1：規劃套件命名
### 任務說明

假設我們的公司網域是 `myschool.edu.tw`，要開發一套「線上選課系統」，裡面包含：

- 學生、課程等資料模型類別
- 處理選課邏輯的服務類別
- 印出選課結果的工具類別

請依照套件命名慣例，規劃這個專案的套件結構，並寫出至少 3 個套件的完整名稱。

<!--
【任務鋪陳】
剛才我們學了套件命名要「反轉網域名稱」，現在來實際練習一次：把一個真實的專案，規劃成符合慣例的套件結構。

【引導思考】
網域 `myschool.edu.tw` 反過來寫會是什麼樣子？資料模型、服務邏輯、工具類別，通常會各自放在哪一層的子套件裡？想想看名稱要怎麼取才能讓別人一看就懂這個套件是做什麼的。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. 網域 `myschool.edu.tw` 反轉後為 `tw.edu.myschool`
2. 專案名稱可加在第二層，例如 `tw.edu.myschool.courseapp`
3. 依功能模組分出第三層：
   - `tw.edu.myschool.courseapp.model`（資料模型，如 `Student`、`Course`）
   - `tw.edu.myschool.courseapp.service`（選課邏輯，如 `EnrollmentService`）
   - `tw.edu.myschool.courseapp.util`（工具類別，如 `ReportPrinter`）

<!--
【帶讀解法】
重點是先把網域反過來，再加上專案名稱，最後依功能分類。只要全部小寫、沒有底線，名稱大致合理就算正確。

💼 業界實務：
這種「網域 + 專案 + 功能模組」的三層結構，幾乎是業界的標準寫法，之後我們看到任何 Java 開源專案的套件名稱，幾乎都是照這個模式去推測它的用途。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立套件

<!--
【段落轉換】
知道什麼是套件之後，接著來看怎麼自己建立一個套件。
-->

---
layout: default
---

# `package` 宣告

- `package` 必須是原始碼檔案的**第一行有效敘述**（前面只能有空行或註解）
- 一個 `.java` 檔只能屬於**一個套件**

```java
package com.example.model;

public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() { return name; }
}
```

<!--
【情境切入】
我們寫好一個 `Student` 類別，要怎麼告訴 Java「這個類別屬於哪個套件」？

【概念定義】
答案就是在檔案最開頭加上 `package 套件名稱;`，這一行必須是檔案裡「第一行有效的程式碼」，前面只能放空行或註解。這就像是這份檔案的「戶籍登記」，一旦登記了，這個類別就正式屬於這個套件。

【生活化比喻】
這就像寄包裹時，第一步一定是先寫寄件地址；如果地址寫在包裹裡面而不是外面，郵局根本不知道要往哪裡送。`package` 宣告也是同樣的道理，一定要放在最前面。

⚠️ 易錯點提醒：
如果把 `package` 宣告寫在類別中間，或寫在 `import`、其他程式碼之後，編譯器會直接報錯。記得：`package` 永遠是第一行（註解除外）。
-->

---

# 套件與目錄結構的對應

套件名稱對應到**實體目錄**，每個 `.` 是一層目錄：

```
src/
└── com/
    └── example/
        └── model/
            └── Student.java    ← package com.example.model;
        └── service/
            └── StudentService.java  ← package com.example.service;
```

- 套件路徑與類別檔案路徑**必須完全對應**，否則編譯失敗
- 沒有宣告 `package` 的類別屬於**預設套件（default package）**，不建議在正式專案使用

<!--
【概念定義】
套件名稱裡的每一個 `.`，對應到實際檔案系統裡的一層目錄。`com.example.model` 就會對應到 `com/example/model/` 這個路徑，`Student.java` 就放在這個目錄底下。

【生活化比喻】
這就像我們前面學的「地址要跟收件人住的地方對得上」——`package` 宣告寫的是「戶籍地址」，檔案實際存放的位置就是「居住地」，兩者必須一致，否則郵差（編譯器）找不到人。

⚠️ 易錯點提醒：
新手最常犯的錯誤就是：檔案放在資料夾 A，但 `package` 卻寫成 B。Java 編譯器會直接拒絕編譯，因為它認為這個類別「住址造假」。另外，沒有寫 `package` 的類別會落入「預設套件」，正式專案不建議這樣做，因為完全沒有分類，也容易跟別人的類別撞名。
-->

---
layout: default
---

# 練習 2：建立第一個套件
### 任務說明

請建立一個套件 `tw.edu.myschool.courseapp.model`，並在裡面建立一個 `Course` 類別，包含：

- 成員變數：`courseName`（課程名稱）、`credit`（學分數）
- 建構方法：可同時設定上述兩個變數
- 方法：`showInfo()`，印出「課程：XXX，學分：N」

**預期輸出（建立 `new Course("Java 程式設計", 3)` 並呼叫 `showInfo()`）：**
```
課程：Java 程式設計，學分：3
```

<!--
【任務鋪陳】
剛才我們規劃好了套件結構，現在來實際建立第一個套件與類別，體驗一次「套件名稱對應目錄結構」的感覺。

【引導思考】
`Course.java` 這個檔案應該放在哪個目錄底下？檔案最上面第一行該寫什麼？建立物件之後，要怎麼呼叫 `showInfo()` 印出結果？
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. 在 `src/tw/edu/myschool/courseapp/model/` 目錄下建立 `Course.java`
2. 檔案第一行寫 `package tw.edu.myschool.courseapp.model;`
3. 宣告 `private String courseName;` 與 `private int credit;`
4. 建構方法：`public Course(String courseName, int credit) { ... }`
5. `showInfo()`：`System.out.println("課程：" + courseName + "，學分：" + credit);`

<!--
【帶讀解法】
這題的重點不是程式邏輯，而是「位置要對」——目錄路徑要跟 `package` 名稱完全對應，缺一層、多一層都會編譯失敗。

⚠️ 易錯點提醒：
如果執行時出現找不到類別的錯誤，先檢查 `package` 宣告的名稱，跟檔案實際所在的目錄路徑是不是完全一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 匯入套件

<!--
【段落轉換】
建立了套件之後，怎麼在其他類別裡使用別的套件的類別？這就要用到 `import`。
-->

---
layout: default
---

# `import` 語法

- `import` 讓你在程式碼中直接使用類別的**短名稱**，不需要每次寫全名
- 寫在 `package` 宣告之後、類別宣告之前

```java
package com.example.service;

import com.example.model.Student;   // 匯入單一類別
import java.util.ArrayList;
import java.util.List;

public class StudentService {
    private List<Student> students = new ArrayList<>();
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不用 import 的情況：</b>使用 <code>java.lang</code> 套件的類別（如 <code>String</code>、<code>Math</code>）— 編譯器自動匯入
</div>

<!--
【情境切入】
我們把 `Student` 放在 `com.example.model`，現在想在 `com.example.service` 的 `StudentService` 裡使用它，難道每次都要寫一長串 `com.example.model.Student` 嗎？

【概念定義】
「`import` 讓我們在程式碼中直接使用類別的『短名稱』，不需要每次都寫出完整路徑」。它要寫在 `package` 宣告之後、類別宣告之前。

【生活化比喻】
這就像我們在通訊軟體裡把朋友的完整帳號加進「聯絡人」，之後只要打名字就能找到對方，不用每次都輸入一長串帳號——`import` 做的就是這件事，先「登記」好要用的類別，之後直接用短名稱呼叫。

💡 補充：
`java.lang` 套件（像 `String`、`Math`、`System`）是 Java 內建自動匯入的，不需要我們自己寫 `import`，這也是為什麼我們一直以來都能直接用 `String`、`System.out` 而不用加任何 `import`。
-->

---

# 萬用字元 `import`

```java
import java.util.*;   // 匯入 java.util 下所有 public 類別
```

| 比較項目 | 單一類別 import | 萬用字元 import |
| --- | --- | --- |
| 寫法 | `import java.util.ArrayList;` | `import java.util.*;` |
| 效能影響 | 無差異 | 無差異（編譯後相同） |
| 命名衝突風險 | 低 | 較高（可能引入同名類別） |
| 業界慣例 | 推薦（可讀性高） | 不建議（可讀性低） |

<!--
【概念定義】
`import java.util.*;` 可以一次匯入 `java.util` 套件下所有 `public` 類別，這就是「萬用字元 import」。

【生活化比喻】
這就像在聯絡人裡，不是一個一個加好友，而是直接「匯入整個部門的名單」。聽起來方便，但你的聯絡人列表會瞬間多出一堆不認識的人。

【業界實務】
業界其實不太愛用萬用字元 import，因為當我們看到 `import java.util.*;`，完全不知道這個檔案實際用到了哪些類別。單一類別 import 雖然多寫幾行，但可讀性高，IDE 也會自動幫我們管理這些 import，所以多數團隊還是建議一個一個 import。

⚠️ 易錯點提醒：
萬用字元 import 在效能上跟單一 import 完全沒有差別（編譯後結果相同），差別只在「可讀性」與「命名衝突風險」。
-->

---

# 靜態匯入 `import static`

讓你直接使用類別的靜態成員，不需要寫類別名稱：

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;
import static java.lang.Math.pow;

public class Circle {
    double radius;
    Circle(double r) { radius = r; }
    double area() {
        return PI * pow(radius, 2);
    }
    double hypotenuse(double a, double b) {
        return sqrt(pow(a, 2) + pow(b, 2));
    }
}
```

<!--
【情境切入】
我們已經很熟悉 `Math.sqrt()`、`Math.pow()` 這種寫法了。但如果一段程式裡要連續用到一堆 `Math` 的方法，每次都打 `Math.` 會不會有點煩？

【概念定義】
「靜態匯入（`import static`）讓我們可以直接使用類別的靜態成員，不需要再寫類別名稱」。例如 `import static java.lang.Math.sqrt;` 之後，就能直接寫 `sqrt(x)` 而不用 `Math.sqrt(x)`。

⚠️ 易錯點提醒：
靜態匯入用太多，反而會讓程式碼變得難懂——別人看到 `sqrt(x)`，不一定馬上知道這是 `Math.sqrt`。建議只在「會非常頻繁使用同一個類別的靜態方法」時才使用，例如數學運算密集的類別。
-->

---

# 全名存取（不使用 import）

不用 `import`，直接寫**全限定名稱（Fully Qualified Name）**：

```java
public class Demo {
    public static void main(String[] args) {
        java.util.ArrayList<String> list = new java.util.ArrayList<>();
        list.add("炭治郎");

        java.util.Date utilDate = new java.util.Date();
        java.sql.Date sqlDate = new java.sql.Date(
            System.currentTimeMillis());
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>適用時機：</b>同時使用兩個同名的類別（如 <code>java.util.Date</code> 與 <code>java.sql.Date</code>），至少其中一個用全名
</div>

<!--
【情境切入】
如果我們的程式同時需要用到 `java.util.Date` 和 `java.sql.Date`，這兩個類別同名，只能 `import` 其中一個，另一個怎麼辦？

【概念定義】
這時可以不寫 `import`，直接在程式碼中寫出「全限定名稱（Fully Qualified Name）」，也就是「套件名稱 + 類別名稱」的完整寫法，例如 `java.sql.Date`。

【生活化比喻】
這就像公司裡有兩個「王小明」，平常喊「王小明」大家會搞不清楚是哪一個，這時就改用全名「台北分公司的王小明」、「台中分公司的王小明」來區分——雖然囉嗦了一點，但至少不會認錯人。

⚠️ 易錯點提醒：
如果兩個同名類別都 `import`，編譯器會直接報錯（衝突）。正確做法是：其中一個用 `import`，另一個在使用的地方寫全名；或者兩個都不 `import`，全部用全名。
-->

---
layout: default
---

# 🎬 AI 協作時刻：萬用字元 import 跟 static import 是同一件事嗎？

`import java.util.*` 跟 `import static java.lang.Math.sqrt` 長得很像，很多初學者以為兩者是同一種「省略打字」的東西：

**要用的 Prompt：**

> 我搞混了這兩種寫法：
> ```java
> {貼上你的程式碼，例如：
> import java.util.*;
> import static java.lang.Math.sqrt;}
> ```
> 請解釋這兩個 import 的差別：一個匯入的是「類別」，一個匯入的是「靜態成員」，
> 各自在什麼情境下使用比較恰當？如果我把 `import static java.lang.Math.*;`
> 跟 `import java.util.*;` 一起亂用，可能會發生什麼可讀性問題？

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易混淆點：</b> <code>import java.util.*</code> 匯入的是「整個套件的類別」，讓你可以直接寫 <code>ArrayList</code>；<code>import static</code> 匯入的是「某個類別裡的靜態成員」，讓你可以直接寫 <code>sqrt(x)</code> 而不用 <code>Math.sqrt(x)</code>——兩者匯入的對象完全不同，別以為多加一個 <code>static</code> 只是語法上的小差異。
</div>

<!--
【操作提示】
可以現場示範：把 `import static java.lang.Math.*;` 跟一般類別匯入放在一起看，讓同學指出哪些名稱是「類別」、哪些是「方法/常數」，確認大家分得清楚。

【收斂一句話】
萬用字元 import 匯入的是類別，static import 匯入的是靜態成員，兩者匯入的「東西」不一樣，不是語法上的巧合。
-->
---
layout: default
---

# 練習 3：解決命名衝突
### 任務說明

請寫一段程式碼，在同一個 `main` 方法中：

1. 建立一個 `java.util.Date` 物件，代表「目前時間」
2. 建立一個 `java.sql.Date` 物件，代表「目前時間」（使用 `new java.sql.Date(System.currentTimeMillis())`）
3. 將兩個物件分別印出

請說明你會如何 `import`，以避免命名衝突。

<!--
【任務鋪陳】
剛才學到，`java.util.Date` 和 `java.sql.Date` 同名時，至少其中一個要用全名。現在來實際練習一次。

【引導思考】
如果只 `import java.util.Date;`，那 `java.sql.Date` 在程式碼中該怎麼寫？反過來呢？哪一種寫法比較常見？
-->

---
layout: default
---

# 練習 3：解題提示
### 提示說明

1. 在檔案開頭只 `import java.util.Date;`（較常用的那一個）
2. 程式碼中直接寫 `Date utilDate = new Date();`
3. 另一個用全名：`java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());`
4. 印出兩個物件即可看到不同的輸出格式

<!--
【帶讀解法】
原則是：比較常用、或者程式裡出現次數較多的那個類別，用 `import` 取短名稱；比較少用的那個，就在使用時直接寫全名。

💼 業界實務：
這種命名衝突的情境，最常出現在「同時操作一般日期物件」和「資料庫日期欄位」的程式裡，例如把 `LocalDate` 轉成 `java.sql.Date` 存進資料庫的時候。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常用標準套件

<!--
【段落轉換】
JDK 提供了大量的標準套件，認識最常用的幾個，之後遇到陌生的類別名稱時，就能猜出它大概放在哪個套件裡。
-->

---
layout: default
---

# JDK 常用標準套件

| 套件 | 說明 | 常用類別 |
| --- | --- | --- |
| `java.lang` | 核心類別，自動匯入 | `String`、`Math`、`Integer`、`System` |
| `java.util` | 工具類別與集合框架 | `ArrayList`、`HashMap`、`Scanner`、`Date` |
| `java.io` | 傳統 I/O | `File`、`FileReader`、`BufferedReader` |
| `java.nio` | 新 I/O（非阻塞） | `Path`、`Files`、`Channels` |
| `java.net` | 網路 | `URL`、`Socket`、`HttpURLConnection` |
| `java.sql` | 資料庫 (JDBC) | `Connection`、`Statement`、`ResultSet` |

<!--
【重點解說】
這張表整理了 Java 內建的「標準套件大禮包」。我們之後看到陌生的類別，可以先猜猜它屬於哪個套件——通常名稱本身就有提示。

【生活化比喻】
這幾個套件就像我們常去的不同樓層的賣場：`java.lang` 是「日用品區」，東西每天都在用、不用特別找；`java.util` 是「工具區」，集合框架（`ArrayList`、`HashMap`）都在這裡；`java.io` 則是「文件處理區」。

💼 業界實務：
我們目前已經用過 `java.util`（`Scanner`、`ArrayList`）和 `java.lang`（`String`、`Math`），這些是 Java 開發中使用頻率最高的兩個套件，務必熟悉。
-->

---

# `java.time` 套件（JDK 8）

JDK 8 引入全新的日期時間 API，取代 `java.util.Date`：

| 類別 | 說明 |
| --- | --- |
| `LocalDate` | 日期（年月日），不含時間 |
| `LocalTime` | 時間（時分秒），不含日期 |
| `LocalDateTime` | 日期 + 時間 |
| `ZonedDateTime` | 帶時區的日期時間 |
| `DateTimeFormatter` | 格式化/解析日期時間字串 |

<!--
【回顧】
我們在 Ch 13 已經學過 `LocalDate`、`LocalTime`、`LocalDateTime` 這幾個類別的基本用法，這裡再從「套件」的角度複習一次它們的歸屬。

【概念定義】
這些類別都放在 `java.time` 套件，是 JDK 8 引入的「全新日期時間 API」，目的就是取代設計上有許多問題的 `java.util.Date`。

💼 業界實務：
現在的 Java 專案，幾乎都已經改用 `java.time` 套件處理日期時間。如果在新專案裡看到 `java.util.Date`，通常代表這是一段比較舊的程式碼。
-->

---

# `java.time` 套件 — 範例

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

LocalDate today = LocalDate.now();
String fmt = today.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
System.out.println(fmt);
```

<!--
【範例目的】
這個範例示範 `import` 一個 `java.time` 套件下的類別，並用它取得今天的日期、格式化輸出。

【帶讀關鍵行】
`import java.time.LocalDate;` 把 `LocalDate` 短名稱匯入；`LocalDate.now()` 取得今天日期；`DateTimeFormatter.ofPattern("yyyy/MM/dd")` 指定輸出格式。

【預期結果】
執行後會印出今天的日期，格式類似 `2026/06/12`（依執行當天日期而不同）。
-->

---
layout: default
---

# 練習 4：計算天數差
### 任務說明

請使用 `java.time` 套件，撰寫程式：

1. 建立兩個 `LocalDate` 物件：`startDate`（例如 2024-01-01）與 `endDate`（例如今天）
2. 使用 `java.time.temporal.ChronoUnit` 計算兩個日期相差的天數
3. 印出「相差 N 天」

<!--
【任務鋪陳】
剛才複習了 `java.time` 套件裡常用的幾個類別，這次練習要再多 `import` 一個套件——`java.time.temporal`，來計算兩個日期之間相差幾天。

【引導思考】
要計算兩個 `LocalDate` 的天數差，需要 `import` 哪個套件下的哪個類別？方法名稱可以從「ChronoUnit.DAYS」這個提示去查 Java 官方文件。
-->

---
layout: default
---

# 練習 4：解題提示
### 提示說明

1. `import java.time.LocalDate;` 與 `import java.time.temporal.ChronoUnit;`
2. `LocalDate startDate = LocalDate.of(2024, 1, 1);`
3. `LocalDate endDate = LocalDate.now();`
4. `long days = ChronoUnit.DAYS.between(startDate, endDate);`
5. `System.out.println("相差 " + days + " 天");`

<!--
【帶讀解法】
這題的重點是：遇到不熟悉的功能時，要學會「猜套件名稱」——日期相關的進階運算，通常會在 `java.time.temporal` 這個子套件裡尋找。

💼 業界實務：
`ChronoUnit.DAYS.between(...)` 這種寫法在計算「會員到期天數」、「訂單已過幾天」等情境非常常見。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 存取控制修飾詞

<!--
【段落轉換】
這是今天最重要的部分。存取控制修飾詞決定「誰能看到什麼」，是封裝（Encapsulation）真正落地的機制。
-->

---
layout: default
---

# 四種存取控制修飾詞

| 修飾詞 | 同類別 | 同套件 | 子類別（不同套件） | 任意類別 |
| --- | --- | --- | --- | --- |
| `private` | O | X | X | X |
| （預設）package | O | O | X | X |
| `protected` | O | O | O | X |
| `public` | O | O | O | O |

- 存取範圍：`private` < 預設（package）< `protected` < `public`

<!--
【情境切入】
我們在 Ch 11 學過封裝，知道成員變數要設成 `private`、再用 `public` 的 getter/setter 存取。但「private」和「public」中間，其實還有兩種等級。

【概念定義】
Java 的存取控制修飾詞，依照「開放程度」由窄到寬，一共有四種：`private`（只有自己）、預設／package-private（同套件）、`protected`（同套件 + 不同套件的子類別）、`public`（所有人）。

【生活化比喻】
我們可以把這四種等級想成抽屜的鎖：`private` 是上鎖的私人日記，只有自己能打開；預設（package）是放在客廳的東西，家人都能拿；`protected` 是留給子孫的傳家寶，只傳給有血緣關係的後代；`public` 則是貼在公佈欄上的公告，誰都能看。

⚠️ 易錯點提醒：
這張表是這一章最重要的記憶點，務必記住「存取範圍由窄到寬」的順序：`private` < 預設 < `protected` < `public`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：存取修飾詞面試題驗收

四種存取修飾詞的差異是 junior Java 面試最常考的基礎題之一，考前讓 AI 幫你出題：

**要用的 Prompt：**

> 根據 private、預設（package-private）、protected、public
> 這四種存取修飾詞的差異（同類別、同套件、不同套件的子類別、任意類別），
> 出 3 題情境選擇題，難度由淺到深，考我判斷「某個成員在某個情境下能不能被存取」。
> 一次只出一題，等我回答後才公布答案，
> 答錯時不要直接講答案，先給一個提示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>帶回家用：</b> 每學完一個章節，都可以用這個 prompt 叫 AI 考你，比自己看筆記更容易發現盲點。
</div>

<!--
【操作提示】
建議實際找一位同學跟 AI 互動作答，其他人在台下一起猜答案，增加參與感。

【收斂一句話】
記住由窄到寬的順序：private < 預設 < protected < public，情境題只要對照這張表就能推出答案。
-->

---

# `private` — 最嚴格的限制

- 只能在**同一個類別**內存取
- 主要用於**成員變數**（實現封裝）和**只供內部使用的方法**

```java
public class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public double getBalance() {
        return balance;
    }
    private void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}
```

<!--
【概念定義】
`private` 是最嚴格的存取等級：「只有這個類別自己可以存取，外人完全看不到」。

【帶讀關鍵行】
`balance` 宣告為 `private`，外部不能直接修改；要存錢一定要透過 `deposit()`，這個方法裡可以先檢查金額是否合法（`if (amount > 0)`）。`log()` 也是 `private`，因為它只是內部使用的輔助方法，不需要讓外部呼叫。

【生活化比喻】
`private` 就像保險箱裡的東西——銀行帳戶的餘額不能讓路人甲直接伸手進去改，要存錢、要取錢，都得透過「惃員（`deposit()`）」這個窗口，惃員會先檢查一下金額合不合理。

💼 業界實務：
「成員變數一律 `private`，透過 `public` 方法控制存取」是 Java 封裝最基本也最重要的原則，幾乎所有正式專案都會遵守。
-->

---

# 預設（package-private）— 套件內共享

- **不加任何修飾詞**時的預設存取等級
- 同一套件內的所有類別可存取，套件外的類別無法存取

```java
package com.example.util;

class Helper {           // 沒有 public，只有同套件能用
    static String format(String s) {
        return s.trim().toLowerCase();
    }
}

public class StringUtils {
    public static String clean(String input) {
        return Helper.format(input);  // 同套件，可存取
    }
}
```

<!--
【情境切入】
有時候我們會寫一些「只是給同一套件內的其他類別用」的輔助類別或方法，不希望套件外的人直接拿去用，這時候要怎麼設定？

【概念定義】
「不加任何修飾詞時，就是預設的存取等級，也叫『package-private』——同一套件內的所有類別都能存取，套件外則完全看不到」。

【生活化比喻】
這就像同一個辦公室裡的同事可以互相借文具、互相幫忙，但隔壁部門（別的套件）的人就不會知道你們辦公室裡有這些東西，也拿不到。

⚠️ 易錯點提醒：
「不寫修飾詞」不等於「沒有存取控制」——它其實是一種明確的等級（package-private），只是範圍比 `private` 稍微寬一點，比 `protected` 窄。
-->

---

# `protected` — 保護繼承鏈

- 同套件的類別可存取
- **不同套件的子類別也可存取**（透過繼承）

```java
package com.example.animal;

public class Animal {
    protected String name;
    protected void breathe() {
        System.out.println(name + " 在呼吸");
    }
}
```

```java
package com.example.pet;      // 不同套件
import com.example.animal.Animal;

public class Dog extends Animal {
    public void show() {
        name = "小黑";         // 子類別可存取 protected 成員
        breathe();
    }
}
```

<!--
【情境切入】
如果 `Animal` 的 `name` 是 `private`，那麼即使 `Dog`（不同套件）繼承了 `Animal`，也完全無法使用 `name`。但有些東西，我們確實希望「只傳給自己的後代」。

【概念定義】
「`protected` 表示同套件的類別可以存取，而且即使是不同套件，只要是這個類別的子類別，也能透過繼承存取」。

【生活化比喻】
`protected` 就像傳家寶——只傳給自己家的後代（子類別），不管這個後代搬到哪裡（不同套件）都能繼承到；但隔壁鄰居（沒有繼承關係的類別）就算住在同一條街上，也分不到。

💼 業界實務：
`protected` 常用在「設計給別人繼承的父類別」中，把一些「子類別需要用到，但外部不該直接碰」的欄位或方法設為 `protected`。
-->

---

# `public` — 完全開放

- 任何套件的任何類別都可存取
- 每個 `.java` 檔案最多只能有**一個** `public` 類別，且名稱必須與檔案名稱一致

```java
package com.example.model;

public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() { return name; }
    public int getAge() { return age; }
}
```

<!--
【概念定義】
「`public` 是完全開放，任何套件、任何類別都能存取」。

【生活化比喻】
`public` 就像貼在學校公佈欄上的公告，任何人經過都能看到、都能用。

⚠️ 一個檔案最多一個 public 類別：
每個 `.java` 檔案最多只能有一個 `public` 類別，而且這個類別的名稱必須跟檔案名稱完全一致（包含大小寫）。這個規則就像「一山不容二虎」——如果想在同一個檔案放多個類別，其他類別就只能是「預設（package-private）」等級。
-->

---

# 存取控制修飾詞可套用的對象

| 修飾詞 | 類別 | 成員變數 | 方法 | 建構方法 |
| --- | --- | --- | --- | --- |
| `private` | X（不能用在頂層類別） | O | O | O |
| 預設（package） | O | O | O | O |
| `protected` | X（不能用在頂層類別） | O | O | O |
| `public` | O | O | O | O |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>頂層類別</b>只能是 <code>public</code> 或預設（package-private），不能是 <code>private</code> 或 <code>protected</code>
</div>

<!--
【重點解說】
這張表整理了四種修飾詞「可以用在哪裡」，最容易搞混的一點是：最外層（頂層）的類別，只能宣告為 `public` 或預設，不能是 `private` 或 `protected`。

【生活化比喻】
想一想：如果一整個類別都設成 `private`，那除了它自己之外，誰都看不到它，那這個類別寫出來要給誰用？這就是為什麼 Java 不允許頂層類別是 `private` 或 `protected`——這兩種等級對「整個類別」來說沒有意義，只對類別「內部的成員」才有意義。
-->

---

# 封裝設計原則

| 原則 | 說明 |
| --- | --- |
| 成員變數用 `private` | 保護資料，避免外部直接竄改 |
| 公開方法用 `public` | 透過方法控制存取，可加入驗證邏輯 |
| 繼承用的方法用 `protected` | 子類別能用，但不暴露給外部 |
| 內部工具方法用 `private` | 實作細節隱藏在類別內 |

<!--
【小結】
這張表把今天學到的四種修飾詞，整理成「實務上該怎麼選」的設計原則：成員變數一律 `private`，對外提供的操作用 `public`，準備給子類別繼承用的用 `protected`，純粹內部使用的輔助方法則是 `private`。

【概念收回】
封裝不只是「把變數設 private」這麼簡單的動作，而是「透過存取控制修飾詞，決定資料和行為要對誰公開、對誰隱藏」——這就是封裝真正的精神。
-->

---

# 封裝設計原則 — 範例

```java
public class Temperature {
    private double celsius;

    public void setCelsius(double c) {
        if (c < -273.15) throw new IllegalArgumentException("低於絕對零度");
        this.celsius = c;
    }
    public double getCelsius() { return celsius; }
    public double getFahrenheit() { return celsius * 9.0/5 + 32; }
}
```

<!--
【範例目的】
這個範例示範「成員變數 private + 公開方法 public」的標準封裝寫法，並在設定值的時候加入驗證邏輯。

【帶讀關鍵行】
`celsius` 是 `private`，外部不能直接賦值；要設定溫度只能透過 `setCelsius()`，這個方法會先檢查「是否低於絕對零度」，不合理的值會直接拋出例外。

⚠️ 易錯點提醒：
如果 `celsius` 是 `public`，任何人都可以直接寫 `temp.celsius = -500;`，這個溫度計就會出現物理上不可能存在的數值。透過 `private` + `setCelsius()`，我們才能在「資料進來的那一刻」就把關。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
最後，來做一個綜合練習，把今天學到的套件結構與存取控制修飾詞整合在一起，實際操作一次。
-->

---
layout: default
---

# 練習 5 (綜合)：設計套件結構與存取控制
### 任務說明

設計一個簡單的學生管理系統，要求：

1. 建立套件 `com.school.model`，內有 `Student` 類別：
   - 成員變數 `name`（`private`）、`grade`（`protected`）、`studentId`（`public`）
   - 提供 `public` 的建構方法和 getter/setter
2. 建立套件 `com.school.service`，內有 `StudentService` 類別：
   - `import` 並使用 `Student`
   - 提供 `public` 方法 `printInfo(Student s)` 列印學生資訊
3. 建立 `com.school.Main`，建立 `Student` 物件並呼叫 `StudentService`

<!--
【任務鋪陳】
這是今天的綜合練習，會把「套件結構」「import」「存取控制修飾詞」全部用上一遍——這也是這一章最重要的三個主題。

【引導思考】
想一想：學生的姓名（`name`）這種比較私密的資訊，應該用哪種修飾詞？學號（`studentId`）這種需要讓外部直接讀取的資訊，又該用哪種？年級（`grade`）如果以後可能會被「子類別」（例如研究生）繼承使用，該怎麼設計？把這三個套件規劃好，就是今天的目標。
-->

---
layout: default
---

# 練習 5 (綜合)：解題提示

```java
// com/school/model/Student.java
package com.school.model;

public class Student {
    private String name;
    protected int grade;
    public String studentId;

    public Student(String studentId, String name, int grade) {
        this.studentId = studentId;
        this.name = name;
        this.grade = grade;
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getGrade() { return grade; }
}
```

<!--
【帶讀解法】
`Student` 類別就像一張名片：`name` 設成 `private`，因為比較私密，要透過 getter/setter 存取；`grade` 設成 `protected`，保留給未來可能的子類別（例如「研究生」）直接使用；`studentId` 設成 `public`，因為學號本身就是一個公開識別碼。
-->

---
layout: default
---

# 練習 5 (綜合)：解題提示

```java
// com/school/service/StudentService.java
package com.school.service;

import com.school.model.Student;

public class StudentService {
    public void printInfo(Student s) {
        System.out.println("學號：" + s.studentId);
        System.out.println("姓名：" + s.getName());
        System.out.println("年級：" + s.getGrade());
    }
}
```

<!--
【帶讀解法】
`StudentService` 在不同套件，所以一定要 `import com.school.model.Student;` 才能使用 `Student` 類別——這就是「匯入套件」這一段學的內容，實際派上用場的時候。

⚠️ 易錯點提醒：
`s.studentId` 可以直接存取，因為它是 `public`；但 `name` 是 `private`，只能透過 `s.getName()` 取得，不能寫 `s.name`。
-->

---
layout: default
---

# 練習 5 (綜合)：解題提示

```java
// com/school/Main.java
package com.school;

import com.school.model.Student;
import com.school.service.StudentService;

public class Main {
    public static void main(String[] args) {
        Student s = new Student("S001", "炭治郎", 2);
        new StudentService().printInfo(s);
    }
}
```

**預期輸出：**
```
學號：S001
姓名：炭治郎
年級：2
```

<!--
【重要觀念】
`Main` 跟 `Student`、`StudentService` 都不在同一個套件，所以兩個都要 `import`。即使 `grade` 是 `protected`，因為 `Main` 跟 `StudentService` 都不是 `Student` 的子類別，也不在同一套件，所以一樣只能透過 `getGrade()` 存取，不能直接寫 `s.grade`。

【小結】
這一題完整走過了「分套件 → import → 用存取修飾詞保護資料」的流程，這正是今天整章內容在實務上會怎麼被用到的縮影。
-->

---

# 總結

- **套件是一組相關類別的集合，對應到實體目錄** — 解決命名衝突，也是存取控制的邊界單位
- **套件命名慣例：網域反轉 + 專案 + 功能模組**，全部小寫，`package` 必須是檔案第一行有效敘述
- **`import` 讓我們用短名稱取用類別**，`java.lang` 套件（如 `String`、`Math`）自動匯入不需要 import
- **同名類別要用全限定名稱區分**（如 `java.util.Date` vs `java.sql.Date`），或只 import 其中一個
- **四種存取控制修飾詞，範圍由窄到寬：`private` < 預設（package）< `protected` < `public`**
- **封裝的標準做法：成員變數 `private`、對外操作用 `public`、給子類別用的用 `protected`**

<!--
我們把這一章整理成六個重點。

第一，套件是一組相關類別與介面的集合，對應到檔案系統裡的實體目錄，它解決了兩個問題：不同套件可以有同名類別而不衝突，而且套件本身就是存取控制的邊界之一。

第二，套件命名有固定慣例：把公司或組織的網域名稱反過來寫，再加上專案名稱、功能模組，而且一定要全部小寫；package 宣告必須是檔案裡第一行有效的程式碼。

第三，import 讓我們在程式碼裡直接用類別的短名稱，不用每次都寫完整路徑；java.lang 套件像 String、Math 是編譯器自動匯入的，完全不需要我們手動 import。

第四，如果兩個不同套件剛好有同名類別，例如 java.util.Date 和 java.sql.Date，只能 import 其中一個，另一個要用全限定名稱寫出完整路徑。

第五，也是這一章最重要的部分：四種存取控制修飾詞，範圍由窄到寬依序是 private、預設（package-private）、protected、public，這張對照表務必記熟。

第六，封裝的標準做法是：成員變數一律設成 private，對外提供的操作用 public 方法（可以加驗證邏輯），準備給子類別繼承用的欄位或方法用 protected，這就是存取控制修飾詞在實務上的具體應用。

這六點加起來，就是套件與存取控制的完整概念。下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天我們從「為什麼程式碼需要分類整理」出發，認識了套件（Package）的概念與命名慣例，學會了怎麼用 `import` 取用別人寫好的類別，也認識了幾個 JDK 常用的標準套件。

【核心帶走重點】
最重要的，是存取控制修飾詞這四個等級：`private`、預設（package）、`protected`、`public`，由窄到寬。記住這個順序，再搭配「成員變數 private、公開方法 public」的封裝原則，我們就能寫出結構清楚、資料安全的程式碼。有問題的話歡迎隨時提出！
-->

---
layout: end
---

# 課程結束
### 套件組織程式碼，存取控制保護封裝邊界

<!--
【結束語】
套件讓我們的程式碼有組織，存取控制修飾詞讓封裝真正落地。這一章學到的四個存取等級，會跟著我們一路用到之後的每一章——下課！
-->
