import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { APP_CONFIG } from '../../app.config';
import { AuthHelper } from '../../helpers/auth/auth.helper';
import { Member } from '../../models/member';
import { addMember } from '../../states/actions/member.action';
import { AlertService } from '../alert/alert.service';
import { AuthService } from '../auth/auth.service';
import { MemberService } from '../member/member.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private pendingLoginRequest: Promise<string> | null = null;
  private member?: Member;
  appConfig = inject(APP_CONFIG);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private memberService: MemberService,
    private store: Store,
    private alertService: AlertService
  ) { }

  async login(): Promise<string> {
    if (this.pendingLoginRequest) {
      return this.pendingLoginRequest;
    }

    this.pendingLoginRequest = this.getTokenInternal();
    return this.pendingLoginRequest;
  }

  // Make getToken public for the interceptor to use
  async getToken(): Promise<string> {
    return this.login();
  }

  private async getTokenInternal(): Promise<string> {
    if (this.pendingLoginRequest) {
      return this.pendingLoginRequest;
    }

    this.pendingLoginRequest = (async () => {
      try {
        const response = await firstValueFrom(
          this.http.post<{ token: string }>(`${this.appConfig.config.REST_URL}/api/v1/login`, {
            username: 'demo/vgunasekaran',
            password: 'Password1',
          })
        );

        if (!response?.token) {
          throw new Error('Login failed');
        }

        this.authService.login(response.token);

        // Call the member API and store the member
        this.memberService.getMember().pipe(
          map((member: any) => {
            this.store.dispatch(addMember({ member }));
            localStorage.setItem('loyaltyId', member.loyaltyId);
          }),
          catchError((error) => {
            this.alertService.errorAlert(error?.error?.error || error?.message);
            return of(false);
          })
        ).subscribe(); // Ensure this executes

        return response.token;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        this.pendingLoginRequest = null;
      }
    })();

    return this.pendingLoginRequest;
  }

  async ensureAuthenticated(): Promise<string> {
    let token = AuthHelper.getToken();
    if (!token) {
      token = await this.login();
    }
    return token ?? '';
  }
}