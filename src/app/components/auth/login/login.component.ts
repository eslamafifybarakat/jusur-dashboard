// Components
import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';

// Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { patterns } from './../../../shared/configs/patterns';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, catchError, tap } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { Component } from '@angular/core';
@Component({
  standalone: true,
  imports: [
    // Components
    LanguageSelectorComponent,

    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CheckboxModule,
    PasswordModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private subscriptions: Subscription[] = [];

  loginForm = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.pattern(patterns.email)], updateOn: 'blur' }],
    password: ['', { validators: Validators.required, updateOn: 'blur' }],
    remember: [false, []],
  });
  get formControls(): any {
    return this.loginForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private authService: AuthService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تسجيل الدخول',
      description: 'تسجيل الدخول',
      image: 'https://avatars.githubusercontent.com/u/52158422?s=48&v=4'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

   // Start Login Functions
  loginNow(): void {
    if (this.loginForm?.valid) {
      this.publicService.showGlobalLoader.next(true);
      let data = {
        email: this.loginForm?.value?.email,
        password: this.loginForm?.value?.password,
      };
      //Send Request to login
      let loginSubscription: Subscription = this.authService?.login(data)?.pipe(
        tap(res => this.handleSuccessLoggedIn(res)),
        catchError(err => this.handleError(err))
      ).subscribe();
      this.subscriptions.push(loginSubscription);
    } else {
      this.publicService.validateAllFormFields(this.loginForm);
    }
  }
  private handleSuccessLoggedIn(res: any): void {
    if (res?.success == true) {
      this.authService.saveUserLoginData(res?.data);
      this.authService.saveToken(res?.token);
      this.getCurrentUserInformation();
    } else {
      this.handleError(res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
  }
   // End Login Functions

  // Start Current User Information Functions
  private getCurrentUserInformation(): void {
    let loginSubscription: Subscription = this.authService?.getCurrentUserInformation()?.pipe(
      tap(res => this.handleSuccessCuurentUserInformation(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(loginSubscription);
  }
  private handleSuccessCuurentUserInformation(res: any): void {
    if (res?.success == true) {
      this.authService.saveCurrentUserInformation(res?.result);
      this.publicService.showGlobalLoader.next(false);
      this.router.navigate(['/Dashboard']);
    } else {
      this.handleError(res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
  }
  // End Current User Information Functions

  back(): void {
    this.location.back();
  }

  /* --- Handle api requests error messages --- */
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
