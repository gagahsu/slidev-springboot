import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminApiService } from '../../core/admin-api.service';
import { errorMessage } from '../../core/error-message';
import { OrderDetail } from '../../core/models';
import { OrderViewComponent } from '../../shared/order-view/order-view.component';

@Component({
  selector: 'app-admin-order-detail',
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe, MatButtonModule, MatFormFieldModule, MatInputModule, OrderViewComponent],
  template: `
    @if (order(); as o) {
      @if (o.warning) { <div class="warning">⚠️ {{ o.warning }}</div> }
      <app-order-view [order]="o" />

      <div class="actions">
        @if (o.status === 'PAID') {
          <mat-form-field><mat-label>物流單號</mat-label><input matInput [(ngModel)]="trackingNo" /></mat-form-field>
          <button mat-flat-button (click)="run(api.ship(o.orderNo, trackingNo))" [disabled]="!trackingNo.trim()">出貨</button>
        }
        @if (o.status === 'SHIPPED') {
          <button mat-flat-button (click)="run(api.complete(o.orderNo))">完成</button>
        }
        @if (o.status === 'PENDING_PAYMENT' || o.status === 'PAID') {
          <button mat-stroked-button (click)="cancel(o)">取消訂單</button>
        }
        <button mat-button (click)="query(o.orderNo)">向綠界查詢</button>
      </div>

      <h3>付款紀錄</h3>
      <table class="data">
        <thead><tr><th>交易編號</th><th>方式</th><th>金額</th><th>狀態</th><th>綠界交易編號</th><th>訊息</th><th>時間</th></tr></thead>
        <tbody>
          @for (p of o.payments ?? []; track p.merchantTradeNo) {
            <tr>
              <td>{{ p.merchantTradeNo }}</td><td>{{ p.provider }}</td>
              <td>{{ p.amount | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td>
              <td>{{ p.status }}{{ p.simulatePaid ? '（模擬通知）' : '' }}</td>
              <td>{{ p.tradeNo }}</td><td>{{ p.rtnMsg }}</td>
              <td>{{ (p.paidAt ?? p.createdAt) | date: 'MM/dd HH:mm' }}</td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="hint">沒有付款紀錄</td></tr>
          }
        </tbody>
      </table>
    }
    <a mat-button routerLink="/admin/orders">← 回訂單列表</a>
  `,
})
export class AdminOrderDetailComponent implements OnInit {
  api = inject(AdminApiService);
  private snack = inject(MatSnackBar);
  orderNo = input.required<string>();
  order = signal<OrderDetail | null>(null);
  trackingNo = '';

  ngOnInit(): void {
    this.api.order(this.orderNo()).subscribe((o) => this.order.set(o));
  }

  run(action: Observable<OrderDetail>): void {
    action.subscribe({
      next: (o) => { this.order.set(o); this.snack.open('已更新', '關閉', { duration: 2000 }); },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }

  cancel(o: OrderDetail): void {
    const reason = prompt(o.status === 'PAID' ? '取消原因（已付款，需到綠界後台人工退款）' : '取消原因', '');
    if (reason !== null) {
      this.run(this.api.cancel(o.orderNo, reason));
    }
  }

  query(orderNo: string): void {
    this.api.queryEcpay(orderNo).subscribe({
      next: (r) => {
        this.snack.open(`綠界：${r.message}`, '關閉', { duration: 4000 });
        this.api.order(orderNo).subscribe((o) => this.order.set(o));
      },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 4000 }),
    });
  }
}
