import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Url } from '../../enums/url';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private cache: Record<string, any> = {};
  private productsCache$: Observable<any> | null = null;
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    if (!this.cache['allProducts']) {
      this.cache['allProducts'] =  this.http
        .get<any>(`${environment.REST_URL}/${Url.products}`)
        .pipe(
          shareReplay(1), // Caches the response for subscribers
          catchError((error) => {
            this.cache['allProducts'] = null; // Reset cache on error
            throw error;
          })
        );
    }
    return this.cache['allProducts'];
  }

  getOtherProducts(category: string, subcategory?: string): Observable<any> {
    const params: any = { category };
    if (subcategory) {
      params.subcategory = subcategory;
    }
    if (!this.cache[`${category}_${subcategory}`]) {
      this.cache[`${category}_${subcategory}`]= this.http
        .get(`${environment.REST_URL}/${Url.otherProducts}`, { params })
        .pipe(
          shareReplay(1), // Caches the response for subscribers
          catchError((error) => {
            this.cache[`${category}_${subcategory}`] = null; // Reset cache on error
            throw error;
          })
        );
    }
    return this.cache[`${category}_${subcategory}`];
  }


  clearCache() {
    this.cache = {}
  }
}
