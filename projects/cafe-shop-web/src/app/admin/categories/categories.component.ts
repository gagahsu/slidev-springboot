import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminApiService } from '../../core/admin-api.service';
import { errorMessage } from '../../core/error-message';
import { Category } from '../../core/models';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1>分類管理</h1>
    <table class="data">
      <thead><tr><th>名稱</th><th>排序</th><th></th></tr></thead>
      <tbody>
        @for (c of categories(); track c.id) {
          <tr>
            <td><input [(ngModel)]="c.name" /></td>
            <td><input type="number" [(ngModel)]="c.sortOrder" class="short" /></td>
            <td><button mat-button (click)="save(c)">儲存</button></td>
          </tr>
        }
        <tr>
          <td><input [(ngModel)]="newName" placeholder="新分類名稱" /></td>
          <td><input type="number" [(ngModel)]="newSort" class="short" /></td>
          <td><button mat-flat-button (click)="create()" [disabled]="!newName.trim()">新增</button></td>
        </tr>
      </tbody>
    </table>
  `,
})
export class CategoriesComponent implements OnInit {
  private api = inject(AdminApiService);
  private snack = inject(MatSnackBar);
  categories = signal<Category[]>([]);
  newName = '';
  newSort = 0;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.categories().subscribe((c) => this.categories.set(c.map((x) => ({ ...x }))));
  }

  save(c: Category): void {
    this.api.updateCategory(c.id, { name: c.name, sortOrder: c.sortOrder }).subscribe({
      next: () => { this.snack.open('已儲存', '關閉', { duration: 2000 }); this.load(); },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }

  create(): void {
    this.api.createCategory({ name: this.newName, sortOrder: this.newSort }).subscribe({
      next: () => { this.newName = ''; this.newSort = 0; this.load(); },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }
}
