import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';

import { UsersEffects } from './users.effects';
import { UsersFacade } from './users.facade';
import { USERS_FEATURE_KEY, reducer } from './users.reducer';



describe('UsersFacade', () => {

    describe('used in NgModule', () => {
        beforeEach(() => {
            @NgModule({
                imports: [StoreModule.forFeature(USERS_FEATURE_KEY, reducer), EffectsModule.forFeature([UsersEffects])],
                providers: [UsersFacade]
            })
            class CustomFeatureModule {}

            @NgModule({
                imports: [NxModule.forRoot(), StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
            })
            class RootModule {}
            TestBed.configureTestingModule({ imports: [RootModule] });
        });

        /**
         * The initially generated facade::loadAll() returns empty array
         */
    });
});
