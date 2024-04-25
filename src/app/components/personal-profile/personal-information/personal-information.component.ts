import { keys } from './../../../shared/configs/localstorage-key';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { patterns } from './../../../shared/configs/patterns';
// Modules
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, catchError, tap } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MaxDigitsDirective } from '../../dashboard/directives/max-digits.directive';
// Services

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule,

    MaxDigitsDirective
  ],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent {
  private subscriptions: Subscription[] = [];

  currentLoginInformation: any;

  // Check National Identity Variables
  isLoadingCheckNationalIdentity: Boolean = false;
  nationalIdentityNotAvailable: Boolean = false;

  // BirthDate
  readonly minAge = 18;
  maxDate: any = new Date(new Date()?.getFullYear() - this.minAge, new Date()?.getMonth(), new Date()?.getDate());

  personalInfoForm = this.fb?.group(
    {
      fullName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      nationalIdentity: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      birthDate: [null, {
        validators: [
          Validators.required]
      }],
      email: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.email)], updateOn: "blur"
      }],
      phoneNumber: ['', {
        validators: [Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.personalInfoForm?.controls;
  }

  isFullNameReadOnly: boolean = true;
  isIdentityReadOnly: boolean = true;
  isPhoneNumberReadOnly: boolean = true;
  isEmailReadOnly: boolean = true;
  isBirthDateReadOnly: boolean = true;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private translate: TranslateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.loadPageData();
  }

  private loadPageData(): void {
    this.currentLoginInformation = this.authService.getCurrentUserInformationLocally();
    console.log(this.currentLoginInformation);

    this.currentLoginInformation ? this.patchValues() : '';
  }
  patchValues(): void {
    let convertedBirthDate: any = new Date(this.currentLoginInformation.birthDate);
    this.personalInfoForm.patchValue({
      fullName: this.currentLoginInformation.name,
      nationalIdentity: this.currentLoginInformation.identity,
      birthDate: convertedBirthDate,
      email: this.currentLoginInformation.email,
      phoneNumber: this.currentLoginInformation.phoneNumber
    });
  }


  onKeyUpEvent(type: string): void {
    if (type == 'nationalIdentity') {
      this.isLoadingCheckNationalIdentity = false;
    }

    this.publicService?.clearValidationErrors(this.formControls[type]);
    this.cdr.detectChanges();
  }
  clearCheckAvailable(type: string): void {
    if (type == 'nationalIdentity') {
      this.nationalIdentityNotAvailable = false;
    }
  }
  // Start Check If National Identity Unique
  checkNationalIdentityAvailable(): void {
    if (!this.formControls?.nationalIdentity?.valid) {
      return; // Exit early if National Identity is not valid
    }
    const identity: number | string = this.personalInfoForm?.value?.nationalIdentity;
    const data: any = { identity };
    this.isLoadingCheckNationalIdentity = true;
    let checkNationalIdentitySubscription: Subscription = this.publicService?.IsNationalIdentityAvailable(data).pipe(
      tap(res => this.handleNationalIdentityResponse(res)),
      catchError(err => this.handleNationalIdentityError(err))
    ).subscribe();
    this.subscriptions.push(checkNationalIdentitySubscription);
  }
  private handleNationalIdentityResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.nationalIdentityNotAvailable = !res.result;
    } else {
      this.nationalIdentityNotAvailable = false;
      this.handleNationalIdentityError(res?.message);
    }
    this.isLoadingCheckNationalIdentity = false;
    this.cdr.detectChanges();
  }
  private handleNationalIdentityError(err: any): any {
    this.nationalIdentityNotAvailable = false;
    this.isLoadingCheckNationalIdentity = false;
    this.handleError(err);
  }
  // End Check If National Identity Unique

  editInput(name: string): void {
    if (name == 'fullName') {
      this.isFullNameReadOnly = false;
    }
    if (name == 'identity') {
      this.isIdentityReadOnly = false;
    }
    if (name == 'email') {
      this.isEmailReadOnly = false;
    }
    if (name == 'phoneNumber') {
      this.isPhoneNumberReadOnly = false;
    }
    if (name == 'birthDate') {
      this.isBirthDateReadOnly = false;
    }
  }

  submit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.personalInfoForm?.valid) {
        this.publicService.validateAllFormFields(this.personalInfoForm);
        return;
      }
      this.publicService.showGlobalLoader.next(true);
      let data = {
        // fullName: this.personalInfoForm?.value?.fullName,
        // email: this.personalInfoForm?.value?.email,
        identity: this.personalInfoForm?.value?.nationalIdentity.toString(),
        phoneNumber: this.personalInfoForm?.value?.phoneNumber.toString(),
        birthDate: this.personalInfoForm?.value?.birthDate,
      };
      const updateProfileSubscription: any = this.authService?.updateProfile(data)?.pipe(
        tap(res => this.handleUpdateProfileResponse(res)),
        catchError(async (err) => this.handleError(err))
      ).subscribe();
      this.subscriptions.push(updateProfileSubscription);
    }
  }
  handleUpdateProfileResponse(res: any) {
    if (res?.success !== true) {
      this.handleError(res?.message);
      this.publicService.showGlobalLoader.next(false);
      return;
    }
    this.isFullNameReadOnly = true;
    this.isIdentityReadOnly = true;
    this.isPhoneNumberReadOnly = true;
    this.isEmailReadOnly = true;
    this.isBirthDateReadOnly = true;
    this.publicService.recallProfileDataFuntion.next(true);
    this.handleSuccess(res?.message);
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
