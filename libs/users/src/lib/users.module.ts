import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng//button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './state/users.reducer';
import { UsersEffects } from './state/users.effects';
import { UsersFacade } from './state/users.facade';

export const usersRoutes: Route[] = [{ path: 'login', component: LoginComponent }];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
        EffectsModule.forFeature([UsersEffects])
    ],
    declarations: [LoginComponent],
    providers: [UsersFacade]
})
export class UsersModule {}
