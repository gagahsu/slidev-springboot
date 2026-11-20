import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Category, ProductSummary } from '../../core/models';
import { ShopApiService } from '../../core/shop-api.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private api = inject(ShopApiService);
  categories = signal<Category[]>([]);
  featured = signal<ProductSummary[]>([]);

  ngOnInit(): void {
    this.api.categories().subscribe((c) => this.categories.set(c));
    this.api.products({ size: 4 }).subscribe((p) => this.featured.set(p.content));
  }
}
