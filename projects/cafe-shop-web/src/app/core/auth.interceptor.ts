import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { API } from './config';

// HTTP 攔截器：每個送到後端的請求自動帶上 JWT；收到 401 就登出、導向登入頁
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token;
  if (token && req.url.startsWith(API)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 登入 API 自己的 401（帳號密碼錯）交給頁面顯示，不要跳轉
      if (err.status === 401 && !req.url.includes('/auth/')) {
        auth.logout(router.url);
      }
      return throwError(() => err);
    }),
  );
};
