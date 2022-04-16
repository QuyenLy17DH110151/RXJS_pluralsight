import { Component } from '@angular/core';

import { catchError, EMPTY, Observable, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;

  products$: Observable<Product[]> = this.productService.productsWithCategory$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
