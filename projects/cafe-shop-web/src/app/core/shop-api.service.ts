import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API } from './config';
import {
  AppResponse, Cart, Category, CheckoutRequest, EcpayForm, GuestCartItem, OrderDetail, OrderSummary,
  Page, ProductDetail, ProductSummary, User,
} from './models';

// 前台用的 API（AppResponse 的 data 拆出來再交給元件）
@Injectable({ providedIn: 'root' })
export class ShopApiService {
  private http = inject(HttpClient);

  categories(): Observable<Category[]> {
    return this.http.get<AppResponse<Category[]>>(`${API}/categories`).pipe(map((r) => r.data));
  }

  products(q: { categoryId?: number | null; keyword?: string; sort?: string; page?: number; size?: number }): Observable<Page<ProductSummary>> {
    let params = new HttpParams().set('page', q.page ?? 0).set('size', q.size ?? 12);
    if (q.categoryId) params = params.set('categoryId', q.categoryId);
    if (q.keyword) params = params.set('keyword', q.keyword);
    if (q.sort) params = params.set('sort', q.sort);
    return this.http.get<AppResponse<Page<ProductSummary>>>(`${API}/products`, { params }).pipe(map((r) => r.data));
  }

  product(id: number): Observable<ProductDetail> {
    return this.http.get<AppResponse<ProductDetail>>(`${API}/products/${id}`).pipe(map((r) => r.data));
  }

  // ===== 會員 =====

  me(): Observable<User> {
    return this.http.get<AppResponse<User>>(`${API}/users/me`).pipe(map((r) => r.data));
  }

  updateMe(body: { name: string; phone: string | null; password: string }): Observable<User> {
    return this.http.put<AppResponse<User>>(`${API}/users/me`, body).pipe(map((r) => r.data));
  }

  // ===== 購物車 =====

  cart(): Observable<Cart> {
    return this.http.get<AppResponse<Cart>>(`${API}/cart`).pipe(map((r) => r.data));
  }

  addToCart(variantId: number, quantity: number): Observable<Cart> {
    return this.http.post<AppResponse<Cart>>(`${API}/cart/items`, { variantId, quantity }).pipe(map((r) => r.data));
  }

  updateCart(variantId: number, quantity: number): Observable<Cart> {
    return this.http.put<AppResponse<Cart>>(`${API}/cart/items/${variantId}`, { quantity }).pipe(map((r) => r.data));
  }

  removeFromCart(variantId: number): Observable<Cart> {
    return this.http.delete<AppResponse<Cart>>(`${API}/cart/items/${variantId}`).pipe(map((r) => r.data));
  }

  mergeCart(items: GuestCartItem[]): Observable<Cart> {
    const body = { items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })) };
    return this.http.post<AppResponse<Cart>>(`${API}/cart/merge`, body).pipe(map((r) => r.data));
  }

  // ===== 訂單與付款 =====

  createOrder(body: CheckoutRequest): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${API}/orders`, body).pipe(map((r) => r.data));
  }

  myOrders(): Observable<OrderSummary[]> {
    return this.http.get<AppResponse<OrderSummary[]>>(`${API}/orders`).pipe(map((r) => r.data));
  }

  myOrder(orderNo: string): Observable<OrderDetail> {
    return this.http.get<AppResponse<OrderDetail>>(`${API}/orders/${orderNo}`).pipe(map((r) => r.data));
  }

  cancelOrder(orderNo: string): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${API}/orders/${orderNo}/cancel`, {}).pipe(map((r) => r.data));
  }

  ecpayForm(orderNo: string): Observable<EcpayForm> {
    return this.http.post<AppResponse<EcpayForm>>(`${API}/orders/${orderNo}/payments/ecpay`, {}).pipe(map((r) => r.data));
  }

  mockPay(orderNo: string): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${API}/orders/${orderNo}/payments/mock`, {}).pipe(map((r) => r.data));
  }
}
