import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { User } from '@shreeshakti/users';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLUsers = environment.apiUrl + 'users';
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalstorageService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`${this.apiURLUsers}/login`, { email, password});
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }
}
