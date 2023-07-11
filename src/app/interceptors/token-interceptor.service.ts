import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,from,switchMap,of,tap,map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.shouldIncludeAuthorization(req.url)) {
      return next.handle(req);
    } 

    const token = sessionStorage.getItem('token');

    const token$ = token ? of(token) : from(this.authService.getNewToken()).pipe(
      tap(({ access_token, success }) => {
        if (success) {
          sessionStorage.setItem('token', access_token);
        }
      }),
      map(({ access_token }) => access_token)
    );
  
    return token$.pipe(
      switchMap((access_token) => {
        const reqClone = req.clone({
          setHeaders: {
            Authorization: `Bearer ${access_token}`
          }
        });
        return next.handle(reqClone);
      })
    );

  }

  shouldIncludeAuthorization(url: string): boolean {
    return url.includes('api/v1/getAllMatches');
  }
}
