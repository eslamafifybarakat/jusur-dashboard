import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { keys } from './../../shared/configs/localstorage-key';
import { roots } from './../../shared/configs/roots';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Start Authentication Storage Functions
  saveUserLoginData(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keys.userLoginData, JSON.stringify(data));
    }
  }
  removeUserLoginData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(keys.userLoginData);
    }
  }
  getUserLoginDataLocally(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(keys.userLoginData) || '{}');
    }
    return {};
  }
  saveCurrentUserInformation(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keys.currentUserInformation, JSON.stringify(data));
    }
  }
  removeCurrentUserInformation(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(keys.currentUserInformation);
    }
  }
  getCurrentUserInformationLocally(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(keys.currentUserInformation) || '{}');
    }
    return {};
  }
  saveToken(jwt: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keys.accessToken, jwt);
    }
  }
  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(keys.accessToken) || '';
    }
    return '';
  }
  saveEncToken(enc_token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keys.enc_AccessToken, enc_token);
    }
  }
  getEncToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(keys.enc_AccessToken) || '';
    }
    return '';
  }
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(keys.userLoginData) ? true : false;
    }
    return false;
  }
  // End Authentication Storage Functions

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.login}`, data);
  }
  getCurrentUserInformation(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${roots.auth.currentUserInformation}`);
  }
  forgetPassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.forgetPassword}`, email);
  }
  validateCode(code: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.validateCode}`, code);
  }
  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.resetPassword}`, data);
  }
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.register}`, data);
  }
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${roots.auth.updateProfile}`, data);
  }
  isEmailAvailable(emailAddress: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${roots.auth.isEmailAvailable}`, { emailAddress });
  }
  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(keys.userLoginData);
      localStorage.removeItem(keys.currentUserInformation);
      localStorage.removeItem(keys.accessToken);
      localStorage.removeItem(keys.enc_AccessToken);
    }
    this.router.navigate(['/Auth/Login']);
  }
}
