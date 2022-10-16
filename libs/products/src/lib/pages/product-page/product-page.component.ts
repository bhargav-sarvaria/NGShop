import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@shreeshakti/orders';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements  OnDestroy {

  productId: string;
  product: Product;
  endSubs$: Subject<any> = new Subject();
  quantity = 1;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { 
    this.route.params.subscribe((params) => {
      if(params.productid){
        this.productId = params.productid;
        this._getProduct(this.productId);
      }
    })
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getProduct(id: string){
    this.productsService.getProduct(id).pipe(takeUntil(this.endSubs$)).subscribe((product) => {
      this.product = product;
    });
  }

  addProductToCart(){
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    };
    this.cartService.setCartItem(cartItem);
  }


}
