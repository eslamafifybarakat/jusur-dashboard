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
  ],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent {
  private subscriptions: Subscription[] = [];

  currentLoginInformation: any;

  genders: any[] = [];
  isLoadingGenders: boolean = false; // This should be controlled based on actual data loading status

  // BirthDate
  readonly minAge = 18;
  maxDate: any = new Date(new Date()?.getFullYear() - this.minAge, new Date()?.getMonth(), new Date()?.getDate());

  personalInfoForm = this.fb?.group(
    {
      firstName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      lastName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      email: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.email)], updateOn: "blur"
      }],
      gender: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      phoneNumber: ['', {
        validators: [Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
      // birthDate: [null, {
      //   validators: [
      //     Validators.required]
      // }],
    }
  );
  get formControls(): any {
    return this.personalInfoForm?.controls;
  }

  isFirstNameReadOnly: boolean = true;
  isLastNameReadOnly: boolean = true;
  isPhoneNumberReadOnly: boolean = true;
  isEmailReadOnly: boolean = true;
  isBirthDateReadOnly: boolean = true;
  isGenderReadOnly: boolean = true;

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
    this.loadGenders();
    this.translate.onLangChange.subscribe(() => {
      this.loadGenders();  // Reload genders on language change
      this.loadPageData();
    });
  }
  private loadGenders() {
    this.genders = [
      { label: this.translate.instant('general.male'), value: 'male' },
      { label: this.translate.instant('general.female'), value: 'female' }
    ];
    this.cdr.markForCheck();  // Trigger change detection to update the view
  }
  private loadPageData(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (JSON.parse(window?.localStorage?.getItem(keys?.profileData) || '{}')) {
        this.currentLoginInformation = JSON.parse(window?.localStorage?.getItem(keys?.profileData) || '{}');
        this.patchValues();
      }
    }
  }
  patchValues(): void {
    this.personalInfoForm.patchValue({
      firstName: this.currentLoginInformation.first_name,
      lastName: this.currentLoginInformation.last_name,
      email: this.currentLoginInformation.email,
      gender: this.currentLoginInformation.gender == 'male' ? this.genders[0] : this.currentLoginInformation.gender == 'female' ? this.genders[0] : null,
      phoneNumber: this.currentLoginInformation.phone
    });
  }

  editInput(name: string): void {
    if (name == 'firstName') {
      this.isFirstNameReadOnly = false;
    }
    if (name == 'lastName') {
      this.isLastNameReadOnly = false;
    }
    if (name == 'email') {
      this.isEmailReadOnly = false;
    }
    if (name == 'gender') {
      this.isGenderReadOnly = false;
    }
    if (name == 'phoneNumber') {
      this.isPhoneNumberReadOnly = false;
    }
    // if (name == 'birthDate') {
    //   this.isBirthDateReadOnly = false;
    // }
  }

  submit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.personalInfoForm?.valid) {
        this.publicService.validateAllFormFields(this.personalInfoForm);
        return;
      }
      this.publicService.showGlobalLoader.next(true);
      let genderValue: any = this.personalInfoForm?.value?.gender;
      let data = {
        first_name: this.personalInfoForm?.value?.firstName,
        last_name: this.personalInfoForm?.value?.lastName,
        email: this.personalInfoForm?.value?.email,
        phone: this.personalInfoForm?.value?.phoneNumber,
        gender: genderValue?.value
      };
      const updateProfileSubscription: any = this.authService?.updateProfile(data)?.pipe(
        tap(res => this.handleUpdateProfileResponse(res)),
        catchError(async (err) => this.handleError(err))
      ).subscribe();
      this.subscriptions.push(updateProfileSubscription);
    }
  }
  handleUpdateProfileResponse(res: any) {
    if (res?.code !== 200) {
      this.handleError(res?.message);
      this.publicService.showGlobalLoader.next(false);
      return;
    }
    this.isFirstNameReadOnly = true;
    this.isLastNameReadOnly = true;
    this.isPhoneNumberReadOnly = true;
    this.isEmailReadOnly = true;
    this.isBirthDateReadOnly = true;
    this.isGenderReadOnly = true;
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
