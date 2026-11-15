---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 指定注入的 Bean — @Qualifier
routeAlias: ch07
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
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    指定注入的 Bean
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「當倉庫有兩台印表機，要告訴 Spring 拿哪一台」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第七章！

上一章最後留了一個問題：如果便利商店裡同時有 HP 和 Canon 兩台印表機，小明只說「請給我一台印表機」，店員要給哪一台？

今天就來解決這個問題。故事一樣是小明和便利商店。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **店裡有兩台印表機時，會發生什麼事？**
- **`@Qualifier`**：指名要「哪一台」
- **建構子注入、Lombok 的時候，`@Qualifier` 要寫在哪裡？**

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，店裡有兩台印表機的時候，會發生什麼事。

（下一步）第二，用 @Qualifier 指名要哪一台。

（下一步）第三，上一章學過建構子注入，那時候 @Qualifier 要寫在哪裡。最後也會介紹一個實務上很常用的小幫手：Lombok。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 店裡有兩台印表機

<!--
便利商店生意越來越好，老闆決定多買一台 Canon 印表機。現在店裡有兩台印表機了。

這時候小明走進來……
-->

---

# 「請給我一台印表機」…哪一台？

<PickPrinter />

<!--
現在店裡有兩台印表機：一台 HP，一台 Canon。請注意它們下面的編號貼紙，就是上一章說的 Bean 名字：hpPrinter 和 canonPrinter。

（下一步）小明走進來，跟平常一樣說：「請給我一台印表機」。

（下一步）店員就卡住了。兩台都是印表機，到底要給哪一台？

（下一步）這時候小明改口說：「我要編號 canonPrinter 那台」。店員馬上就找到了，把 Canon 交給小明。

所以解決方法很簡單：指名。
-->

---

# 把故事搬進程式裡

<Pairs left="便利商店" right="程式" rows="printer,店裡有兩台，都是印表機=code,容器裡有兩個 Printer 的 Bean|what,店員不知道要給哪一台=code,Spring 報錯：required a single bean, but 2 were found|you,小明指名「canonPrinter 那台」=code,@Qualifier(&quot;canonPrinter&quot;)" />

<!--
把故事搬進程式裡。

（下一步）店裡有兩台都是印表機，在程式裡就是 HpPrinter 和 CanonPrinter 都加了 @Component，容器裡有兩個 Printer 的 Bean。

（下一步）店員不知道要給哪一台，在程式裡就是 Spring 啟動時直接報錯。錯誤訊息的意思是：「我只需要一個，但找到了兩個」。大家之後看到這行錯誤，就知道是這個問題。

（下一步）小明指名「canonPrinter 那台」，在程式裡就是加上 @Qualifier，括號裡寫 canonPrinter。
-->

---

# 所以，什麼是 @Qualifier？

<v-clicks>

- `@Autowired`：店員先找出所有「**印表機**」（照種類找）
- `@Qualifier`：再看**編號貼紙**，挑出指名的那一台（照名字找）
- 先用種類縮小範圍，再用名字找到唯一一台

</v-clicks>

<v-click>

```java
@Autowired
@Qualifier("canonPrinter")
private Printer printer;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> <code>@Qualifier</code> 用來指定要注入的 Bean 的名字。
</div>

</v-click>

<!--
所以 @Qualifier 到底做了什麼？店員其實分兩步找。

（下一步）第一步，@Autowired 讓店員先找出所有「印表機」，這是照種類找。這時候找到兩台。

（下一步）第二步，@Qualifier 讓店員再看編號貼紙，挑出小明指名的那一台，這是照名字找。

（下一步）先用種類縮小範圍，再用名字找到唯一的一台。

（下一步）寫起來就是這三行：@Autowired 下面加一行 @Qualifier，括號裡寫 Bean 的名字。一句話記起來：@Qualifier 用來指定要注入的 Bean 的名字。
-->

---

# 使用 @Qualifier 要注意的三件事

<v-clicks>

- **一定要搭配 `@Autowired`**：要先開口要印表機，才能指名哪一台
- **寫的是編號貼紙，不是 class 名字**：第一個字母是**小寫**
- **名字要一字不差**：編號寫錯，店員找不到，程式就啟動失敗

</v-clicks>

<v-click>

```java
@Qualifier("CanonPrinter")  // ❌ 錯：這是 class 名字
@Qualifier("canonPrinter")  // ✅ 對：這是 Bean 的名字
```

</v-click>

<!--
用 @Qualifier 有三件事要注意。

（下一步）第一，一定要搭配 @Autowired。小明要先開口說「給我印表機」，才能接著指名哪一台。@Qualifier 單獨寫是沒有用的。

（下一步）第二，括號裡寫的是編號貼紙，也就是 Bean 的名字，不是 class 名字。所以第一個字母是小寫。

（下一步）第三，名字要一字不差。編號寫錯了，店員找不到，程式就會啟動失敗。

（下一步）這是最常見的錯誤：寫成大寫 C 開頭的 CanonPrinter。這是 class 名字，錯的。正確的是小寫 c 開頭的 canonPrinter。
-->

---

# 小測驗：要怎麼指名？

<Poll question="店裡有 HpPrinter 和 CanonPrinter 兩個 Bean。小明想要 Canon，@Qualifier 要怎麼寫？" options="@Qualifier(&quot;CanonPrinter&quot;)|@Qualifier(&quot;canonPrinter&quot;)|@Qualifier(&quot;Canon&quot;)" answer="2" />

<!--
來一題確認一下。

店裡有 HpPrinter 和 CanonPrinter 兩個 Bean。小明想要 Canon，@Qualifier 要怎麼寫？

（等大家作答）

（下一步）答案是小寫 c 開頭的 canonPrinter。

選第一個的同學，那是 class 名字，不是編號貼紙。選第三個的同學，Canon 只是牌子，編號是完整的 canonPrinter。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 實際寫一次

<!--
我們在 Spring Boot 裡實際寫一次。只要兩個步驟：先讓店裡多一台 Canon，再讓小明指名。
-->

---

# Step 1：店裡多一台 Canon 印表機

```java
import org.springframework.stereotype.Component;

@Component
public class CanonPrinter implements Printer {
    @Override
    public void print(String message) {
        System.out.println("Canon印表機: " + message);
    }
}
```

<v-click>

上一章的 `HpPrinter` 也保留 `@Component`，店裡就有兩台了。這時候如果小明沒有指名，啟動就會報錯：

```
required a single bean, but 2 were found
```

</v-click>

<!--
第一步，讓店裡多一台 Canon 印表機。

寫法跟上一章的 HpPrinter 一模一樣，只是名字換成 CanonPrinter，印出來的字換成「Canon印表機」。別忘了上面的 @Component，也就是「本店設備」的標籤。

（下一步）上一章的 HpPrinter 我們也保留，所以店裡現在有兩台了。如果這時候直接執行，小明沒有指名，Spring 就會報這個錯：我只需要一個，但找到了兩個。
-->

---

# Step 2：小明指名要 Canon

```java
@RestController
public class XiaoMingController {
    @Autowired
    @Qualifier("canonPrinter")
    private Printer printer;

    @RequestMapping("/homework")
    public String doHomework() {
        printer.print("小明的作業");
        return "作業印好了";
    }
}
```

<v-click>

瀏覽器打開 `http://localhost:8080/homework`，Console 會印出：

```
Canon印表機: 小明的作業
```

</v-click>

<!--
第二步，讓小明指名要 Canon。

這就是上一章的 XiaoMingController，只多了一行：@Qualifier 括號 canonPrinter。

（下一步）執行之後，用瀏覽器打開 /homework，Console 會印出「Canon印表機：小明的作業」。代表 Spring 真的把 Canon 交給小明了。
-->

---

# 想換回 HP？只改一個名字

把 `@Qualifier("canonPrinter")` 改成 `@Qualifier("hpPrinter")`，Console 就會變成：

```
HP印表機: 小明的作業
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>體驗鬆耦合：</b> 只改了指名的那個名字，小明的其他程式完全不用動。就像小明跟店員換一台機器，作業本身一個字都不用改。
</div>

</v-click>

<!--
如果想換回 HP 呢？只要把括號裡的名字改成 hpPrinter。Console 就會變成「HP印表機：小明的作業」。

（下一步）大家體驗一下：我們只改了指名的那個名字，小明的其他程式完全不用動。就像小明跟店員說換一台機器，作業本身一個字都不用改。這就是第四章說的鬆耦合。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 建構子注入時，要寫在哪裡？

<!--
上一章我們學過建構子注入，也就是小明一進門就交出一張需求清單。那這時候要怎麼指名？
-->

---

# 在清單上的那一項，寫上編號

建構子注入時，`@Qualifier` 要寫在**建構子的參數前面**：

```java
@RestController
public class XiaoMingController {
    private final Printer printer;

    public XiaoMingController(@Qualifier("canonPrinter") Printer printer) {
        this.printer = printer;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>為什麼位置不一樣？</b> 店員是照著「清單」（建構子參數）拿東西的，所以編號要寫在清單上。寫在變數上面，店員根本不會看，一樣會報錯。
</div>

</v-click>

<!--
用故事來想：建構子注入就是小明一進門交出的需求清單。要指名哪一台，當然要寫在清單上的那一項。

在程式裡，就是把 @Qualifier 寫在建構子的參數前面，跟參數寫在同一行。

（下一步）為什麼位置跟剛剛不一樣？因為店員是照著清單，也就是建構子參數，去拿東西的。所以編號要寫在清單上。如果把 @Qualifier 寫在上面的變數那裡，店員根本不會看那裡，一樣會報錯。這是很常見的錯誤，請大家特別注意。
-->

---

# 兩台都要？清單上各寫各的編號

小明印彩色作業用 Canon，另外再要一台 HP 當備用：

```java
@RestController
public class XiaoMingController {
    private final Printer colorPrinter;
    private final Printer backupPrinter;

    public XiaoMingController(@Qualifier("canonPrinter") Printer colorPrinter,
                              @Qualifier("hpPrinter") Printer backupPrinter) {
        this.colorPrinter = colorPrinter;
        this.backupPrinter = backupPrinter;
    }
}
```

<!--
如果小明兩台都要呢？例如印彩色作業用 Canon，另外再要一台 HP 當備用。

很簡單，清單上寫兩項，各自寫上編號就好。第一個參數指名 canonPrinter，第二個參數指名 hpPrinter。

清單上每一項各寫各的，一目了然。這也是建構子注入的好處之一。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# Lombok：自動幫你寫清單的小幫手

<!--
最後補充一個實務上非常常用的工具，叫做 Lombok。

建構子注入雖然好，但每次都要自己寫建構子，有點麻煩。Lombok 就是幫你自動寫的小幫手。
-->

---

# Lombok：幫小明自動寫好需求清單

```java
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class XiaoMingController {
    private final Printer printer;
    // 不用自己寫建構子，Lombok 會自動產生
}
```

<v-clicks>

- `@RequiredArgsConstructor`：把所有 `final` 的變數，自動寫成建構子的參數
- 實務上最常見的組合：`private final` 變數 + `@RequiredArgsConstructor`

</v-clicks>

<!--
這就是用了 Lombok 的小明。

跟上一章比起來，建構子不見了。我們只寫了 private final Printer printer，然後在 class 上面加了一個 @RequiredArgsConstructor。

（下一步）這個記號的意思是：把所有 final 的變數，自動寫成建構子的參數。也就是幫小明自動寫好需求清單。

（下一步）實務上，你在公司的 Spring Boot 專案裡，最常看到的就是這個組合：private final 變數，加上 @RequiredArgsConstructor。
-->

---

# 安裝 Lombok：三個步驟

**① 在 `build.gradle` 加入兩行**（兩行缺一不可）：

```groovy
dependencies {
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

<v-clicks>

- **② 重新整理 Gradle**：Eclipse 在專案上按右鍵 → Gradle → **Refresh Gradle Project**
- **③ 讓 Eclipse 認得 Lombok**：到 projectlombok.org 下載 `lombok.jar`，執行後按 Install，**重開 Eclipse**（IntelliJ、VS Code 已內建，通常不用裝）

</v-clicks>

<!--
要用 Lombok，需要先安裝，總共三個步驟。

第一步，在 build.gradle 加入這兩行。請注意兩行缺一不可。只加第一行的話不會報錯，但建構子不會被產生，執行時才會出問題。

（下一步）第二步，重新整理 Gradle。在 Eclipse 裡，專案按右鍵，選 Gradle，再選 Refresh Gradle Project。改完 build.gradle 一定要做這一步，Lombok 才會被下載。

（下一步）第三步，讓 Eclipse 認得 Lombok。到 Lombok 的官網下載 lombok.jar，執行之後按 Install，然後重開 Eclipse。如果沒做這一步，程式可以跑，但 Eclipse 會滿畫面紅字。用 IntelliJ 或 VS Code 的同學，通常已經內建，不用另外裝。
-->

---

# Lombok + @Qualifier：要記得把編號抄上去

在專案根目錄（和 `build.gradle` 同一層）建立 `lombok.config`：

```properties
config.stopBubbling = true
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier
```

<v-click>

設定好之後，`@Qualifier` 直接寫在變數上就可以：

```java
@RestController
@RequiredArgsConstructor
public class XiaoMingController {
    @Qualifier("canonPrinter")
    private final Printer printer;
}
```

</v-click>

<!--
Lombok 搭配 @Qualifier 的時候，有一個經典的坑。

剛剛說過，@Qualifier 要寫在清單，也就是建構子參數上，店員才會看。但現在清單是 Lombok 自動寫的，它預設不會把編號抄上去。

所以我們要建立一個叫 lombok.config 的檔案，放在專案根目錄。第一行的意思是「設定到這裡為止」；第二行最重要，意思是「寫清單的時候，把 @Qualifier 也一起抄上去」。

（下一步）設定好之後，@Qualifier 直接寫在變數上就可以了。Lombok 產生建構子時，會把它抄到參數上。

如果忘了設定這個檔案，就會出現：明明寫了 @Qualifier，還是報「找到兩個」的錯誤。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="程式" rows="printer,店裡有兩台印表機=code,同一種類有兩個 Bean|what,店員不知道給哪一台=code,報錯：required a single bean, but 2 were found|you,小明指名「canonPrinter 那台」=code,@Qualifier(&quot;canonPrinter&quot;)|doc,清單上的那一項寫上編號=code,建構子注入：寫在參數前面|clerk,自動寫清單的小幫手=code,Lombok：@RequiredArgsConstructor" />

<!--
我們用一張圖複習今天的內容。

（下一步）店裡有兩台印表機，就是同一種類有兩個 Bean。

（下一步）店員不知道給哪一台，就是 Spring 報錯：找到了兩個。

（下一步）小明指名 canonPrinter 那台，就是 @Qualifier。

（下一步）清單上的那一項寫上編號，就是建構子注入時，@Qualifier 寫在參數前面。

（下一步）自動寫清單的小幫手，就是 Lombok 的 @RequiredArgsConstructor。
-->

---

# 章節總結

<v-clicks>

- **問題**：同一種類有兩個 Bean，Spring 不知道給哪一個，啟動報錯
- **`@Qualifier`**：寫上 Bean 的名字（第一個字母小寫），指名要哪一個
- **寫在哪裡**：欄位注入寫在 `@Autowired` 下面；建構子注入寫在參數前面
- **Lombok**：`@RequiredArgsConstructor` 自動寫建構子；搭配 `@Qualifier` 時要設定 `lombok.config`

</v-clicks>

<v-click>

下一章：便利商店開店前，店員會先把機器開機、設定好。在 Spring 裡要怎麼做到？

</v-click>

<!--
最後整理今天的重點。

（下一步）問題是：同一種類有兩個 Bean，Spring 不知道給哪一個，啟動就報錯。

（下一步）解法是 @Qualifier，寫上 Bean 的名字，第一個字母小寫，指名要哪一個。

（下一步）寫在哪裡：欄位注入寫在 @Autowired 下面；建構子注入寫在參數前面。

（下一步）Lombok 的 @RequiredArgsConstructor 可以自動寫建構子；搭配 @Qualifier 的時候，記得設定 lombok.config。

（下一步）下一章，我們來看便利商店開店前會做的事：店員會先把機器開機、設定好。在 Spring 裡要怎麼做到？我們下一章見。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記住一個畫面就好：店裡有兩台印表機，小明要指名「canonPrinter 那台」。

有任何問題歡迎現在提出來。
-->
