import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { ImgUrlPipe } from '../../core/img-url.pipe';
import { ProductSummary } from '../../core/models';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatCardModule, CurrencyPipe, ImgUrlPipe],
  template: `
    <mat-card class="product-card" [routerLink]="['/products', product().id]">
      <img mat-card-image [src]="product().imageUrl | imgUrl" [alt]="product().name" />
      <mat-card-content>
        <div class="category">{{ product().categoryName }}</div>
        <h3>{{ product().name }}</h3>
        <div class="price">
          {{ product().price | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }} 起
          @if (product().soldOut) { <span class="sold-out">售完</span> }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ProductCardComponent {
  product = input.required<ProductSummary>();
}
