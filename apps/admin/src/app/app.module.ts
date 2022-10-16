import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// importing NGRX 
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxStripeModule } from 'ngx-stripe';

// importing App Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';

// Importing Libraries
import { CategoriesService, ProductsService } from '@shreeshakti/products';
import { JwtInterceptor, UsersModule } from '@shreeshakti/users';
import { ENVIRONMENT } from '@shreeshakti/environment';
import { environment } from '@env/environment';

// Prime NG Modules
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';



const UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  InputTextModule,
  ToastModule,
  ConfirmDialogModule,
  ColorPickerModule,
  InputNumberModule,
  InputTextareaModule,
  InputSwitchModule,
  DropdownModule,
  EditorModule,
  TagModule,
  InputMaskModule,
  FieldsetModule
];

@NgModule({
    declarations: [AppComponent,
       DashboardComponent, 
       ShellComponent, 
       SidebarComponent, 
       CategoriesListComponent, 
       CategoriesFormComponent, 
       ProductsListComponent, 
       ProductsFormComponent, 
       UsersFormComponent, 
       UsersListComponent, 
       OrdersDetailComponent, 
       OrdersListComponent
      ],
    imports: [
      BrowserModule, 
      BrowserAnimationsModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      UsersModule,
      NgxStripeModule.forRoot('pk_test_51JgpF9SFKCCo7idylSOiEQQ1mT4AS0o3S7MvV9l8jBtj80Lhj1z0lG8PBIUue5xiP42SIQEU7GEII93jvFsKMCHR00aEHjkrLM'),
      ...UX_MODULE
    ],
    providers: [
      CategoriesService,
      ProductsService,
      MessageService,
      Location,
      ConfirmationService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: ENVIRONMENT, useValue: environment }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
