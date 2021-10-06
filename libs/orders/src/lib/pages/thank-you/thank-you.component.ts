import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'orders-thank-you-page',
  templateUrl: './thank-you.component.html',
  styles: [
  ]
})
export class ThankYouComponent implements OnInit {

  constructor(
    private ordersService: OrdersService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const verifyCheckoutAndCreateOrder = this.ordersService.verifyCheckoutAndCreateOrder();
    if(verifyCheckoutAndCreateOrder){
      verifyCheckoutAndCreateOrder.subscribe( (resp) => {
          console.log(resp);
          if(resp){
            this.cartService.emptyCart();
            this.ordersService.removeCachedOrderData();
            this.ordersService.removeCachedSessionId();
          } else {
            this.router.navigate(['/']);
          }
        },
        () => {
          this.router.navigate(['/']);
        }
      );
    } else{
      this.router.navigate(['/']);
    }
  }
}