import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { OrderDetail } from '../../core/models';
import { StatusChipComponent } from '../status-chip/status-chip.component';

// 訂單明細的共用畫面（前台、後台都用）
@Component({
  selector: 'app-order-view',
  imports: [CurrencyPipe, DatePipe, StatusChipComponent],
  template: `
    @let o = order();
    <h1>訂單 {{ o.orderNo }} <app-status-chip [status]="o.status" [label]="o.statusLabel" /></h1>
    <div class="cols">
      <div>
        <h3>收件資料</h3>
        <p>{{ o.receiverName }}　{{ o.receiverPhone }}<br />{{ o.receiverAddress }}</p>
        @if (o.note) { <p class="hint">備註：{{ o.note }}</p> }
        @if (o.trackingNo) { <p>物流單號：{{ o.trackingNo }}</p> }
        @if (o.cancelReason) { <p class="error">取消原因：{{ o.cancelReason }}</p> }
      </div>
      <div>
        <h3>時間</h3>
        <p>下單：{{ o.createdAt | date: 'yyyy/MM/dd HH:mm' }}
          @if (o.paidAt) { <br />付款：{{ o.paidAt | date: 'yyyy/MM/dd HH:mm' }} }
          @if (o.shippedAt) { <br />出貨：{{ o.shippedAt | date: 'yyyy/MM/dd HH:mm' }} }
          @if (o.completedAt) { <br />完成：{{ o.completedAt | date: 'yyyy/MM/dd HH:mm' }} }
          @if (o.cancelledAt) { <br />取消：{{ o.cancelledAt | date: 'yyyy/MM/dd HH:mm' }} }
        </p>
      </div>
    </div>
    <table class="data">
      <thead><tr><th>商品</th><th>規格</th><th>單價</th><th>數量</th><th>小計</th></tr></thead>
      <tbody>
        @for (i of o.items; track i.variantId) {
          <tr>
            <td>{{ i.productName }}</td><td>{{ i.variantName }}</td>
            <td>{{ i.unitPrice | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td>
            <td>{{ i.quantity }}</td>
            <td>{{ i.subtotal | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</td>
          </tr>
        }
      </tbody>
    </table>
    <div class="summary">
      <div>商品金額：{{ o.itemsAmount | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</div>
      <div>運費：{{ o.shippingFee | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</div>
      <div class="total">合計：{{ o.totalAmount | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</div>
    </div>
  `,
})
export class OrderViewComponent {
  order = input.required<OrderDetail>();
}
