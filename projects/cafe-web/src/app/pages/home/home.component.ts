import { Component } from '@angular/core';

import { HeroComponent } from '../../components/hero/hero.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, MenuComponent, ReservationFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
