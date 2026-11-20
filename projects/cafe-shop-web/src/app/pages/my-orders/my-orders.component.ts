import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderSummary } from '../../core/models';
import { ShopApiService } from '../../core/shop-api.service';
import { StatusChipComponent } from '../../shared/status-chip/status-chip.component';

@Component({
  selector: 'app-my-orders',
  imports: [RouterLink, CurrencyPipe, DatePipe, StatusChipComponent],
  template: `
    <h1>我的訂單</h1>
    @if (orders().length === 0) {
      <p class="hint">還沒有訂單。</p>
    } @else {
      <table class="data">
        <thead><tr><th>訂單編號</th><th>日期</th><th>件數</th><th>金額</th><th>狀態</th></tr></thead>
        <tbody>
          @for (o of orders(); track o.orderNo) {
            <tr>
              <td><a [routerLink]="['/me/orders', o.orderNo]">{{ o.orderNo }}</a></td>
              <td>{{ o.createdAt | date: 'yyyy/MM/dd HH:mm' }}</td>
              <td>{{ o.itemCount }}</td>
              <td>{{ o.totalAmount | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td>
              <td><app-status-chip [status]="o.status" [label]="o.statusLabel" /></td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class MyOrdersComponent implements OnInit {
  private api = inject(ShopApiService);
  orders = signal<OrderSummary[]>([]);

  ngOnInit(): void {
    this.api.myOrders().subscribe((o) => this.orders.set(o));
  }
}
