import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';

import { AuthService } from './auth.service';
import { Cart, CartItem, GuestCartItem, ProductDetail, Variant } from './models';
import { ShopApiService } from './shop-api.service';

const GUEST_KEY = 'cafe-shop-guest-cart';
export const FREE_SHIPPING = 1000;
export const SHIPPING_FEE = 80;
export const MAX_QUANTITY = 10;

// 購物車狀態（Signals）：訪客存在 localStorage，登入後以後端為準
@Injectable({ providedIn: 'root' })
export class CartService {
  private api = inject(ShopApiService);
  private auth = inject(AuthService);

  private serverCart = signal<Cart | null>(null);
  private guestItems = signal<GuestCartItem[]>(this.loadGuest());

  // 畫面用的購物車：登入看後端、沒登入看 localStorage
  readonly cart = computed<Cart>(() => {
    if (this.auth.isLoggedIn()) {
      return this.serverCart() ?? { items: [], itemsAmount: 0, shippingFee: 0, totalAmount: 0, freeShippingGap: FREE_SHIPPING };
    }
    return this.guestCart(this.guestItems());
  });

  // 導覽列的購物車數字
  readonly count = computed(() => this.cart().items.reduce((sum, i) => sum + i.quantity, 0));

  // 登入後呼叫：有訪客購物車就合併，沒有就重新讀取
  refresh(): Observable<Cart> {
    if (!this.auth.isLoggedIn()) {
      return of(this.cart());
    }
    const guest = this.guestItems();
    const request = guest.length > 0 ? this.api.mergeCart(guest) : this.api.cart();
    return request.pipe(tap((cart) => {
      this.serverCart.set(cart);
      this.clearGuest();
    }));
  }

  add(product: ProductDetail, variant: Variant, quantity: number): Observable<Cart> {
    if (this.auth.isLoggedIn()) {
      return this.api.addToCart(variant.id, quantity).pipe(tap((c) => this.serverCart.set(c)));
    }
    const items = [...this.guestItems()];
    const found = items.find((i) => i.variantId === variant.id);
    const total = quantity + (found?.quantity ?? 0);
    if (total > MAX_QUANTITY) {
      throw new Error(`每個規格最多 ${MAX_QUANTITY} 件`);
    }
    if (total > variant.stock) {
      throw new Error(`庫存不足，剩 ${variant.stock} 件`);
    }
    if (found) {
      found.quantity = total;
    } else {
      items.push({
        variantId: variant.id, quantity, productId: product.id, productName: product.name,
        variantName: variant.name, imageUrl: product.imageUrl, price: variant.price, stock: variant.stock,
      });
    }
    this.saveGuest(items);
    return of(this.cart());
  }

  update(variantId: number, quantity: number): Observable<Cart> {
    if (this.auth.isLoggedIn()) {
      return this.api.updateCart(variantId, quantity).pipe(tap((c) => this.serverCart.set(c)));
    }
    this.saveGuest(this.guestItems().map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
    return of(this.cart());
  }

  remove(variantId: number): Observable<Cart> {
    if (this.auth.isLoggedIn()) {
      return this.api.removeFromCart(variantId).pipe(tap((c) => this.serverCart.set(c)));
    }
    this.saveGuest(this.guestItems().filter((i) => i.variantId !== variantId));
    return of(this.cart());
  }

  // 下單成功後後端已清空購物車
  clearAfterOrder(): void {
    this.serverCart.set(null);
  }

  // 登出時清掉畫面上的後端購物車
  reset(): void {
    this.serverCart.set(null);
  }

  private guestCart(items: GuestCartItem[]): Cart {
    const list: CartItem[] = items.map((i) => ({ ...i, subtotal: i.price * i.quantity }));
    const itemsAmount = list.reduce((sum, i) => sum + i.subtotal, 0);
    const shippingFee = itemsAmount === 0 || itemsAmount >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    return {
      items: list, itemsAmount, shippingFee, totalAmount: itemsAmount + shippingFee,
      freeShippingGap: Math.max(FREE_SHIPPING - itemsAmount, 0),
    };
  }

  private saveGuest(items: GuestCartItem[]): void {
    this.guestItems.set(items);
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  }

  private clearGuest(): void {
    this.guestItems.set([]);
    localStorage.removeItem(GUEST_KEY);
  }

  private loadGuest(): GuestCartItem[] {
    try {
      return JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
