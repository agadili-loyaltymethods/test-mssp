import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err: HttpResponse<unknown>) => {
                if (err.status === 401) {
                    this.router.navigate(['/login'])
                }
                //@ts-ignore
                if(err.error?.errors?.length){
                //@ts-ignore
                    err.message = err.error?.errors[0].message
                }
                return throwError(() => err)
            })
        );
    }
}