import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service'
import * as AOS from 'aos'; 

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [
  ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {

  featuredProducts: Product[];
  endSubs$: Subject<any> = new Subject();
  interval;
  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {    
    this._getFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getFeaturedProducts() {
    this.productsService.getFeaturedProducts(4).pipe(takeUntil(this.endSubs$)).subscribe( (featuredProducts) => {
      this.featuredProducts = featuredProducts;
    });
  }
}
