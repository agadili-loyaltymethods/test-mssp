import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { MemberService } from '../services/member/member.service';
import { catchError, map, of, switchMap, from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addMember } from '../states/actions/member.action';
import { AlertService } from '../services/alert/alert.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const loginService = inject(LoginService);
  const memberService = inject(MemberService);
  const alertService = inject(AlertService);
  const store = inject(Store);
  const router = inject(Router);

  return from(loginService.ensureAuthenticated()).pipe(
    switchMap((token) => {
      if (!token) {
        return of(router.createUrlTree(['/page-not-found']));
      }

      // If the token exists, just allow navigation
      return of(true);
    }),
    catchError(() => of(router.createUrlTree(['/page-not-found'])))
  );
};
