import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { AuthHelper } from '../../helpers/auth/auth.helper';
import { LoginService } from '../login/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private loginService: LoginService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Get the token from AuthHelper
        let token = AuthHelper.getToken();

        // If we have a token, add it to the request
        if (token) {
            request = this.addTokenToRequest(request, token);
            return this.handleRequest(request, next);
        }
        // If no token, try to get one first
        else {
            // Convert the Promise to an Observable
            return from(LoginService.getToken()).pipe(
                switchMap(token => {
                    const authRequest = this.addTokenToRequest(request, token);
                    return this.handleRequest(authRequest, next);
                })
            );
        }
    }

    private addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handleRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token might be expired, clear it and redirect to login
                    AuthHelper.removeToken();
                    this.router.navigate(['/login']);
                }

                // Create a custom error with formatted message
                let errorMessage = 'An error occurred';

                if (error.error?.errors?.length) {
                    errorMessage = error.error.errors[0].message;
                } else if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                // Return a new error with the formatted message
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}