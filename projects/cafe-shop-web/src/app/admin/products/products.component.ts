import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { AdminApiService } from '../../core/admin-api.service';
import { errorMessage } from '../../core/error-message';
import { ImgUrlPipe } from '../../core/img-url.pipe';
import { Category, Page, ProductSummary } from '../../core/models';

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule, RouterLink, CurrencyPipe, ImgUrlPipe, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './products.component.html',
})
export class AdminProductsComponent implements OnInit {
  private api = inject(AdminApiService);
  private snack = inject(MatSnackBar);
  columns = ['image', 'name', 'category', 'price', 'status', 'actions'];
  categories = signal<Category[]>([]);
  result = signal<Page<ProductSummary> | null>(null);
  status = '';
  categoryId: number | null = null;
  keyword = '';

  ngOnInit(): void {
    this.api.categories().subscribe((c) => this.categories.set(c));
    this.load(0);
  }

  load(page: number): void {
    this.api.products({ status: this.status, categoryId: this.categoryId, keyword: this.keyword, page, size: 10 })
      .subscribe((r) => this.result.set(r));
  }

  onPage(e: PageEvent): void {
    this.load(e.pageIndex);
  }

  toggle(p: ProductSummary, onSale: boolean): void {
    this.api.changeStatus(p.id, onSale ? 'ON_SALE' : 'OFF_SHELF').subscribe({
      next: () => this.load(this.result()?.page ?? 0),
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }
}
