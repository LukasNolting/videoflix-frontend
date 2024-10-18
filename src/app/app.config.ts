import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
  const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
  const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Token ${token}`)
  });
  return next(modifiedReq);
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor])),

    AppComponent,
    HttpClient,
]
};


