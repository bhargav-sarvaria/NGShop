import { Injectable, Inject } from '@angular/core';
import { Environment, ENVIRONMENT } from '@shreeshakti/environment';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  apiUrl: string;
  constructor(
    private localStorageService: LocalstorageService,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = this.env.apiUrl;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.localStorageService.getToken();
    const isAPIUrl = request.url.startsWith(this.apiUrl);

    if(token && isAPIUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
