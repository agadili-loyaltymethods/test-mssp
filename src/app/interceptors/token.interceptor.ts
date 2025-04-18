import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthHelper } from "../helpers/auth/auth.helper";
import { LoginService } from "../services/login/login.service";
import { from } from "rxjs";
 
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}
 
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem(AuthHelper.TOKEN_KEY);
 
        let clonedRequest = req;
 
        if (accessToken) {
            clonedRequest = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        }
 
        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Convert Promise to Observable using from()
                    return from(this.loginService.getToken()).pipe(
                        switchMap((newToken: string) => {
                            // Save new token and retry request
                            localStorage.setItem(AuthHelper.TOKEN_KEY, newToken);
                            const retryRequest = req.clone({
                                setHeaders: {
                                    'Authorization': `Bearer ${newToken}`
                                }
                            });
                            return next.handle(retryRequest);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}