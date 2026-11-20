import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Subscription, filter, interval, startWith, switchMap, take, takeWhile } from 'rxjs';

import { OrderDetail } from '../../core/models';
import { ShopApiService } from '../../core/shop-api.service';

// 付款結果：只看自己後端的訂單狀態，不看網址參數
@Component({
  selector: 'app-payment-result',
  imports: [RouterLink, CurrencyPipe, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './payment-result.component.html',
})
export class PaymentResultComponent implements OnInit, OnDestroy {
  private api = inject(ShopApiService);
  orderNo = input.required<string>();
  order = signal<OrderDetail | null>(null);
  timedOut = signal(false);
  private sub?: Subscription;

  ngOnInit(): void {
    // 還沒收到綠界通知時，每 3 秒查一次，最多 1 分鐘（20 次）
    this.sub = interval(3000).pipe(
      startWith(0),
      take(21),
      switchMap(() => this.api.myOrder(this.orderNo())),
      takeWhile((o) => o.status === 'PENDING_PAYMENT', true),
    ).subscribe({
      next: (o) => this.order.set(o),
      complete: () => {
        if (this.order()?.status === 'PENDING_PAYMENT') {
          this.timedOut.set(true);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get paid(): boolean {
    const s = this.order()?.status;
    return s === 'PAID' || s === 'SHIPPED' || s === 'COMPLETED';
  }
}
