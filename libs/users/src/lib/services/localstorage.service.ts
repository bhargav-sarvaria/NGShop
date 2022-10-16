import { Injectable } from '@angular/core';
const TOKEN = 'jwtToken';
const FIREBASE = 'FIREBASE_USER_DATA';
const OTP_COUNT = 'OTP_COUNT';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setToken(data: string){
    localStorage.setItem(TOKEN, data);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  removeToken(){
    localStorage.removeItem(TOKEN);
  }

  getUserIdFromToken(){
    const token = this.getToken();
    if(token){
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if(tokenDecode) return tokenDecode.userId;
      else return null;
    } else {
      return null;
    }
  } 

  isValidToken(){
    const token = this.getToken();
    if(token){
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return !this._tokenExpired(tokenDecode.exp);
    } else {
      return false;
    }
  }

  private _tokenExpired(expiration): boolean {
    return Math.floor( new Date().getTime() / 1000 ) >=expiration;
  }

  setFirebaseUserData(value: string){
    localStorage.setItem(FIREBASE, value)
  }

  getFirebaseUserData(){
    return JSON.parse(localStorage.getItem(FIREBASE));
  }

  setItem(key: string, value: string){
    localStorage.setItem(key, value);
  }

  getItem(key: string){
    return localStorage.getItem(key);
  }
}
