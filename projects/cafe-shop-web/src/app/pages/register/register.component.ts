import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { errorMessage } from '../../core/error-message';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  private returnUrl = inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl') ?? '/';

  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: ['', Validators.pattern(/^09\d{8}$/)],
  });
  error = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.auth.register({ ...v, phone: v.phone || null }).subscribe({
      next: () => this.cart.refresh().subscribe({ complete: () => this.router.navigateByUrl(this.returnUrl) }),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
