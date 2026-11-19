import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Reservation } from '../../models';
import { CafeApiService } from '../../services/cafe-api.service';

// 加分題：店家查某一天的訂位（/admin/reservations）
@Component({
  selector: 'app-reservation-list',
  imports: [FormsModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent implements OnInit {
  private api = inject(CafeApiService);

  date = new Date().toLocaleDateString('sv-SE'); // 今天，格式 yyyy-MM-dd
  reservations: Reservation[] = [];
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error = '';
    this.api.getReservations(this.date).subscribe({
      next: (data) => (this.reservations = data),
      error: () => (this.error = '目前無法連線，請稍後再試'),
    });
  }

  // 當天總共幾位客人
  get totalPeople(): number {
    return this.reservations.reduce((sum, r) => sum + r.people, 0);
  }
}
