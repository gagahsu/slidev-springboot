import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AdminApiService } from '../../core/admin-api.service';
import { errorMessage } from '../../core/error-message';
import { ImgUrlPipe } from '../../core/img-url.pipe';
import { Category, ProductRequest, Variant } from '../../core/models';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink, ImgUrlPipe, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  private api = inject(AdminApiService);
  private fb = inject(FormBuilder).nonNullable;
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  id = input<string>(); // 新增時沒有 id
  categories = signal<Category[]>([]);
  uploading = signal(false);
  loaded = signal(false); // 編輯時等商品讀回來才顯示表單

  form = this.fb.group({
    categoryId: [0, Validators.min(1)],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', Validators.maxLength(200)],
    imageUrl: [''],
    sortOrder: [0],
    // FormArray：規格的數量不固定，可以動態新增、刪除（Angular ch51）
    variants: this.fb.array([this.variantGroup()]),
  });

  get variants(): FormArray {
    return this.form.controls.variants;
  }

  ngOnInit(): void {
    this.api.categories().subscribe((c) => this.categories.set(c));
    const id = this.id();
    if (id) {
      this.api.product(Number(id)).subscribe((p) => {
        this.variants.clear();
        p.variants.forEach((v) => this.variants.push(this.variantGroup(v)));
        this.form.patchValue({ categoryId: p.categoryId, name: p.name, description: p.description ?? '',
          imageUrl: p.imageUrl ?? '', sortOrder: p.sortOrder });
        this.loaded.set(true);
      });
    } else {
      this.loaded.set(true);
    }
  }

  // 一個規格 = 一個 FormGroup；id 是 null 表示新增的規格
  variantGroup(v?: Variant) {
    return this.fb.group({
      id: [v?.id ?? (null as number | null)],
      name: [v?.name ?? '', [Validators.required, Validators.maxLength(30)]],
      sku: [v?.sku ?? '', [Validators.required, Validators.maxLength(30)]],
      price: [v?.price ?? 0, [Validators.required, Validators.min(0)]],
      stock: [v?.stock ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  addVariant(): void {
    this.variants.push(this.variantGroup());
  }

  removeVariant(i: number): void {
    this.variants.removeAt(i);
  }

  upload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.uploading.set(true);
    this.api.upload(file).subscribe({
      next: (url) => { this.form.patchValue({ imageUrl: url }); this.uploading.set(false); },
      error: (e) => { this.uploading.set(false); this.snack.open(errorMessage(e), '關閉', { duration: 3000 }); },
    });
  }

  save(): void {
    if (this.form.invalid || this.variants.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: ProductRequest = { ...v, imageUrl: v.imageUrl || null, variants: v.variants as ProductRequest['variants'] };
    const id = this.id();
    const request = id ? this.api.updateProduct(Number(id), body) : this.api.createProduct(body);
    request.subscribe({
      next: () => { this.snack.open('已儲存', '關閉', { duration: 2000 }); this.router.navigate(['/admin/products']); },
      error: (e) => this.snack.open(errorMessage(e), '關閉', { duration: 3000 }),
    });
  }
}
