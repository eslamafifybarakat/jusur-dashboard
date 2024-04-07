import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { AuthService } from './../../../authentication/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


  constructor(
    // private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            // console.error('this is client side error');
            errorMsg = `${error.error.message}`;
          }
          else {
            // console.error('this is server side error');
            errorMsg = `${error.error.message}`;

          }
          if (error?.status == 500) {
            // this.router?.navigate(['/error-500']);
          }
          if (error?.status == 403) {
            // window.location.reload();
          }

          if (error?.status == 404) {
          }
          if (error?.status == 400) {
          }
          if (error?.status == 401) {
            //Remove all items in local storage, beacuse this request was expired from another device
            // this.authService?.signOut();
          }
          // console.error(errorMsg);
          return throwError(errorMsg);
        })
      )
  }
}
