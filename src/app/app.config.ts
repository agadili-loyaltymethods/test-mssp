import { APP_INITIALIZER, ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { reducers } from './states/reducers';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

interface Config {
  config: {
    REST_URL: string,
    RC_REST_URL: string
  }
}
const CONFIG: any = {};
export const APP_CONFIG = new InjectionToken<Config>('app.config');

function initializeAppFactory(httpClient: HttpClient): () => Observable<any> {
  return () =>
    httpClient.get<Config>(`${environment.REST_URL}/init`).pipe(
      tap((config) =>
        Object.assign(CONFIG, { ...config })
      )
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient],
      multi: true,
    },
    { provide: APP_CONFIG, useValue: CONFIG },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    provideStore(reducers),
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ]
};
