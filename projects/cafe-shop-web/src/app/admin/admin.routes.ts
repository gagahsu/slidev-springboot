import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CategoriesComponent } from './categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminOrderDetailComponent } from './order-detail/order-detail.component';
import { AdminOrdersComponent } from './orders/orders.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { AdminProductsComponent } from './products/products.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/new', component: ProductEditComponent },
      { path: 'products/:id', component: ProductEditComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:orderNo', component: AdminOrderDetailComponent },
      { path: 'users', component: UsersComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];
