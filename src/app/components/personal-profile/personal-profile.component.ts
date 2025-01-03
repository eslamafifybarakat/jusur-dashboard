import { AuthService } from 'src/app/services/authentication/auth.service';
import { AlertsService } from './../../services/generic/alerts.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { keys } from './../../shared/configs/localstorage-key';
// Imports necessary for the component
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

// Configs and keys

// Modules and Components
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-personal-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PersonalInformationComponent
  ],
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  activeTab: number = 0;
  currentLoginInformation: any;

  constructor(
    private confirmationService: ConfirmationService,
    // private authFirebaseService: AuthFirebaseService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.publicService.recallProfileDataFuntion.subscribe((res: boolean) => {
      if (res == true) {
        this.getCurrentUserInformation();
      }
    });
    this.loadLoginInformation();
    this.subscribeToPageData();
  }
  private loadLoginInformation(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(keys.profileData);
      if (userData) {
        this.currentLoginInformation = JSON.parse(userData).user;
      }
    }
  }
  private subscribeToPageData(): void {
    this.publicService.pushUrlData.subscribe({
      next: (res: any) => this.handlePageData(res),
      error: (err: any) => this.alertsService.openToast('error', 'error', err)
    });
  }
  private handlePageData(res: any): void {
    if (res && res.page) {
      this.activeTab = res.page;
    }
  }
  setActiveTab(index: number): void {
    this.activeTab = index;
  }

  changePassword(): void {
    const ref = this.dialogService.open(ChangePasswordComponent, {
      header: this.publicService.translateTextFromJson('labels.changePassword'),
      dismissableMask: false,
      width: '35%'
    });
    ref.onClose.subscribe((res: boolean) => {
      if (res) {
        // Handle the change password close event
      }
    });
  }


  logOut(): void {
    const confirmationMessage = this.publicService.translateTextFromJson('general.areYouSureToLogout');
    const confirmationHeader = this.publicService.translateTextFromJson('general.logout');
    this.confirmationService.confirm({
      message: confirmationMessage,
      header: confirmationHeader,
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.executeLogout()
    });
  }
  private executeLogout(): void {
    this.publicService.showGlobalLoader.next(true);
    const logout$: any = this.authService.signOut().pipe(
      tap(res => this.handleLogoutResponse(res)),
      finalize(() => this.publicService.showGlobalLoader.next(false))
    );
    logout$.subscribe({
      error: (err: any) => this.alertsService.openToast('error', 'error', err)
    });
  }
  private handleLogoutResponse(res: any): void {
    if (res) {
      this.performLocalLogout();
      this.router.navigate(['/home']);
    } else {
      const errorMessage = res.message || '';
      if (errorMessage) {
        this.alertsService.openToast('error', 'error', errorMessage);
      }
    }
  }
  private performLocalLogout(): void {
    localStorage.removeItem(keys.prepareStepData);
    localStorage.removeItem(keys.saveTripData);
    localStorage.removeItem(keys.logged);
    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.userData);
    localStorage.removeItem(keys.profileData);
    localStorage.removeItem(keys.userLoginData);
    this.publicService.userAuthenicationChanged.next(true);
    // this.authFirebaseService.logout();
  }

  // Start Current User Information Functions
  private getCurrentUserInformation(): void {
    let currentInfoSubscription: Subscription = this.authService?.getCurrentUserInformation()?.pipe(
      tap(res => this.handleSuccessCuurentUserInformation(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(currentInfoSubscription);
  }
  private handleSuccessCuurentUserInformation(res: any): void {
    if (res?.success == true) {
      this.authService.saveCurrentUserInformation(res?.result);
      this.publicService.showGlobalLoader.next(false);
      this.publicService.recallProfileDataFuntion.next(false);
    } else {
      this.handleError(res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
  }
  // End Current User Information Functions

  // Handle Api Errors Or Success
  private handleError(err: any): any {
    this.setErrorMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
    this.publicService.showGlobalLoader.next(false);
    this.router.navigate(['/Dashboard']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
