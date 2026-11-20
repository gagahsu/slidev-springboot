import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { errorMessage } from '../../core/error-message';
import { Category, Page, ProductSummary } from '../../core/models';
import { ShopApiService } from '../../core/shop-api.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule,
    MatProgressSpinnerModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private api = inject(ShopApiService);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  result = signal<Page<ProductSummary> | null>(null);
  loading = signal(false);
  error = signal('');

  categoryId = new FormControl<number | null>(null);
  keyword = new FormControl('', { nonNullable: true });
  sort = new FormControl('', { nonNullable: true });
  page = 0;

  ngOnInit(): void {
    this.api.categories().subscribe((c) => this.categories.set(c));
    const fromUrl = this.route.snapshot.queryParamMap.get('categoryId');
    if (fromUrl) {
      this.categoryId.setValue(Number(fromUrl));
    }
    // 即時搜尋：停止輸入 300ms 後才查，而且內容有變才查（Angular ch37）
    this.keyword.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.search(0));
    this.categoryId.valueChanges.subscribe(() => this.search(0));
    this.sort.valueChanges.subscribe(() => this.search(0));
    this.search(0);
  }

  onPage(e: PageEvent): void {
    this.search(e.pageIndex);
  }

  private search(page: number): void {
    this.page = page;
    this.loading.set(true);
    this.error.set('');
    this.api.products({
      categoryId: this.categoryId.value, keyword: this.keyword.value, sort: this.sort.value, page, size: 12,
    }).subscribe({
      next: (r) => { this.result.set(r); this.loading.set(false); },
      error: (e) => { this.error.set(errorMessage(e)); this.loading.set(false); },
    });
  }
}
