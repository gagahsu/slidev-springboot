import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API } from './config';
import {
  AppResponse, Category, Dashboard, EcpayQuery, OrderDetail, OrderSummary, Page, ProductDetail,
  ProductRequest, ProductSummary, SalesReport, User,
} from './models';

// 後台用的 API（/api/admin/**，限 ADMIN）
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private base = `${API}/admin`;

  dashboard(): Observable<Dashboard> {
    return this.http.get<AppResponse<Dashboard>>(`${this.base}/dashboard`).pipe(map((r) => r.data));
  }

  products(q: { status?: string; categoryId?: number | null; keyword?: string; page: number; size: number }): Observable<Page<ProductSummary>> {
    let params = new HttpParams().set('page', q.page).set('size', q.size);
    if (q.status) params = params.set('status', q.status);
    if (q.categoryId) params = params.set('categoryId', q.categoryId);
    if (q.keyword) params = params.set('keyword', q.keyword);
    return this.http.get<AppResponse<Page<ProductSummary>>>(`${this.base}/products`, { params }).pipe(map((r) => r.data));
  }

  product(id: number): Observable<ProductDetail> {
    return this.http.get<AppResponse<ProductDetail>>(`${this.base}/products/${id}`).pipe(map((r) => r.data));
  }

  createProduct(body: ProductRequest): Observable<ProductDetail> {
    return this.http.post<AppResponse<ProductDetail>>(`${this.base}/products`, body).pipe(map((r) => r.data));
  }

  updateProduct(id: number, body: ProductRequest): Observable<ProductDetail> {
    return this.http.put<AppResponse<ProductDetail>>(`${this.base}/products/${id}`, body).pipe(map((r) => r.data));
  }

  changeStatus(id: number, status: string): Observable<ProductDetail> {
    return this.http.patch<AppResponse<ProductDetail>>(`${this.base}/products/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  upload(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<AppResponse<{ url: string }>>(`${this.base}/uploads`, form).pipe(map((r) => r.data.url));
  }

  categories(): Observable<Category[]> {
    return this.http.get<AppResponse<Category[]>>(`${this.base}/categories`).pipe(map((r) => r.data));
  }

  createCategory(body: { name: string; sortOrder: number }): Observable<Category> {
    return this.http.post<AppResponse<Category>>(`${this.base}/categories`, body).pipe(map((r) => r.data));
  }

  updateCategory(id: number, body: { name: string; sortOrder: number }): Observable<Category> {
    return this.http.put<AppResponse<Category>>(`${this.base}/categories/${id}`, body).pipe(map((r) => r.data));
  }

  orders(q: { status?: string; from?: string; to?: string; orderNo?: string; page: number; size: number }): Observable<Page<OrderSummary>> {
    let params = new HttpParams().set('page', q.page).set('size', q.size);
    if (q.status) params = params.set('status', q.status);
    if (q.from) params = params.set('from', q.from);
    if (q.to) params = params.set('to', q.to);
    if (q.orderNo) params = params.set('orderNo', q.orderNo);
    return this.http.get<AppResponse<Page<OrderSummary>>>(`${this.base}/orders`, { params }).pipe(map((r) => r.data));
  }

  order(orderNo: string): Observable<OrderDetail> {
    return this.http.get<AppResponse<OrderDetail>>(`${this.base}/orders/${orderNo}`).pipe(map((r) => r.data));
  }

  ship(orderNo: string, trackingNo: string): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${this.base}/orders/${orderNo}/ship`, { trackingNo }).pipe(map((r) => r.data));
  }

  complete(orderNo: string): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${this.base}/orders/${orderNo}/complete`, {}).pipe(map((r) => r.data));
  }

  cancel(orderNo: string, reason: string): Observable<OrderDetail> {
    return this.http.post<AppResponse<OrderDetail>>(`${this.base}/orders/${orderNo}/cancel`, { reason }).pipe(map((r) => r.data));
  }

  queryEcpay(orderNo: string): Observable<EcpayQuery> {
    return this.http.post<AppResponse<EcpayQuery>>(`${this.base}/orders/${orderNo}/payments/query`, {}).pipe(map((r) => r.data));
  }

  users(page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AppResponse<Page<User>>>(`${this.base}/users`, { params }).pipe(map((r) => r.data));
  }

  sales(from: string, to: string): Observable<SalesReport> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<AppResponse<SalesReport>>(`${this.base}/reports/sales`, { params }).pipe(map((r) => r.data));
  }
}
