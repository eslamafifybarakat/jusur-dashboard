import { AuthService } from '../../../services/authentication/auth.service';
import { PublicService } from './../../../services/generic/public.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule, ConfirmDialogModule],
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  phone: string = '295768795';
  currentUserInfo: any;
  currentLanguage: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private publicService: PublicService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.currentLanguage = this.publicService.getCurrentLanguage();
  }

  getCurrentUserInfo(): void {
    this.currentUserInfo = this.authService.getCurrentUserInformationLocally();
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
