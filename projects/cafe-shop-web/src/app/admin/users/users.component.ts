import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AdminApiService } from '../../core/admin-api.service';
import { Page, User } from '../../core/models';

@Component({
  selector: 'app-users',
  imports: [DatePipe, MatPaginatorModule],
  template: `
    <h1>會員列表</h1>
    @if (result(); as r) {
      <table class="data">
        <thead><tr><th>#</th><th>姓名</th><th>Email</th><th>手機</th><th>角色</th><th>註冊時間</th></tr></thead>
        <tbody>
          @for (u of r.content; track u.id) {
            <tr><td>{{ u.id }}</td><td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.phone }}</td><td>{{ u.role }}</td>
              <td>{{ u.createdAt | date: 'yyyy/MM/dd' }}</td></tr>
          }
        </tbody>
      </table>
      <mat-paginator [length]="r.totalElements" [pageSize]="r.size" [pageIndex]="r.page" [hidePageSize]="true" (page)="onPage($event)" />
    }
  `,
})
export class UsersComponent implements OnInit {
  private api = inject(AdminApiService);
  result = signal<Page<User> | null>(null);

  ngOnInit(): void {
    this.onPage({ pageIndex: 0 } as PageEvent);
  }

  onPage(e: PageEvent): void {
    this.api.users(e.pageIndex, 20).subscribe((r) => this.result.set(r));
  }
}
