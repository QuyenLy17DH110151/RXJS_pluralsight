import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: Product | null = null;
  productSuppliers: Supplier[] | null = null;

  product$: Observable<Product | undefined> = this.productService.selectedProduct$.pipe(catchError(this.hanldeError));

  constructor(private productService: ProductService) { }

  hanldeError(err: string): Observable<never> {
    this.errorMessage = err;
    return EMPTY;
  }
}
