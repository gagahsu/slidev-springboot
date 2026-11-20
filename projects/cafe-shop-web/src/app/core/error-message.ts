import { HttpErrorResponse } from '@angular/common/http';

// 把 HTTP 錯誤轉成給人看的訊息：後端有 message 就用後端的
export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return '目前無法連線，請稍後再試';
    }
    return err.error?.message ?? `發生錯誤（${err.status}）`;
  }
  return '發生錯誤';
}
