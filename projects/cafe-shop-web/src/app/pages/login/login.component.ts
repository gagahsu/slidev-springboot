import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { errorMessage } from '../../core/error-message';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  error = signal('');
  returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.afterLogin(),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  // 登入後：合併訪客購物車，再回到原本要去的頁面
  private afterLogin(): void {
    this.cart.refresh().subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: () => this.router.navigateByUrl(this.returnUrl),
    });
  }
}
