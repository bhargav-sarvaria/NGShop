import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { AuthGuardEshop } from '@shreeshakti/users';


export const ordersRoutes: Route[] = [
    {path: 'cart', component: CartPageComponent},
    {path: 'checkout', component: CheckoutPageComponent, canActivate: [AuthGuardEshop]},
    {path: 'success', component: ThankYouComponent}
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ordersRoutes), 
        FormsModule,
        ReactiveFormsModule,
        BadgeModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        InputMaskModule,
        DropdownModule
    ],
    declarations: [
      CartIconComponent,
      CartPageComponent,
      OrderSummaryComponent,
      CheckoutPageComponent,
      ThankYouComponent
    ],
    exports: [CartIconComponent, CartPageComponent, OrderSummaryComponent, CheckoutPageComponent, ThankYouComponent]
})
export class OrdersModule {
    constructor(cartService: CartService){
        cartService.initCartLocalStorage();
    }
}
