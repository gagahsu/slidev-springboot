import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import Chart from 'chart.js/auto';

import { AdminApiService } from '../../core/admin-api.service';
import { Dashboard } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, MatCardModule],
  template: `
    <h1>營運摘要</h1>
    @if (data(); as d) {
      <div class="stats">
        <mat-card><mat-card-content><div class="label">今日營業額</div><div class="value">{{ d.todayRevenue | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</div></mat-card-content></mat-card>
        <mat-card><mat-card-content><div class="label">今日訂單</div><div class="value">{{ d.todayOrders }}</div></mat-card-content></mat-card>
        <mat-card><mat-card-content><div class="label">待出貨</div><div class="value">{{ d.pendingShipCount }}</div></mat-card-content></mat-card>
      </div>
      <div class="cols">
        <div class="chart-box"><h3>近 7 天營業額</h3><canvas #line></canvas></div>
        <div>
          <h3>熱銷 Top 5（近 30 天）</h3>
          <ol>
            @for (p of d.top5; track p.productId) {
              <li>{{ p.productName }}：{{ p.quantity }} 件，{{ p.revenue | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</li>
            }
          </ol>
        </div>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private api = inject(AdminApiService);
  data = signal<Dashboard | null>(null);
  line = viewChild<ElementRef<HTMLCanvasElement>>('line');
  private chart?: Chart;

  ngOnInit(): void {
    this.api.dashboard().subscribe((d) => {
      this.data.set(d);
      setTimeout(() => this.draw(d)); // 等 canvas 出現在畫面上
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  // 近 7 天：沒有訂單的日子補 0
  private draw(d: Dashboard): void {
    const canvas = this.line()?.nativeElement;
    if (!canvas) {
      return;
    }
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      days.push(new Date(Date.now() - i * 86400000).toLocaleDateString('sv-SE'));
    }
    const revenue = days.map((day) => d.last7Days.find((x) => x.salesDate === day)?.revenue ?? 0);
    this.chart = new Chart(canvas, {
      type: 'line',
      data: { labels: days.map((x) => x.slice(5)), datasets: [{ label: '營業額', data: revenue, borderColor: '#6f4e37', tension: 0.3 }] },
      options: { plugins: { legend: { display: false } } },
    });
  }
}
