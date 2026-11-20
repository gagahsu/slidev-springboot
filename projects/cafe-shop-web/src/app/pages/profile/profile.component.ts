import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { errorMessage } from '../../core/error-message';
import { ShopApiService } from '../../core/shop-api.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="narrow">
      <h1>會員資料</h1>
      <p class="hint">{{ email() }}</p>
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field><mat-label>姓名</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field><mat-label>手機</mat-label><input matInput formControlName="phone" /></mat-form-field>
        <mat-form-field><mat-label>新密碼（不改請留空）</mat-label><input matInput type="password" formControlName="password" /></mat-form-field>
        <button mat-flat-button type="submit">儲存</button>
      </form>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private api = inject(ShopApiService);
  private snack = inject(MatSnackBar);
  email = signal('');
  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    phone: ['', Validators.pattern(/^09\d{8}$/)],
    password: [''],
  });

  ngOnInit(): void {
    this.api.me().subscribe((u) => {
      this.email.set(u.email);
      this.form.patchValue({ name: u.name, phone: u.phone ?? '' });
    });
  }

  save(): void {
    const v = this.form.getRawValue();
    this.api.updateMe({ ...v, phone: v.phone || null }).subscribe({
      next: () => { this.form.controls.password.reset(); this.snack.open('已儲存', '關閉', { duration: 2000 }); },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }
}
