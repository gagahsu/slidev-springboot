import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { CartService, MAX_QUANTITY } from '../../core/cart.service';
import { errorMessage } from '../../core/error-message';
import { ImgUrlPipe } from '../../core/img-url.pipe';
import { ProductDetail } from '../../core/models';
import { ShopApiService } from '../../core/shop-api.service';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, RouterLink, CurrencyPipe, ImgUrlPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private api = inject(ShopApiService);
  private cart = inject(CartService);
  private snack = inject(MatSnackBar);

  id = input.required<string>(); // 路由參數 :id（withComponentInputBinding）
  product = signal<ProductDetail | null>(null);
  error = signal('');
  variantId = signal<number | null>(null);
  quantity = 1;
  max = MAX_QUANTITY;

  // 選不同規格時，價格與庫存跟著變
  variant = computed(() => this.product()?.variants.find((v) => v.id === this.variantId()) ?? null);

  ngOnInit(): void {
    this.api.product(Number(this.id())).subscribe({
      next: (p) => {
        this.product.set(p);
        const first = p.variants.find((v) => v.stock > 0) ?? p.variants[0];
        this.variantId.set(first?.id ?? null);
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  addToCart(): void {
    const p = this.product();
    const v = this.variant();
    if (!p || !v) {
      return;
    }
    try {
      this.cart.add(p, v, this.quantity).subscribe({
        next: () => this.snack.open(`已加入購物車：${p.name} ${v.name} x${this.quantity}`, '關閉', { duration: 2500 }),
        error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
      });
    } catch (e) {
      this.snack.open((e as Error).message, '關閉', { duration: 3000 }); // 訪客購物車的檢查
    }
  }
}
