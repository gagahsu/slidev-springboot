import { Component, OnInit, inject } from '@angular/core';

import { Category, Product } from '../../models';
import { CafeApiService } from '../../services/cafe-api.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  private api = inject(CafeApiService);

  categories: Category[] = [];
  products: Product[] = [];
  selectedId = 0;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (cats) => this.api.getProducts().subscribe({
        next: (data) => {
          this.products = data;
          // 只留下有品項的分類，預設選第一個
          this.categories = cats.filter((c) => data.some((p) => p.categoryId === c.id));
          this.selectedId = this.categories[0]?.id ?? 0;
          this.loading = false;
        },
        error: () => this.showError(),
      }),
      error: () => this.showError(),
    });
  }

  // 目前選中分類的品項
  get shown(): Product[] {
    return this.products.filter((p) => p.categoryId === this.selectedId);
  }

  private showError(): void {
    this.loading = false;
    this.error = '目前無法連線，請稍後再試';
  }
}
