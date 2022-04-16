import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, catchError, combineLatest, forkJoin, map, merge, Observable, scan, Subject, tap, throwError } from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductCategory } from '../product-categories/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';
  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  constructor(private http: HttpClient, private productCategoryService: ProductCategoryService) { }

  products$: Observable<Product[]> = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productsWithCategory$: Observable<Product[]> = forkJoin([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products, categories]: [Product[], ProductCategory[]]) =>
      products.map((product) => ({
        ...product,
        price: product.price ? product.price * 1.5 : 0,
        searchKey: [product.productName],
        category: categories.find(c => product.categoryId === c.id)?.name,
      } as Product)))
  );

  selectedProduct$: Observable<Product | undefined> = combineLatest([this.productsWithCategory$, this.productSelectedAction$])
    .pipe(
      map(([products, productId]) =>
        products.find(product => product.id === productId)));

  selectedProductChanged(productId: number): void {
    this.productSelectedSubject.next(productId);
  }

  private productInsertSubject = new Subject<Product>();
  productInsertedAction$ = this.productInsertSubject.asObservable();
  productsWithAdd$ = merge(this.productsWithCategory$, this.productInsertedAction$).pipe(
    scan((acc, value) => (value instanceof Array) ? [...value] : [...acc, value], [] as Product[])
  );

  onAdd(newProduct?: Product): void {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertSubject.next(newProduct);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
