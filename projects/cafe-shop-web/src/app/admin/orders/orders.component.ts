import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { AdminApiService } from '../../core/admin-api.service';
import { OrderSummary, Page } from '../../core/models';
import { StatusChipComponent } from '../../shared/status-chip/status-chip.component';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatPaginatorModule, StatusChipComponent],
  template: `
    <h1>訂單管理</h1>
    <div class="filters">
      <mat-form-field>
        <mat-label>狀態</mat-label>
        <mat-select [(ngModel)]="status" (selectionChange)="load(0)">
          <mat-option value="">全部</mat-option>
          <mat-option value="PENDING_PAYMENT">待付款</mat-option>
          <mat-option value="PAID">已付款（待出貨）</mat-option>
          <mat-option value="SHIPPED">已出貨</mat-option>
          <mat-option value="COMPLETED">已完成</mat-option>
          <mat-option value="CANCELLED">已取消</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field><mat-label>開始日期</mat-label><input matInput type="date" [(ngModel)]="from" (change)="load(0)" /></mat-form-field>
      <mat-form-field><mat-label>結束日期</mat-label><input matInput type="date" [(ngModel)]="to" (change)="load(0)" /></mat-form-field>
      <mat-form-field><mat-label>訂單編號</mat-label><input matInput [(ngModel)]="orderNo" (keyup.enter)="load(0)" /></mat-form-field>
    </div>
    @if (result(); as r) {
      <table class="data">
        <thead><tr><th>訂單編號</th><th>下單時間</th><th>收件人</th><th>件數</th><th>金額</th><th>狀態</th></tr></thead>
        <tbody>
          @for (o of r.content; track o.orderNo) {
            <tr>
              <td><a [routerLink]="['/admin/orders', o.orderNo]">{{ o.orderNo }}</a></td>
              <td>{{ o.createdAt | date: 'MM/dd HH:mm' }}</td>
              <td>{{ o.receiverName }}</td>
              <td>{{ o.itemCount }}</td>
              <td>{{ o.totalAmount | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td>
              <td><app-status-chip [status]="o.status" [label]="o.statusLabel" /></td>
            </tr>
          }
        </tbody>
      </table>
      <mat-paginator [length]="r.totalElements" [pageSize]="r.size" [pageIndex]="r.page" [hidePageSize]="true" (page)="onPage($event)" />
    }
  `,
})
export class AdminOrdersComponent implements OnInit {
  private api = inject(AdminApiService);
  result = signal<Page<OrderSummary> | null>(null);
  status = '';
  from = '';
  to = '';
  orderNo = '';

  ngOnInit(): void {
    this.load(0);
  }

  load(page: number): void {
    this.api.orders({ status: this.status, from: this.from, to: this.to, orderNo: this.orderNo.trim(), page, size: 20 })
      .subscribe((r) => this.result.set(r));
  }

  onPage(e: PageEvent): void {
    this.load(e.pageIndex);
  }
}
