import { Component, Injector, OnInit, afterNextRender, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  private route = inject(ActivatedRoute);
  private scroller = inject(ViewportScroller);
  private injector = inject(Injector);

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
          this.scrollAgain();
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

  // 菜單載入後畫面變長，網址有 #reservation 這類錨點的話，等畫面更新完再捲一次才會對準
  private scrollAgain(): void {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      afterNextRender(() => this.scroller.scrollToAnchor(fragment), { injector: this.injector });
    }
  }

  private showError(): void {
    this.loading = false;
    this.error = '目前無法連線，請稍後再試';
  }
}
