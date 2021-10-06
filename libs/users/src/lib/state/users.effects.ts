import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { UsersService } from '@shreeshakti/users';
import { concat, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LocalstorageService } from '../services/localstorage.service';

import * as UsersActions from './users.actions';
import * as UsersFeature from './users.reducer';

@Injectable()
export class UsersEffects {
    
    buidUserSession$ = createEffect(() => this.actions$.pipe(
        ofType(UsersActions.buildUserSession),

        concatMap(() => {
            if (this.localStorageService.isValidToken()) {
              const userId = this.localStorageService.getUserIdFromToken();
              if (userId) {
                return this.usersService.getUser(userId).pipe(
                  map((user) => {
                    return UsersActions.buildUsersSessionSuccess({ user: user });
                  }),
                  catchError(() => of(UsersActions.buildUsersSessionFailed()))
                );
              } else {
                return of(UsersActions.buildUsersSessionFailed());
              }
            } else {
              return of(UsersActions.buildUsersSessionFailed());
            }
          })
    ));

    constructor(
        private readonly actions$: Actions,
        private localStorageService: LocalstorageService,
        private usersService: UsersService
    ) {}
}
