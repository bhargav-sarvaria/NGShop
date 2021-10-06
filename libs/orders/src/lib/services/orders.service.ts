import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { switchMap} from 'rxjs/operators';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  apiUrl = environment.apiUrl + 'orders';
  apiUrlProducts = environment.apiUrl + 'products';
  constructor(
    private http: HttpClient,
    private stripeService: StripeService) {
  }

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(orderId: string): Observable<Order>{
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  ;}

  updateOrder(orderStatus: {status: string}, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, orderStatus)
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${orderId}`)
  }

  getOrderCount(): Observable<{orderCount: string}> {
    return this.http.get<{orderCount: string}>(`${this.apiUrl}/get/count`);
  }

  // Using Pipe
  // getOrderCount(): Observable<number> {
    // return this.http
    // .get<number>(`${this.apiUrl}/get/count`)
    // .pipe(map((objectValue: any) => objectValue.orderCount));
  // }

  getTotalSales(): Observable<{totalsales: number}> {
    return this.http.get<{totalsales: number}>(`${this.apiUrl}/get/totalSales`);
  }

  getProduct(productId: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrlProducts}/${productId}`);
  }

  createCheckoutSession(orderItems: OrderItem[]){
    return this.http.post(`${this.apiUrl}/create-checkout-session`, orderItems)
    .pipe(
      switchMap((session: any)  =>{
        if(session.id){
          localStorage.setItem('sessionId', session.id);
        }
        return this.stripeService.redirectToCheckout({sessionId: session.id})
      })
    );
  }

  verifyCheckoutAndCreateOrder(){
    const sessionId = localStorage.getItem('sessionId');
    const orderObj = {sessionId: sessionId};
    if(!sessionId) return null;

    return this.http.post(`${this.apiUrl}/verify-checkout-session`, orderObj)
    .pipe(
      switchMap((resp: any)  =>{
        if(resp.payment_status == 'paid'){
          return this.createOrder(this.getCachedOrderData());
        } else{
          return null;
        }
      })
    );
  }

  getCachedSessionId(){
    return localStorage.getItem('sessionId');
  }

  removeCachedSessionId(){
    return localStorage.removeItem('sessionId');
  }

  cacheOrderData(order: Order){
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  getCachedOrderData(): Order{
    return JSON.parse(localStorage.getItem('orderData'));
  }

  removeCachedOrderData(){
    return localStorage.removeItem('orderData');
  }
}
