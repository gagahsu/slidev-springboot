import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ReservationListComponent } from './pages/reservation-list/reservation-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/reservations', component: ReservationListComponent },
  { path: '**', redirectTo: '' },
];
