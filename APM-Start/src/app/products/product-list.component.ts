import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, Subject } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  private selectedCategoryIdSubject = new BehaviorSubject<number>(0);
  selectedCategoryIdSubject$ = this.selectedCategoryIdSubject.asObservable();
  
  products$: Observable<Product[]> = combineLatest([this.productService.productsWithAdd$, this.selectedCategoryIdSubject$]).pipe(
    map(([products, selectedCategory]) => products.filter(product => {
      return selectedCategory ? product.categoryId === selectedCategory : true;
    })),
    catchError(err => {
      this.errorMessage = err;
      console.log(this.errorMessage)
      return EMPTY;
    }));

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }
  categories$: Observable<ProductCategory[]> = this.productCategoryService.productCategories$.pipe();

  onAdd(): void {
    this.productService.onAdd();
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryIdSubject.next(+categoryId);
  }
}
