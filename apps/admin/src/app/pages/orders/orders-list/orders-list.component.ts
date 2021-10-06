import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Order, OrdersService, ORDER_STATUS} from '@shreeshakti/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }
    
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _getOrders(){
    this.orderService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe( (orders) => {
      this.orders = orders;
    });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/form/${orderId}`);
  }

  deleteOrder( orderId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this order ?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(orderId).pipe(takeUntil(this.endsubs$)).subscribe( () => {
          this._getOrders();
          this.messageService.add({severity:'success', summary:'Success', detail:'Order is deleted!'});
        }, () => {
          this.messageService.add({severity:'error', summary:'Success', detail:'Order is not deleted!'});
        });
      },
      reject: () => { }
    });
  }

}
