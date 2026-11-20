import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Chart from 'chart.js/auto';

import { AdminApiService } from '../../core/admin-api.service';
import { SalesReport } from '../../core/models';

@Component({
  selector: 'app-reports',
  imports: [FormsModule, CurrencyPipe, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1>銷售報表</h1>
    <div class="filters">
      <mat-form-field><mat-label>開始日期</mat-label><input matInput type="date" [(ngModel)]="from" /></mat-form-field>
      <mat-form-field><mat-label>結束日期</mat-label><input matInput type="date" [(ngModel)]="to" /></mat-form-field>
      <button mat-flat-button (click)="load()">查詢</button>
    </div>
    @if (report(); as r) {
      <p class="big">營業額 {{ r.totalRevenue | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}，共 {{ r.totalOrders }} 張訂單</p>
      <div class="cols">
        <div class="chart-box"><h3>各分類銷售額</h3><canvas #pie></canvas></div>
        <div>
          <h3>商品銷售排行</h3>
          <table class="data">
            <thead><tr><th>#</th><th>商品</th><th>件數</th><th>銷售額</th></tr></thead>
            <tbody>
              @for (p of r.products; track p.productId; let i = $index) {
                <tr><td>{{ i + 1 }}</td><td>{{ p.productName }}</td><td>{{ p.quantity }}</td>
                  <td>{{ p.revenue | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class ReportsComponent implements OnInit, OnDestroy {
  private api = inject(AdminApiService);
  report = signal<SalesReport | null>(null);
  pie = viewChild<ElementRef<HTMLCanvasElement>>('pie');
  private chart?: Chart;
  to = new Date().toLocaleDateString('sv-SE');
  from = new Date(Date.now() - 29 * 86400000).toLocaleDateString('sv-SE');

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  load(): void {
    this.api.sales(this.from, this.to).subscribe((r) => {
      this.report.set(r);
      setTimeout(() => this.draw(r));
    });
  }

  // 圓餅圖（Angular ch41）
  private draw(r: SalesReport): void {
    const canvas = this.pie()?.nativeElement;
    if (!canvas) {
      return;
    }
    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: r.categories.map((c) => c.categoryName),
        datasets: [{ data: r.categories.map((c) => c.revenue), backgroundColor: ['#6f4e37', '#c8945a', '#7d8a91', '#d9c3a0', '#a0522d'] }],
      },
    });
  }
}
