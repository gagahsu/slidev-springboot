import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/cart.service';
import { errorMessage } from '../../core/error-message';
import { submitEcpayForm } from '../../core/payment';
import { ShopApiService } from '../../core/shop-api.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private api = inject(ShopApiService);
  private cartService = inject(CartService);
  private router = inject(Router);
  cart = this.cartService.cart;

  // Reactive Forms：收件資料（規則跟後端一樣）
  form = inject(FormBuilder).nonNullable.group({
    receiverName: ['', [Validators.required, Validators.maxLength(20)]],
    receiverPhone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
    receiverAddress: ['', [Validators.required, Validators.maxLength(200)]],
    note: ['', Validators.maxLength(200)],
    payment: ['ECPAY' as 'ECPAY' | 'MOCK'],
  });
  sending = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.cartService.refresh().subscribe({ error: () => {} });
    // 預設帶入會員資料
    this.api.me().subscribe((u) => this.form.patchValue({ receiverName: u.name, receiverPhone: u.phone ?? '' }));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { payment, ...receiver } = this.form.getRawValue();
    this.sending.set(true);
    this.error.set('');
    // 1. 建立訂單（金額由後端計算）
    this.api.createOrder(receiver).subscribe({
      next: (order) => {
        this.cartService.clearAfterOrder();
        this.pay(order.orderNo, payment);
      },
      error: (e) => { this.sending.set(false); this.error.set(errorMessage(e)); },
    });
  }

  // 2. 付款：綠界整頁跳轉；模擬付款直接到結果頁
  private pay(orderNo: string, payment: 'ECPAY' | 'MOCK'): void {
    if (payment === 'MOCK') {
      this.api.mockPay(orderNo).subscribe({
        next: () => this.router.navigate(['/orders', orderNo, 'result']),
        error: () => this.router.navigate(['/me/orders', orderNo]),
      });
      return;
    }
    this.api.ecpayForm(orderNo).subscribe({
      next: (form) => submitEcpayForm(form),
      error: () => this.router.navigate(['/me/orders', orderNo]), // 訂單已成立，可以在訂單頁繼續付款
    });
  }
}
