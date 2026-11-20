import { Routes } from '@angular/router';

import { adminGuard, authGuard } from './core/guards';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // 以下要登入
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders/:orderNo/result', component: PaymentResultComponent, canActivate: [authGuard] },
  { path: 'me', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'me/orders', component: MyOrdersComponent, canActivate: [authGuard] },
  { path: 'me/orders/:orderNo', component: OrderDetailComponent, canActivate: [authGuard] },
  // 後台：限 ADMIN，用到才載入（lazy loading）
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
