import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { keys } from './../../shared/configs/localstorage-key';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.onLine) {
        let headers: any = {};

        // Set the 'locale' header based on the browser's language or a default value
        const browserLang = navigator.language || 'en'; // Fallback to English if the browser language is not available
        const storedLang = localStorage.getItem(keys.language) || browserLang;
        localStorage.setItem(keys.language, storedLang);
        headers['locale'] = storedLang;

        // Set the 'Authorization' header if the user is logged in
        if (this.authService.getToken() && this.authService.getToken() !== '') {
          headers['Authorization'] = `Bearer ${this.authService.getToken()}`;
        }

        // Clone the request with the new headers
        request = request.clone({ setHeaders: headers });
      }
    }

    return next.handle(request);
  }
}
