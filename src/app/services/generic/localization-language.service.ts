import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { keys } from './../../shared/configs/localstorage-key';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalizationLanguageService {
  private currentLanguage: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location,
    private router: Router
  ) {
    this.currentLanguage = this.detectLanguage();
  }

  private detectLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(keys?.language) || 'ar'; // Default to 'ar' if not set
    }
    // Server-side language detection logic (e.g., from request headers)
    // For demonstration purposes, defaulting to 'ar'
    return 'ar';
  }

  updatePathAccordingLang(): string {
    const currentUrl = this.getCurrentUrl();
    const currentUrlSegments = currentUrl.startsWith('/') ? currentUrl.substring(1).split('/') : currentUrl.split('/');

    if (['ar', 'en', 'ru', 'zh'].includes(currentUrlSegments[0])) {
      currentUrlSegments[0] = this.currentLanguage;
    } else {
      currentUrlSegments.unshift(this.currentLanguage);
    }

    const newPath = '/' + currentUrlSegments.join('/');
    this.updatePath(newPath);
    return newPath;
  }

  getFullURL(): string {
    return this.updatePathAccordingLang();
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  updatePath(newPath: string): void {
    this.location.replaceState(newPath);
  }
}
