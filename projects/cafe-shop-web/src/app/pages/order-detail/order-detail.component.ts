import { Component, OnInit, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { errorMessage } from '../../core/error-message';
import { OrderDetail } from '../../core/models';
import { submitEcpayForm } from '../../core/payment';
import { ShopApiService } from '../../core/shop-api.service';
import { OrderViewComponent } from '../../shared/order-view/order-view.component';

@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, MatButtonModule, OrderViewComponent],
  template: `
    @if (error()) {
      <p class="error">{{ error() }}</p>
    } @else if (order(); as o) {
      <app-order-view [order]="o" />
      @if (o.status === 'PENDING_PAYMENT') {
        <div class="actions">
          <button mat-flat-button (click)="payEcpay(o.orderNo)">繼續付款</button>
          <button mat-stroked-button (click)="mockPay(o.orderNo)">模擬付款（開發用）</button>
          <button mat-button (click)="cancel(o.orderNo)">取消訂單</button>
        </div>
        <p class="hint">未付款的訂單會在下單 30 分鐘後自動取消。</p>
      }
    }
    <a mat-button routerLink="/me/orders">← 回我的訂單</a>
  `,
})
export class OrderDetailComponent implements OnInit {
  private api = inject(ShopApiService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  orderNo = input.required<string>();
  order = signal<OrderDetail | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.api.myOrder(this.orderNo()).subscribe({
      next: (o) => this.order.set(o),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  payEcpay(orderNo: string): void {
    this.api.ecpayForm(orderNo).subscribe({ next: submitEcpayForm, error: (e) => this.toast(e) });
  }

  mockPay(orderNo: string): void {
    this.api.mockPay(orderNo).subscribe({
      next: () => this.router.navigate(['/orders', orderNo, 'result']),
      error: (e) => this.toast(e),
    });
  }

  cancel(orderNo: string): void {
    if (!confirm('確定要取消這張訂單嗎？')) {
      return;
    }
    this.api.cancelOrder(orderNo).subscribe({ next: (o) => this.order.set(o), error: (e) => this.toast(e) });
  }

  private toast(e: unknown): void {
    this.snack.open(errorMessage(e), '關閉', { duration: 3000 });
  }
}
