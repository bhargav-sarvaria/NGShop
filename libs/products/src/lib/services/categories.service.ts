import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { Environment, ENVIRONMENT } from '@shreeshakti/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = env.apiUrl + 'categories';
  }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(categoryId: string): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/${categoryId}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post(this.apiUrl, category)
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put(`${this.apiUrl}/${category.id}`, category)
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}`)
  }
}
