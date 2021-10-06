import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoriesService, ProductsModule } from '@shreeshakti/products';
import { MessagesComponent } from './shared/messages/messages.component';
import { NavComponent } from './shared/nav/nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { UiModule } from '@shreeshakti/ui';
import { OrdersModule } from '@shreeshakti/orders';
import {JwtInterceptor, UsersModule } from '@shreeshakti/users';

import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';



const routes: Routes = [
  {path:'', component: HomePageComponent},
  // {path: 'products', component: ProductListComponent}
]

@NgModule({
  declarations: [AppComponent,
   HomePageComponent,
   HeaderComponent, 
   FooterComponent, 
   NavComponent, 
   SidenavListComponent, 
   MessagesComponent
  ],

  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), 
    BrowserAnimationsModule, 
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    ProductsModule,
    AccordionModule,
    ToastModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    UiModule,
    OrdersModule,
    UsersModule,
    NgxStripeModule.forRoot('pk_test_51JgpF9SFKCCo7idylSOiEQQ1mT4AS0o3S7MvV9l8jBtj80Lhj1z0lG8PBIUue5xiP42SIQEU7GEII93jvFsKMCHR00aEHjkrLM')
  ],
  providers: [
    CategoriesService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
