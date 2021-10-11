import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@shreeshakti/environment';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = env.apiUrl + 'search';
  }

  getResults(search: string): Observable<Product[]>{
    let params = new HttpParams();
    params = params.append('search', search);
    return this.http.get<Product[]>(this.apiUrl, {params: params});
  }
}
