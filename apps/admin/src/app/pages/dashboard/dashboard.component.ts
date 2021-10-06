import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '@shreeshakti/orders';
import { ProductsService } from '@shreeshakti/products';
import { UsersService } from '@shreeshakti/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  statistics = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrderCount(),
      this.productsService.getProductsCount(),
      this.usersService.getUsersCount(),
      this.ordersService.getTotalSales()
    ]).pipe(takeUntil(this.endsubs$)).subscribe( (values) => {
      this.statistics = values;
    });
  }
  
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

}
