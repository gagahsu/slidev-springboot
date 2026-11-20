import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { API } from './config';
import { AppResponse, LoginResult } from './models';

const KEY = 'cafe-shop-auth';

// 登入狀態：token、姓名、角色，存在 localStorage，重新整理也還在
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private state = signal<LoginResult | null>(this.load());

  readonly user = this.state.asReadonly();
  readonly isLoggedIn = computed(() => this.state() !== null);
  readonly isAdmin = computed(() => this.state()?.role === 'ADMIN');

  get token(): string | null {
    return this.state()?.token ?? null;
  }

  login(email: string, password: string): Observable<LoginResult> {
    return this.http.post<AppResponse<LoginResult>>(`${API}/auth/login`, { email, password }).pipe(
      map((r) => r.data),
      tap((data) => this.save(data)),
    );
  }

  register(body: { name: string; email: string; password: string; phone: string | null }): Observable<LoginResult> {
    return this.http.post<AppResponse<LoginResult>>(`${API}/auth/register`, body).pipe(
      map((r) => r.data),
      tap((data) => this.save(data)),
    );
  }

  logout(returnUrl?: string): void {
    this.state.set(null);
    localStorage.removeItem(KEY);
    this.router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
  }

  private save(data: LoginResult): void {
    this.state.set(data);
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  private load(): LoginResult | null {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
