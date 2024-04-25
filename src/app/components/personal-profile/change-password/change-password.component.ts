import { ConfirmPasswordValidator } from './../../../shared/configs/confirm-password-validator';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../services/generic/alerts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { keys } from './../../../shared/configs/localstorage-key';
import { patterns } from './../../../shared/configs/patterns';


import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, catchError, tap } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PasswordModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  private subscriptions: Subscription[] = [];
  isPasswordChange: boolean = false;

  changePasswordForm = this.fb?.group({
    currentPassword: ['', { validators: [Validators.required], updateOn: 'blur' }],
    password: ['', { validators: [Validators.required], updateOn: 'blur' }],
    confirmPassword: ['', { validators: [Validators.required], updateOn: 'blur' }],
  },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  get formControls(): any {
    return this.changePasswordForm?.controls;
  }

  constructor(
    // private authFirebaseService: AuthFirebaseService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePasswordForm.get('password')?.valueChanges?.subscribe((res: any) => {
      this.changePasswordForm?.get('confirmPassword')?.setErrors(null);
      this.isPasswordChange = true;
    });
    this.changePasswordForm?.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.isPasswordChange = false;
    });
  }

  onFocusConfirmPassword(): void {
    this.isPasswordChange = false;
  }

  submit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.changePasswordForm?.valid) {
        this.publicService.validateAllFormFields(this.changePasswordForm);
        return;
      }
      let data = {
        currentPassword: this.changePasswordForm?.value?.currentPassword,
        newPassword: this.changePasswordForm?.value?.password
      };
      this.publicService.showGlobalLoader.next(true);
      const changePasswordSubscription: any = this.authService?.changePassword(data)?.pipe(
        tap(res => this.handleChangePasswordResponse(res)),
        catchError(async (err) => this.handleError(err))
      ).subscribe();
      this.subscriptions.push(changePasswordSubscription);
    }
  }
  handleChangePasswordResponse(res: any) {
    if (res?.success !== true) {
      this.handleError(res?.message);
      this.publicService.showGlobalLoader.next(false);
      return;
    }
    this.handleSuccess(res.message);
    this.authService.signOut();
    this.ref.close();
    this.router.navigate(['/Auth/Login']);
  }

  logOut(succesMsg: any): void {
    this.executeLogout(succesMsg);
  }
  private executeLogout(succesMsg: any): void {
    this.publicService.showGlobalLoader.next(true);
    const logout$ = this.authService.signOut().pipe(
      tap(res => this.handleLogoutResponse(res, succesMsg)),
      finalize(() => this.publicService.showGlobalLoader.next(false))
    );
    logout$.subscribe({
      error: (err: any) => this.alertsService.openToast('error', 'error', err)
    });
  }
  private handleLogoutResponse(res: any, succesMsg: any): void {
    if (res) {
      this.ref.close();
      this.handleSuccess(succesMsg);
      this.performLocalLogout();
      this.router.navigate(['/Login']);
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

  // Handle Api Errors Or Success
  private handleError(error: any): void {
    error ? this.alertsService?.openToast('error', 'error', error || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    this.publicService.showGlobalLoader.next(false);
  }
  private handleSuccess(msg: any): void {
    msg ? this.alertsService?.openToast('success', 'success', msg) : '';
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
