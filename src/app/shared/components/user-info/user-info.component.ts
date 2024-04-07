import { AuthService } from '../../../services/authentication/auth.service';
import { PublicService } from './../../../services/generic/public.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { keys } from '../../configs/localstorage-key';
import { TranslateModule } from '@ngx-translate/core';
import { userInfoMenu } from './user-info-menu-list';
import { ConfirmationService } from 'primeng/api';
interface MenuItem {
  id?: string;
  text: string;
  icon: string;
  routerLink?: string;
}
@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  currentLanguage: string;
  userInfoList: MenuItem[] = userInfoMenu;

  constructor(
    private confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private router: Router,
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  logOut(): void {
    this.confirmationService?.confirm({
      message: this.publicService.translateTextFromJson('general.areYouSureToLogout'),
      header: this.publicService.translateTextFromJson('general.logout'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.signOut();
      }
    });

  }
}
