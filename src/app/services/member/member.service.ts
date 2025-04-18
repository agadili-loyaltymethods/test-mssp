import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from '../../app.config';
import { Url } from '../../enums/url';
import { ActivityHistory } from '../../models/activity-history';
import { Member } from '../../models/member';
import { Streaks } from '../../models/streaks';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  appConfig = inject(APP_CONFIG);

  private refreshMemberSubject = new BehaviorSubject<void>(undefined);
  refreshMember$ = this.refreshMemberSubject.asObservable();
  private isFetching = new BehaviorSubject<boolean>(false);
  isFetching$ = this.isFetching.asObservable();

  refreshMember() {
    this.refreshMemberSubject.next();
  }

  updateFetchingStatus(status: boolean = false) {
    this.isFetching.next(status);
  }

  getMember(loyaltyId: string = '1001'): Observable<any> {
    let url = `${this.appConfig.config.REST_URL}/api/v1/members/${loyaltyId}/profile?linked=true&divide=true`;
    return this.http.get<Member>(url, { params: { query: true } }).pipe(
      map(response => {
        return {
          ...response[0].member,
          loyaltyId: loyaltyId,
        };
      })
    );
  }

  getPromo(id: string, locationNum: string): Observable<any> {
    return this.http.get<any>(`${this.appConfig.config.REST_URL}/api/v1/members/${id}/rules?filter=promo${locationNum ? `&stores=${locationNum}` : ''}`);
  }

  getOffers(id: string, locationNum: string): Observable<any> {
    return this.http.get<any>(`${this.appConfig.config.REST_URL}/api/v1/members/${id}/offers?filter=offers,global${locationNum ? `&stores=${locationNum}` : ''}`);
  }

  getPerks(locationNum: string): Observable<any> {
    return this.http.get<any>(`${environment.REST_URL}/${Url.perks}`, { params: { query: locationNum } });
  }

  getVouchers(member: Member): Observable<any> {
    if (!member) {
      return throwError(() => new Error('Member data is required'));
    }

    const url = `${this.appConfig.config.REST_URL}/api/v1/rewardpolicies`;

    const currentTier = member.tiers?.find((tier: any) => tier.primary);
    if (!currentTier) {
      return throwError(() => new Error('No primary tier found for the member'));
    }

    const query = {
      intendedUse: "Reward",
      $or: [
        { tierPolicyLevels: { $exists: false } },
        { tierPolicyLevels: { $size: 0 } },
        {
          tierPolicyLevels: {
            $elemMatch: {
              policyId: currentTier.policyId,
              level: currentTier.level.name
            }
          }
        }
      ]
    };

    const finalUrl = `${url}?query=${encodeURIComponent(JSON.stringify(query))}`;
    console.log(`Fetching: ${finalUrl}`);

    return this.http.get<any>(finalUrl).pipe(
      catchError((error) => {
        console.error('Error fetching vouchers:', error);
        return throwError(() => error);
      })
    );
  }

  buyVoucher(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.REST_URL}/${Url.buy}`, payload);
  }

  getMemberVouchers(id: string): Observable<any> {
    return this.http.get<any>(`${this.appConfig.config.REST_URL}/api/v1/members/${id}/offers?filter=rewards`);
  }

  getActivityHistory(memberId: string): Observable<any> {
    return this.http.get<ActivityHistory[]>(`${this.appConfig.config.RC_REST_URL}/api/v1/activityhistories?query=${JSON.stringify({ memberID: memberId })}`);
  }

  getStreaks(id: string): Observable<Streaks[]> {
    return this.http.get<Streaks[]>(`${environment.REST_URL}/${Url.streaks}`, { params: { query: id } })
  }

  getAggregate({ week, year, metricName }): Observable<any> {
    const params = new HttpParams()
      .set('week', week)
      .set('year', year)
      .set('metricName', metricName);
    return this.http.get<any>(`${environment.REST_URL}/${Url.aggregate}`, { params })

  }

  // getMemberPoints(date: string, loyaltyId: string): Observable<any> {
  //   return this.http.get<any>(`${environment.REST_URL}/${Url.memberPoints}`, { params: { id: loyaltyId, date: date } });
  // }
}
