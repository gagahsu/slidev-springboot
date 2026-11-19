import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Category, Product, Reservation, ReservationRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CafeApiService {
  private http = inject(HttpClient);

  // 開發時後端跑在 8080，前端跑在 4200
  private baseUrl = 'http://localhost:8080/api';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createReservation(req: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, req);
  }

  getReservations(date: string): Observable<Reservation[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`, { params });
  }
}
