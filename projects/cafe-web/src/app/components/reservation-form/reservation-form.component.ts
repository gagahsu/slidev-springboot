import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiError, ReservationRequest } from '../../models';
import { CafeApiService } from '../../services/cafe-api.service';

@Component({
  selector: 'app-reservation-form',
  imports: [FormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss',
})
export class ReservationFormComponent {
  private api = inject(CafeApiService);

  form: ReservationRequest = this.emptyForm();
  errors: Record<string, string> = {};
  message = '';
  sending = false;

  // 可選的日期範圍：今天～30 天後
  minDate = this.toDateString(new Date());
  maxDate = this.toDateString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  // 營業時段：10:00～19:30，每 30 分鐘
  timeSlots = this.buildTimeSlots();

  submit(): void {
    this.message = '';
    this.errors = this.check();
    if (Object.keys(this.errors).length > 0) {
      return; // 前端先擋下來
    }
    this.sending = true;
    this.api.createReservation(this.form).subscribe({
      next: () => {
        this.sending = false;
        this.message = '已收到您的訂位，我們當天見！';
        this.form = this.emptyForm();
      },
      error: (err: HttpErrorResponse) => {
        this.sending = false;
        if (err.status === 400) {
          // 後端回的欄位錯誤，顯示在對應的欄位下面
          this.errors = (err.error as ApiError).fields;
        } else {
          this.message = '目前無法連線，請稍後再試';
        }
      },
    });
  }

  // 前端檢查：規則跟後端一樣（以後端為準）
  private check(): Record<string, string> {
    const e: Record<string, string> = {};
    const f = this.form;
    if (!f.name.trim()) e['name'] = '請輸入姓名';
    else if (f.name.trim().length > 20) e['name'] = '姓名最多 20 字';
    if (!/^09\d{8}$/.test(f.phone)) e['phone'] = '手機格式不正確';
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e['email'] = 'Email 格式不正確';
    if (!f.reserveDate || f.reserveDate < this.minDate || f.reserveDate > this.maxDate) {
      e['reserveDate'] = '只能預約 30 天內的日期';
    }
    if (!f.reserveTime) e['reserveTime'] = '請選擇營業時段';
    if (f.people === null || f.people < 1 || f.people > 8) e['people'] = '一次最多預約 8 位';
    if (f.note.length > 200) e['note'] = '備註最多 200 字';
    return e;
  }

  private emptyForm(): ReservationRequest {
    return { name: '', phone: '', email: '', reserveDate: '', reserveTime: '', people: 2, note: '' };
  }

  private buildTimeSlots(): string[] {
    const slots: string[] = [];
    for (let h = 10; h <= 19; h++) {
      slots.push(`${h}:00`, `${h}:30`);
    }
    return slots;
  }

  private toDateString(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
}
