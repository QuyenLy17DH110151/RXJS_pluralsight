import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, Observable } from 'rxjs';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';
  constructor(private productService: ProductService) { }

  productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    catchError(this.hanldeError)
  );

  product$: Observable<Product | undefined> = this.productService.selectedProduct$.pipe(catchError(this.hanldeError));

  pageTitle$: Observable<string> = this.product$.pipe(
    map(product => (product?.productName) ? product.productName : "")
  );
  
  vm$ = combineLatest([this.product$, this.productSuppliers$, this.pageTitle$]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) => ({
      product, productSuppliers, pageTitle
    }))
  );

  hanldeError(err: string): Observable<never> {
    this.errorMessage = err;
    return EMPTY;
  }
}
