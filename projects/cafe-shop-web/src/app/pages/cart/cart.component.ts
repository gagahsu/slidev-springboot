import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { CartService, MAX_QUANTITY } from '../../core/cart.service';
import { errorMessage } from '../../core/error-message';
import { ImgUrlPipe } from '../../core/img-url.pipe';
import { CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe, ImgUrlPipe, MatButtonModule, MatIconModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cartService = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  cart = this.cartService.cart;

  options(item: CartItem): number[] {
    const max = Math.min(MAX_QUANTITY, Math.max(item.stock, item.quantity));
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  change(item: CartItem, value: string): void {
    this.cartService.update(item.variantId, Number(value)).subscribe({ error: (e) => this.toast(e) });
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.variantId).subscribe({ error: (e) => this.toast(e) });
  }

  // 結帳前要登入；守衛會帶 returnUrl，登入後回到結帳頁
  checkout(): void {
    this.router.navigate([this.auth.isLoggedIn() ? '/checkout' : '/login'],
      this.auth.isLoggedIn() ? {} : { queryParams: { returnUrl: '/checkout' } });
  }

  private toast(e: unknown): void {
    this.snack.open(errorMessage(e), '關閉', { duration: 3000 });
  }
}
