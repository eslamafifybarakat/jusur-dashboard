import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { keys } from './../../shared/configs/localstorage-key';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {
  currentUserInformation: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // This code will only run in the browser
      this.currentUserInformation = JSON.parse(window.localStorage.getItem(keys?.currentUserInformation) || '{}');
    } else {
      // Handle server-side logic or default values here
      this.currentUserInformation = {};
    }
  }

  public hasPermission(permissionKey: string): boolean {
    return this.currentUserInformation?.permissions?.includes(permissionKey);
  }
}
