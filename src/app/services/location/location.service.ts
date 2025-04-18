import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { APP_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private http: HttpClient = inject(HttpClient);
  private locationsCache$: Observable<any> | null = null;
  appConfig = inject(APP_CONFIG);

  getLocations(sort?: string | number): Observable<any> {
    if (!this.locationsCache$) {
      let url = `${this.appConfig.config.REST_URL}/api/v1/locations`;
      if (sort !== undefined) {
        url += `&sort=${sort}`;
      }

      this.locationsCache$ = this.http.get<any[]>(url).pipe(
        map((data) => (Array.isArray(data) ? data : [data])),
        map((data: any[]) => data.sort((a, b) => a.name.localeCompare(b.name))),
        catchError((error) => {
          this.locationsCache$ = null; // Reset cache on error
          return throwError(() => error);
        }),
        shareReplay(1) // Cache response for future calls
      );
    }
    return this.locationsCache$;
  }

}
