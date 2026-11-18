---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Dialog
routeAlias: ch42
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
    Angular Essentials
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Dialog
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「以對話框提示使用者執行特定操作或確認重要訊息」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們畫出了圓餅圖。這一章要學 Angular Material 的對話框元件：Dialog。

刪除前詢問「確定要刪除嗎」，或讓使用者填一小段資料，都會用到對話框。學完這一章，我們會建立 Dialog 元件，從主元件開啟它，把資料傳進去，並在關閉時把結果傳回來。
-->

---
layout: default
---

# Outline

- **Dialog 概念介紹**
- **Dialog 元件 HTML 結構**
- **Dialog 元件 TypeScript**
- **開啟 Dialog（呼叫端）**
- **設定 Dialog 尺寸**
- **實作練習**

<!--
這一章會先介紹 Dialog 的概念和使用情境，接著拆成三部分來看：Dialog 元件的 HTML 結構、它的 TypeScript 邏輯，以及呼叫端怎麼開啟它。然後補充怎麼設定 Dialog 的尺寸，最後做一個完整的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Dialog 概念介紹

<!--
我們先了解 Dialog 是什麼，以及什麼時候會用到它。
-->

---

# Dialog 是什麼？

Dialog（對話框）用來提醒使用者執行特定操作，或顯示重要的提示訊息。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**常見使用情境**

- 顯示確認訊息（如「確定刪除？」）
- 收集使用者輸入（如輸入框、選項）
- 展示警告或通知內容

</div>
<div>

**Angular Material 提供**

- `MatDialog` 服務：用於開啟對話框
- `MatDialogRef`：用於控制對話框（關閉、回傳資料）
- `MAT_DIALOG_DATA`：注入外部傳入的資料

</div>
</div>

<img src="/images/42-dialog/dialog-overview-example.png" class="rounded shadow-md max-h-56 mx-auto mt-2" />

<!--
Dialog，也就是對話框，是一個蓋在畫面最上層的視窗，用來提醒使用者執行特定操作，或顯示重要的訊息。

常見的使用情境有三種：顯示確認訊息，例如確定刪除嗎；收集使用者的輸入，例如一個小表單；以及顯示警告或通知。

Angular Material 提供了三個核心工具。`MatDialog` 是用來開啟對話框的服務。`MatDialogRef` 用來控制對話框，例如關閉它、回傳資料。`MAT_DIALOG_DATA` 則用來接收從外部傳進來的資料。這三個名稱先有個印象，等一下都會用到。
-->

---

# Dialog 的兩種用途

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**單純顯示提示內容**

Dialog 可僅顯示標題與訊息，搭配一個確認按鈕。

<img src="/images/42-dialog/dialog-simple-alert.png" class="rounded shadow-md max-h-52 mt-2" />

</div>
<div>

**包含輸入框或選項**

Dialog 內可放置輸入框（`mat-form-field`）或勾選框，供使用者填寫後回傳。

<img src="/images/42-dialog/dialog-with-input.png" class="rounded shadow-md max-h-52 mt-2" />

</div>
</div>

<!--
Dialog 大致有兩種用途。

第一種是單純顯示提示，例如「操作成功」，通常只有標題、訊息和一個確認按鈕。

第二種是裡面放了輸入框或勾選框，讓使用者填完資料再送出，這種就需要把輸入的內容傳回給呼叫端。

接下來的範例，會以比較完整的第二種為主。學會之後，單純顯示訊息的版本自然也就會了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Dialog 元件 HTML 結構

<!--
接下來，我們看 Dialog 元件的 HTML 怎麼寫。Angular Material 規定了幾個固定的標籤和屬性。
-->

---

# Dialog HTML 結構

Dialog 的畫面由一個獨立的 Angular 元件（Component）提供，需使用 Angular Material 提供的三個指令來定義區塊。

| 指令 / 選擇器 | 用途 |
| --- | --- |
| `mat-dialog-title` | 標記對話框標題（屬性形式，加在 `h2` 上） |
| `<mat-dialog-content>` | 對話框的主要內容區域 |
| `<mat-dialog-actions>` | 對話框底部的操作按鈕區域 |

<!--
Dialog 的畫面其實就是一個普通的 Angular 元件，只是要依照 Angular Material 的規定，把內容分成三個區塊。

`mat-dialog-title` 標記對話框的標題，是一個屬性，通常加在 `h2` 上。`mat-dialog-content` 包住主要的內容。`mat-dialog-actions` 放底部的操作按鈕，例如取消和確定。

可以把這三個想成房子裡固定的隔間，標題、內容、按鈕各有各的位置，Angular Material 會依照這個結構套用樣式。
-->

---

# Dialog HTML 結構 — 範例

```html
<!-- dialog 元件的 HTML 檔案 -->
<h2 mat-dialog-title>標題</h2>

<!-- dialog 內容 -->
<mat-dialog-content>
  <p>訊息</p>
</mat-dialog-content>

<!-- dialog 按鈕 -->
<mat-dialog-actions>
  <button (click)="onNoClick()">取消</button>
  <button>確定</button>
</mat-dialog-actions>
```

- `(click)="onNoClick()"` 綁定取消按鈕，呼叫下一節定義的 `onNoClick()` 關閉對話框
- `mat-dialog-actions` 底下也可用 `mat-dialog-close` 屬性直接關閉，不一定要另外寫方法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>mat-dialog-title</code> 為 HTML 屬性（Attribute Directive），套用在現有標籤上；<code>mat-dialog-content</code> 與 <code>mat-dialog-actions</code> 為元素（Element Directive）。
</div>

<!--
我們看一個完整的 HTML 範例。

`h2` 上加了 `mat-dialog-title` 屬性，接著用 `mat-dialog-content` 包住訊息，最後的 `mat-dialog-actions` 放了取消和確定兩個按鈕。

取消按鈕用小括號 `click` 綁定 `onNoClick`，這個方法等一下會在 TypeScript 定義，按下去就會關閉對話框。另外，按鈕也可以直接加上 `mat-dialog-close` 屬性來關閉，不一定要另外寫方法。

要注意，`mat-dialog-title` 是屬性，要加在已經存在的標籤上；`mat-dialog-content` 和 `mat-dialog-actions` 則是元素，本身就是標籤，兩者不能寫錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Dialog 元件 TypeScript

<!--
HTML 結構看完了，接下來看 Dialog 元件的 TypeScript。
-->

---

# Dialog 元件 TS — 匯入模組（一）

Dialog 元件需匯入所需的 Angular Material 模組與核心 API。

```typescript
import { FormsModule } from '@angular/forms';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
```

<!--
先看檔案開頭要匯入的東西。

`FormsModule` 用來處理輸入框的雙向綁定。接著從 `@angular/material/dialog` 匯入 `MatDialogTitle`、`MatDialogContent` 和 `MatDialogActions`，對應 HTML 裡用到的三個區塊；另外還有等一下會用到的 `MatDialogRef` 和 `MAT_DIALOG_DATA`。

因為 Dialog 元件是獨立元件，HTML 裡用到的每個 Material 指令，都要記得匯入，否則畫面會顯示不出來或報錯。
-->

---

# Dialog 元件 TS — 匯入模組（二）

在 `@Component` 裝飾器的 `imports` 陣列中宣告所使用的模組。

```typescript
@Component({
  selector: 'dialog-example',
  templateUrl: './dialog.html',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class DialogExample {
  // 類別內容見下頁
}
```

<!--
匯入之後，還要在 `@Component` 的 `imports` 陣列裡，把這些模組再宣告一次。

這跟之前學過的獨立元件規則一樣：匯入之後，還要告訴這個元件「我要使用它們」。
-->

---

# Dialog 元件 TS — 注入 DialogRef 與 Data

`MatDialogRef` 用於控制對話框本身（如關閉）；`MAT_DIALOG_DATA` 用於接收開啟時傳入的資料。

```typescript
export class DialogExample {
  readonly dialogRef = inject(MatDialogRef<DialogExample>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
}
```

| 注入項目 | 說明 |
| --- | --- |
| `MatDialogRef<T>` | 代表當前對話框的參考，可呼叫 `close()` 關閉並回傳資料 |
| `MAT_DIALOG_DATA` | 接收呼叫端透過 `open()` 傳入的 `data` 物件 |

<!--
這一頁是 Dialog 元件的關鍵：怎麼取得控制自己的能力，以及外面傳進來的資料。

用 `inject(MatDialogRef)` 取得的 `dialogRef`，可以想成 Dialog 手上的遙控器，用來控制自己什麼時候關閉。用 `inject` 搭配 `MAT_DIALOG_DATA` 取得的 `data`，就是呼叫端開啟 Dialog 時傳進來的資料。

要注意，`MAT_DIALOG_DATA` 不是一個類別，而是一個識別用的標記，所以寫法跟一般注入服務不太一樣，要用 `inject` 加上它。
-->

---

# Dialog 元件 TS — 關閉對話框

呼叫 `dialogRef.close()` 關閉對話框，並可在括號內傳入回傳資料。

```typescript
onNoClick(): void {
  const returnData = ['ada', 'adadas'];
  this.dialogRef.close(returnData);
}
```

| 方法 | 說明 |
| --- | --- |
| `dialogRef.close()` | 關閉對話框，不回傳任何值 |
| `dialogRef.close(value)` | 關閉對話框並回傳指定資料給呼叫端 |

<!--
這頁示範怎麼關閉對話框。

呼叫 `this.dialogRef.close()` 就會關閉對話框。如果括號裡帶了資料，這份資料就會傳回給開啟 Dialog 的元件。這裡的 `onNoClick` 把一個陣列傳回去。

可以想成填完表單投進信箱，Dialog 關閉的同時，也把內容寄回給呼叫端。如果只是要關閉，不需要回傳資料，直接呼叫 `close()` 不帶參數就可以了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 開啟 Dialog（呼叫端）

<!--
Dialog 元件寫好了，接下來換個角度，看看要開啟這個對話框的呼叫端該怎麼寫。
-->

---

# 開啟 Dialog — 注入 MatDialog

在需要開啟對話框的元件（呼叫端）注入 `MatDialog` 服務。

```typescript
import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { DialogExample } from './dialog-example';

@Component({ ... })
export class AppComponent {
  readonly dialog = inject(MatDialog);
}
```

<!--
要開啟 Dialog，呼叫端的元件要先注入 `MatDialog` 服務。

寫法跟之前注入其他服務一樣，用 `inject(MatDialog)` 就能取得。另外也要匯入剛才寫好的 Dialog 元件，等一下開啟時會用到。

記住，要開啟 Dialog，第一步就是注入 `MatDialog`。
-->

---

# 開啟 Dialog — HTML 觸發按鈕

呼叫端的 HTML 需要一個按鈕（或其他事件），透過 `(click)` 綁定呼叫 TypeScript 裡開啟 Dialog 的方法。

```html
<button (click)="showDialog()">開啟 Dialog</button>
```

- `(click)="showDialog()"` 綁定按鈕點擊事件，呼叫下一頁定義的 `showDialog()` 方法
- 沒有觸發元素的話，`dialog.open()` 永遠不會被執行，畫面上也就看不到任何反應

<!--
光是注入還不夠，還需要一個東西來觸發它。最常見的做法，是在 HTML 放一個按鈕，用小括號 `click` 綁定到 `showDialog` 方法。

`dialog.open()` 跟一般的方法一樣，一定要有事件觸發才會執行。沒有觸發的元素，畫面上就不會有任何反應。除了按鈕，也可以用選單項目或圖示來觸發。
-->

---

# 開啟 Dialog — 呼叫 open()（一）

使用 `dialog.open()` 開啟對話框，第一個參數為 Dialog 元件類別，第二個參數為設定物件。

```typescript
showDialog() {
  // 開啟 dialog，open() 第一個參數放 Dialog 元件類別
  // 第二個參數放設定物件，data 為傳入 Dialog 的資料
  const dialogRef = this.dialog.open(DialogExample, {
    data: { name: 'name', animal: 'title' },
  });
}
```

<!--
我們看 `dialog.open()` 怎麼呼叫。

第一個參數是要開啟的 Dialog 元件類別，也就是剛才寫的 `DialogExample`。第二個參數是設定物件，裡面的 `data` 就是要傳進 Dialog 的資料，Dialog 元件會用 `MAT_DIALOG_DATA` 收到它。

可以想成寄快遞：第一個參數決定送到哪一個 Dialog，第二個參數的 `data` 就是包裹的內容。

執行之後，畫面上會跳出對話框，裡面可以拿到我們傳入的 name 和 animal。
-->

---

# 開啟 Dialog — 接收回傳值（二）

`afterClosed()` 回傳一個 Observable，訂閱後可取得 Dialog 關閉時回傳的資料。

```typescript
showDialog() {
  const dialogRef = this.dialog.open(DialogExample, {
    data: { name: 'name', animal: 'title' },
  });

  // 當 dialog 關閉後觸發，並取得回傳的內容
  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
  });
}
```

| 方法 | 說明 |
| --- | --- |
| `dialog.open(Component, config)` | 開啟指定元件作為對話框 |
| `dialogRef.afterClosed()` | 回傳 Observable，dialog 關閉後發出回傳值 |

<!--
對話框開啟了，那要怎麼知道使用者在裡面填了什麼？答案是 `afterClosed()`。

`open()` 會回傳一個 `dialogRef`。呼叫它的 `afterClosed()`，會得到一個 Observable，訂閱之後，等 Dialog 關閉的那一刻，就會收到 Dialog 裡呼叫 `close()` 時傳出來的資料，也就是這裡的 `result`。

就像在門外等朋友辦完事出來，朋友出來的時候，就會把東西交給我們。

跟呼叫 API 時一樣，`afterClosed()` 一定要 `subscribe`，才會真正拿到值。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 設定 Dialog 尺寸

<!--
最後一個部分，我們看怎麼調整 Dialog 的寬度和高度。
-->

---

# 設定 Dialog 的寬度與高度

在 `open()` 的設定物件中，透過 `width` 與 `height` 屬性指定對話框的尺寸（字串格式）。

```typescript
const dialogRef = this.dialog.open(DialogComponent, {
  width: '500px',
  height: '300px',
});
```

| 設定屬性 | 型別 | 說明 |
| --- | --- | --- |
| `width` | `string` | 設定 Dialog 寬度，例如 `'500px'`、`'80vw'` |
| `height` | `string` | 設定 Dialog 高度，例如 `'300px'`、`'60vh'` |
| `data` | `any` | 傳入 Dialog 元件的資料，透過 `MAT_DIALOG_DATA` 接收 |

<!--
預設情況下，Dialog 會依照內容自動決定大小。如果想固定尺寸，可以在 `open()` 的設定物件裡加上 `width` 和 `height`。

值要用字串的格式，可以用像素，例如 500px，也可以用 vw、vh 這類相對單位。如果直接寫數字 500，是不會生效的。

表格最後一列的 `data`，則是不論有沒有設定尺寸，都可以一起傳入。
-->

---
layout: default
---

# 練習：建立 Dialog 對話框
### 任務說明

建立一個包含輸入框的 Dialog，從主元件開啟後，使用者填入資料並按確認，主元件印出回傳值。

1. 建立 `dialog-form` 元件作為 Dialog 內容
2. Dialog HTML 使用 `mat-dialog-title`、`<mat-dialog-content>`、`<mat-dialog-actions>`
3. Dialog TS 注入 `MatDialogRef` 與 `MAT_DIALOG_DATA`
4. 主元件注入 `MatDialog`，呼叫 `dialog.open()` 傳入資料
5. 訂閱 `afterClosed()`，將回傳值印至 console

<!--
我們把這一章的內容整合起來，做一個練習。

請建立一個有輸入框的 Dialog。從主元件開啟它，使用者填入資料並按下確定之後，主元件把回傳的值印出來。

步驟有五個：建立 `dialog-form` 元件；HTML 使用三個 Dialog 區塊；TypeScript 注入 `MatDialogRef` 和 `MAT_DIALOG_DATA`；主元件注入 `MatDialog`，用 `open()` 傳入資料；最後訂閱 `afterClosed()`，把回傳值印到 Console。

想一想，資料怎麼從呼叫端傳進 Dialog，又怎麼從 Dialog 傳回呼叫端？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 提示說明

1. Dialog 元件的 `imports` 陣列需加入 `MatDialogTitle`、`MatDialogContent`、`MatDialogActions`
2. 使用 `inject(MAT_DIALOG_DATA)` 取得外部傳入資料，使用 `inject(MatDialogRef)` 取得對話框參考
3. 確認按鈕呼叫 `this.dialogRef.close(returnValue)` 回傳資料
4. 呼叫端以 `this.dialog.open(DialogFormComponent, { data: { ... } })` 開啟
5. `dialogRef.afterClosed().subscribe(result => { ... })` 接收回傳值

<!--
我們來看解題提示。

第一，Dialog 元件的 `imports` 要加入三個 Dialog 區塊的指令。第二，用 `inject(MAT_DIALOG_DATA)` 取得傳入的資料，用 `inject(MatDialogRef)` 取得對話框的參考。第三，確定按鈕呼叫 `close`，並帶入要回傳的值。第四，呼叫端用 `dialog.open` 開啟，並傳入 `data`。第五，用 `afterClosed().subscribe` 接收回傳值。

最常漏掉的，是 `imports` 忘了加 Dialog 的指令，或 `MAT_DIALOG_DATA` 的注入方式寫錯。
-->

---
layout: default
---

# 完整解答 — Dialog HTML

`dialog-form.html` 完整內容：

```html
<h2 mat-dialog-title>{{ data.animal }}</h2>

<mat-dialog-content>
  <p>請輸入 {{ data.name }}</p>
  <mat-form-field>
    <mat-label>{{ data.name }}</mat-label>
    <input matInput [(ngModel)]="inputValue" />
  </mat-form-field>
</mat-dialog-content>

<mat-dialog-actions>
  <button mat-button (click)="onNoClick()">取消</button>
  <button mat-button (click)="onSubmit()">確定</button>
</mat-dialog-actions>
```

<!--
我們看完整的解答，先看 Dialog 的 HTML。

標題直接顯示呼叫端傳進來的 `data.animal`。內容區放了一個輸入框，用 `ngModel` 雙向綁定 `inputValue`。底部兩個按鈕，分別呼叫取消的 `onNoClick` 和確定的 `onSubmit`。
-->

---
layout: default
---

# 完整解答 — Dialog TypeScript（一）

`dialog-form.ts` 完整內容：

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
```

<!--
接著是 Dialog 的 TypeScript，先看匯入。

`FormsModule`、`MatFormFieldModule`、`MatInputModule` 和 `MatButtonModule`，是輸入框和按鈕需要的模組。另外匯入三個 Dialog 區塊的指令，以及 `MatDialogRef` 和 `MAT_DIALOG_DATA`。
-->

---
layout: default
---

# 完整解答 — Dialog TypeScript（二）

```typescript
@Component({
  selector: 'dialog-form',
  templateUrl: './dialog-form.html',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class DialogFormComponent {
```

<!--
接著是 `@Component` 的設定。

`imports` 陣列要把剛才匯入的模組全部宣告一次，這是獨立元件的規則。class 的內容在下一頁。
-->

---
layout: default
---

# 完整解答 — Dialog TypeScript（三）

```typescript
  readonly dialogRef = inject(MatDialogRef<DialogFormComponent>);
  readonly data = inject<{ name: string; animal: string }>(MAT_DIALOG_DATA);

  inputValue = '';

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.inputValue);
  }
}
```

<!--
這頁是 class 的內容。

注入 `MatDialogRef` 和 `MAT_DIALOG_DATA`，這裡 `data` 的型別寫成有 name 和 animal 的物件。`inputValue` 綁定畫面上的輸入框。

按下取消，呼叫 `close()` 不帶值；按下確定，呼叫 `close`，並帶入 `this.inputValue`，把使用者輸入的內容回傳給呼叫端。
-->

---
layout: default
---

# 完整解答 — 呼叫端 TypeScript（一）

`app.component.ts` 完整內容：

```typescript
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogFormComponent } from './dialog-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly dialog = inject(MatDialog);
```

<!--
接著是呼叫端的 TypeScript。

匯入 `MatDialog` 服務和剛才寫好的 `DialogFormComponent`。`imports` 只需要 `MatButtonModule`，因為這個元件的 HTML 只用到按鈕。class 裡先注入 `MatDialog`，方法在下一頁。
-->

---
layout: default
---

# 完整解答 — 呼叫端 TypeScript（二）

```typescript
  showDialog() {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '400px',
      data: { name: '姓名', animal: '請輸入資料' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('使用者輸入：', result);
    });
  }
}
```

```html
<!-- app.component.html -->
<button mat-raised-button (click)="showDialog()">開啟 Dialog</button>
```

<!--
最後是 `showDialog` 方法和呼叫端的 HTML。

`showDialog` 呼叫 `open`，傳入 `DialogFormComponent`，並設定寬度 400px 和 `data`。接著訂閱 `afterClosed()`，使用者按下確定時，Console 就會印出剛才輸入的值；按下取消的話，`result` 會是 undefined。

HTML 裡的按鈕用小括號 `click` 呼叫 `showDialog`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充練習
# Extra Practice

<!--
接下來是幾題補充練習，把這一章學到的內容再動手練一次。
-->

---
layout: default
---

# 補充練習 1–2：確認刪除彈窗與寬度設定

**練習 1：確認刪除彈窗**

1. 建立新元件 `ConfirmDialog`
2. 標題 `mat-dialog-title` 為「警告」，內容為「您確定要永久刪除此筆寵物資料嗎？」
3. 「取消」按鈕執行 `this.dialogRef.close(false)`，「確定」按鈕執行 `this.dialogRef.close(true)`
4. 從主頁面開啟它，在 `afterClosed()` 的訂閱中判斷：`result === true` 時 `alert('資料已刪除')`

**練習 2：沒有設定寬度會怎樣？**

在彈窗內容塞入一長串文字，開啟時故意不傳第二個參數（不給 `width`），觀察畫面；再加上 `width: '600px'` 比較差異。

<!--
接下來兩題補充練習。

第一題，做一個確認刪除的彈窗：按取消回傳 false，按確定回傳 true，主頁面依照回傳值決定要不要刪除。

第二題，比較有沒有設定 `width` 的差別。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```html
<!-- confirm-dialog.component.html -->
<h2 mat-dialog-title>警告</h2>
<mat-dialog-content>您確定要永久刪除此筆寵物資料嗎？</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button (click)="dialogRef.close(false)">取消</button>
  <button mat-button (click)="dialogRef.close(true)">確定</button>
</mat-dialog-actions>
```

```typescript
// 主頁面
openConfirm() {
  const dialogRef = this.dialog.open(ConfirmDialog, { width: '600px' });
  dialogRef.afterClosed().subscribe((result) => {
    if (result === true) {
      alert('資料已刪除');
    }
  });
}
```

<!--
我們來看答案。

彈窗的兩個按鈕，都是呼叫 `dialogRef.close`，只是帶回的值不同。主頁面訂閱 `afterClosed`，拿到的 `result` 就是這個值，等於 true 才執行刪除。如果使用者按 Esc 或點背景關閉，`result` 會是 undefined，同樣不會刪除。

第二題，沒有設定寬度時，彈窗的寬度由內容決定，長文字可能讓版面很難閱讀。加上 `width` 之後，就能固定彈窗的寬度。
-->

---
layout: default
---

# 補充練習 3：彈窗修改庫存數量

實作「點擊彈窗更新欄位資料」的功能：

1. 主頁面用 `this.dialog.open` 開啟彈窗，透過 `data: { count: 50 }` 傳入目前庫存
2. 彈窗用 `inject(MAT_DIALOG_DATA)` 接收資料
3. 彈窗 HTML 建立數字輸入框：`<input type="number" [(ngModel)]="data.count">`
4. 點「確定」時執行 `this.dialogRef.close(this.data.count)`
5. 主頁面在 `afterClosed()` 中，把畫面上的庫存更新為回傳的數字

<!--
第三題補充練習，把資料傳進彈窗、修改後再傳回來。

主頁面開啟時，用 `data` 把庫存量傳進去；彈窗裡用輸入框修改；按確定時，把新的數字透過 `close` 傳回主頁面，主頁面再更新畫面。

我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.9
layout: default
---

# 補充練習 3：彈窗修改庫存數量 — 參考答案

```typescript
// stock-dialog.component.ts
readonly dialogRef = inject(MatDialogRef<StockDialog>);
readonly data = inject<{ count: number }>(MAT_DIALOG_DATA);

confirm() {
  this.dialogRef.close(this.data.count);
}
```

```html
<input type="number" [(ngModel)]="data.count">
<button mat-button (click)="confirm()">確定</button>
```

```typescript
// 主頁面
stock: number = 50;

openStock() {
  const dialogRef = this.dialog.open(StockDialog, { data: { count: this.stock } });
  dialogRef.afterClosed().subscribe((result) => {
    if (result !== undefined) {
      this.stock = result;
    }
  });
}
```

<!--
我們來看答案。

彈窗用 `inject` 取得 `dialogRef` 和 `data`，輸入框用 `ngModel` 直接綁定 `data.count`，`confirm` 把修改後的數字傳回去。

主頁面在 `afterClosed` 拿到結果後更新 `stock`。這裡多判斷了 `result` 不是 undefined，因為使用者如果沒按確定、直接關掉彈窗，就不會帶回數字，庫存應該維持原樣。
-->

---
layout: end
---

# 課程結束
### 善用 Dialog 服務，讓使用者確認與輸入的流程更加清楚一致

<!--
這一章我們學了 Dialog 的完整流程。Dialog 是一個獨立的元件，畫面由標題、內容和按鈕三個區塊組成。元件內用 `MatDialogRef` 控制關閉並回傳資料，用 `MAT_DIALOG_DATA` 取得外部傳入的資料。呼叫端注入 `MatDialog`，用 `open()` 開啟並傳入資料，再訂閱 `afterClosed()` 取得結果。

這套「開啟、傳入、接收」的模式，之後做確認視窗或小表單時都會用到。

下一章，我們會學習同步與非同步的觀念。我們下一章見。
-->
