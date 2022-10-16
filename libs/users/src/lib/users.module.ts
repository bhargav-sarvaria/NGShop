import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth/';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './state/users.reducer';
import { UsersEffects } from './state/users.effects';
import { UsersFacade } from './state/users.facade';
import { RegisterComponent } from './pages/register/register.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { EshopLoginComponent } from './pages/eshop-login/eshop-login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'loginEshop', component: EshopLoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
        EffectsModule.forFeature([UsersEffects]),
        NgOtpInputModule
    ],
    declarations: [LoginComponent, RegisterComponent, EshopLoginComponent],
    providers: [UsersFacade],
    exports: [
      LoginComponent,
      RegisterComponent,
      EshopLoginComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {}
