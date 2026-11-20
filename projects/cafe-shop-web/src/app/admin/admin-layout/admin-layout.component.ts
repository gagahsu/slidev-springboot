import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// 後台版型：左邊 Sidenav（Angular ch48）
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule],
  template: `
    <mat-sidenav-container class="admin">
      <mat-sidenav mode="side" opened class="admin-nav">
        <mat-nav-list>
          <a mat-list-item routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">營運摘要</a>
          <a mat-list-item routerLink="/admin/orders" routerLinkActive="active">訂單</a>
          <a mat-list-item routerLink="/admin/products" routerLinkActive="active">商品</a>
          <a mat-list-item routerLink="/admin/categories" routerLinkActive="active">分類</a>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">會員</a>
          <a mat-list-item routerLink="/admin/reports" routerLinkActive="active">銷售報表</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="admin-content">
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AdminLayoutComponent {}
