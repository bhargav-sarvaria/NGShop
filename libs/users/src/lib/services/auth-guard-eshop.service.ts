import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEshop implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalstorageService
  ) { }

  canActivate() {
    const token = this.localStorageService.getToken();
    if(token){
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if(!this._tokenExpired(tokenDecode.exp)){
        return true;
      }
    } 

    this.router.navigate(['/loginEshop'], { queryParams: { referer:'/checkout'}})
    return false;
  }


  private _tokenExpired(expiration): boolean {
    return Math.floor( new Date().getTime() / 1000 ) >=expiration;
  }
}