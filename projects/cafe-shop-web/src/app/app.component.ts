import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  auth = inject(AuthService);
  cart = inject(CartService);

  constructor() {
    // 重新整理時，已登入的會員要把購物車讀回來
    this.cart.refresh().subscribe({ error: () => {} });
  }

  logout(): void {
    this.cart.reset();
    this.auth.logout();
  }
}
