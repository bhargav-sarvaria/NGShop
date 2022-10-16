import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Environment, ENVIRONMENT } from '@shreeshakti/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLUsers: string;
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalstorageService,
    private router: Router,
    @Inject(ENVIRONMENT) private env: Environment
  ){
    this.apiURLUsers = this.env.apiUrl + 'users';
    console.log(this.apiURLUsers);
   }

  login(phone: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURLUsers}/login`, { phone, password});
  }

  register(user: User): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURLUsers}/register`, user);
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }

  phoneNumberExists(phone: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURLUsers}/phoneNumberExists`, {phone: phone});  
  }

  loginWithOtp(phone: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURLUsers}/loginWithOtp`, {phone: phone});  
  }
}
