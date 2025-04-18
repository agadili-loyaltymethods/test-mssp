import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { APP_CONFIG } from '../app.config';
import { Url } from '../enums/url';
import { Coupon } from '../models/coupon';
import { CouponList } from '../models/coupon-list';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private streakCache$: Observable<any> | null = null;
  appConfig = inject(APP_CONFIG);

  constructor(private http: HttpClient) { }


  // getPoints(payload: unknown, persist: boolean = false): Observable<unknown> {
  //   return this.http.post(`${environment.REST_URL}/${Url.activity}?persist=${persist}&filter=data,error`, payload);
  // }

  // getMultiplePoints(payload: unknown[], persist: boolean = false): Observable<unknown> {
  //   return this.http.post(`${environment.REST_URL}/${Url.activity}?persist=${persist}&filter=data,error`, payload);
  // }

  getPerks(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${environment.REST_URL}/${Url.rewardPolicy}`);
  }
  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${environment.REST_URL}/${Url.rewardPolicies}`);
  }

  getCouponList(id: string): Observable<CouponList[]> {
    return this.http.get<CouponList[]>(`${environment.REST_URL}/${Url.rewards}`, { params: { query: id } });
  }

  // getActivity(payload: unknown) {
  //   return this.http.post(`${environment.REST_URL}/${Url.activity}?filter=data,error?persist=false`, payload);
  // }

  getActivity(payload: any, persist = false) {
    const defaultValues = {
      srcChannelType: 'Web',
      loyaltyID: localStorage.getItem('loyaltyId') // Ensure this.loyaltyId is available in your service
    };

    const url = `${this.appConfig.config.REST_URL}/api/v1/activity?filter=data,error?persist=${persist}`;

    if (Array.isArray(payload)) {
      // Handling multiple activities
      return forkJoin(
        payload.map(item =>
          this.http.post(url, { ...item, ...defaultValues })
        )
      );
    } else {
      // Single activity request
      return this.http.post(url, { ...payload, ...defaultValues });
    }
  }

  getStreakPolicy() {
    if (!this.streakCache$) {
      const url = `${this.appConfig.config.REST_URL}/api/v1/streakPolicies?select=name,description,goalPolicies,timeLimit,ext`;

      this.streakCache$ = this.http.get<any>(url).pipe(
        shareReplay(1), // Cache the response for subscribers
        catchError((error) => {
          this.streakCache$ = null; // Reset cache on error
          return throwError(() => error);
        })
      );
    }
    return this.streakCache$;
  }
}
