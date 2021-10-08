import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { Environment, ENVIRONMENT } from '@shreeshakti/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = env.apiUrl + 'products';
  }

  getProducts(categoriesFilter?: string[]): Observable<Product[]>{
    let params = new HttpParams();
    if(categoriesFilter) params = params.append('categories', categoriesFilter.join(','));
    return this.http.get<Product[]>(this.apiUrl, {params: params});
  }

  getProduct(productId: string): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post(this.apiUrl, product)
  }

  updateProduct(product: FormData, productId: string): Observable<Product> {
    return this.http.put(`${this.apiUrl}/${productId}`, product)
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`)
  }

  getProductsCount(): Observable<{productCount: string}> {
    return this.http.get<{productCount: string}>(`${this.apiUrl}/get/count`);
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get/featured/${count}`);
  }
}
