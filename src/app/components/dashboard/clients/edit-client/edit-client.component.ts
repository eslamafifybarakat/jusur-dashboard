// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../../shared/skeleton/skeleton/skeleton.component';
import { RecordsComponent } from '../../records/records.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { MaxDigitsDirective } from '../../directives/max-digits.directive';
import { patterns } from './../../../../shared/configs/patterns';
import { ClientsService } from '../../services/clients.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    CommonModule,
    FormsModule,

    // Components
    UploadMultiFilesComponent,
    DynamicSvgComponent,
    SkeletonComponent,
    RecordsComponent,

    // Directive
    MaxDigitsDirective
  ],
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {
  private subscriptions: Subscription[] = [];

  clientId: number;
  isLoadingClientDetails: boolean = false;
  clientDetails: any;

  isFullNameReadOnly: boolean = true;
  isNationalIdentityReadOnly: boolean = true;
  isPhoneNumberReadOnly: boolean = true;
  isEmailReadOnly: boolean = true;
  isBirthDateReadOnly: boolean = true;

  // filesNames: any = [
  //   { name: 'name1', image: 'assets/images/navbar/sidebar-bg.svg' }
  // ];
  // imgIndex: any = 0;

  // BirthDate
  readonly minAge = 18;
  maxDate: any = new Date(new Date()?.getFullYear() - this.minAge, new Date()?.getMonth(), new Date()?.getDate());

  editClientForm = this.fb?.group(
    {
      fullName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      nationalIdentity: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.nationalIdentity)], updateOn: "blur"
      }],
      phoneNumber: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
      email: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.email)], updateOn: "blur"
      }],
      birthDate: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.editClientForm?.controls;
  }

  // Check National Identity Variables
  isLoadingCheckNationalIdentity: Boolean = false;
  nationalIdentityNotAvailable: Boolean = false;

  // Check Email Variables
  isLoadingCheckEmail: Boolean = false;
  emailNotAvailable: Boolean = false;

  // Check Phone Variables
  isLoadingCheckPhone: Boolean = false;
  phoneNotAvailable: Boolean = false;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private clientsService: ClientsService,
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.loadPageData();
  }
  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.clientId = params['id'];
      if (this.clientId) {
        this.getClientById(this.clientId);
        // this.fullPageUrl = environment.publicUrl + this.localizationLanguageService.getFullURL();
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل العملاء',
      description: 'الوصف',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  // Upload Gallery imgs
  // uploadFiles(e: any): void {
  //   this.filesNames = e.files;
  //   console.log(e.files);

  // }
  patchValue(): void {
    let convertPhoneNumber: any = parseInt(this.clientDetails?.phoneNumber);
    let convertNationalIdentity: any = parseInt(this.clientDetails?.identity);
    let convertBirthDate: any = new Date(this.clientDetails?.birthDate);

    this.editClientForm?.patchValue({
      fullName: this.clientDetails?.name,
      nationalIdentity: convertNationalIdentity,
      phoneNumber: convertPhoneNumber,
      birthDate: convertBirthDate,
      email: this.clientDetails?.email
    })
  }
  editInput(name: string): void {
    if (name == 'fullName') {
      this.isFullNameReadOnly = false;
    }
    if (name == 'nationalIdentity') {
      this.isNationalIdentityReadOnly = false;
    }
    if (name == 'birthDate') {
      this.isBirthDateReadOnly = false;
    }
    if (name == 'phoneNumber') {
      this.isPhoneNumberReadOnly = false;
    }
    if (name == 'email') {
      this.isEmailReadOnly = false;
    }
  }

  // Start Get Client By Id
  getClientById(id: number | string): void {
    this.isLoadingClientDetails = true;
    let subscribeGetClient: Subscription = this.clientsService?.getClientById(id).pipe(
      tap(res => this.handleGetClientSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeGetClient);
  }
  private handleGetClientSuccess(response: any): void {
    if (response?.success) {
      this.clientDetails = response.result;
      this.patchValue();
      this.isLoadingClientDetails = false;
    } else {
      this.isLoadingClientDetails = false;
      this.handleError(response?.message);
    }
  }
  // End Get Client By Id

  onKeyUpEvent(type: string): void {
    if (type == 'nationalIdentity') {
      this.isLoadingCheckNationalIdentity = false;
    }
    if (type == 'email') {
      this.isLoadingCheckEmail = false;
    }
    if (type == 'phoneNumber') {
      this.isLoadingCheckPhone = false;
    }
    this.publicService?.clearValidationErrors(this.formControls[type]);
    this.cdr.detectChanges();
  }
  clearCheckAvailable(type: string): void {
    if (type == 'nationalIdentity') {
      this.nationalIdentityNotAvailable = false;
    }
    if (type == 'email') {
      this.emailNotAvailable = false;
    }
    if (type == 'phoneNumber') {
      this.phoneNotAvailable = false;
    }
  }
  // Start Check If National Identity Unique
  checkNationalIdentityAvailable(): void {
    if (!this.formControls?.nationalIdentity?.valid) {
      return; // Exit early if National Identity is not valid
    }
    if (this.editClientForm.value.nationalIdentity == this.clientDetails.identity) {
      return;
    }
    const identity: number | string = this.editClientForm?.value?.nationalIdentity;
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
    this.nationalIdentityNotAvailable = true;
    this.isLoadingCheckNationalIdentity = false;
    this.handleError(err);
  }
  // End Check If National Identity Unique

  //  Start Check If Email Unique
  checkEmailAvailable(): void {
    if (!this.formControls?.email?.valid) {
      return; // Exit early if email is not valid
    }
    if (this.editClientForm.value.email == this.clientDetails.email) {
      return;
    }
    const email: string = this.editClientForm?.value?.email;
    const data: any = { email };
    this.isLoadingCheckEmail = true;

    let checkEmailSubscription: Subscription = this.publicService?.IsEmailAvailable(data).pipe(
      tap(res => this.handleEmailResponse(res)),
      catchError(err => this.handleEmailError(err))
    ).subscribe();
    this.subscriptions.push(checkEmailSubscription);
  }
  private handleEmailResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.emailNotAvailable = !res.result;
    } else {
      this.emailNotAvailable = false;
      this.handleEmailError(res?.message);
    }
    this.isLoadingCheckEmail = false;
    this.cdr.detectChanges();
  }
  private handleEmailError(err: any): any {
    this.emailNotAvailable = true;
    this.isLoadingCheckEmail = false;
    this.handleError(err);
  }
  //  End Check If Email Unique

  //  Start Check If Phone Unique
  checkPhoneAvailable(): void {
    if (!this.formControls?.phoneNumber?.valid) {
      return; // Exit early if phoneNumber is not valid
    }
    if (this.editClientForm.value.phoneNumber == this.clientDetails.phoneNumber) {
      return;
    }
    const phone: number | string = this.editClientForm?.value?.phoneNumber;
    const data: any = {
      countryCode: "+996",
      phoneNumber: phone
    };
    this.isLoadingCheckPhone = true;

    let checkPhoneSubscription: Subscription = this.publicService?.IsPhoneAvailable(data).pipe(
      tap(res => this.handlePhoneResponse(res)),
      catchError(err => this.handlePhoneError(err))
    ).subscribe();
    this.subscriptions.push(checkPhoneSubscription);
  }
  private handlePhoneResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.phoneNotAvailable = !res.result;
    } else {
      this.phoneNotAvailable = false;
      this.handlePhoneError(res?.message);
    }
    this.isLoadingCheckPhone = false;
    this.cdr.detectChanges();
  }
  private handlePhoneError(err: any): any {
    this.phoneNotAvailable = true;
    this.isLoadingCheckPhone = false;
    this.handleError(err);
  }
  // End Check If Phone Unique

  // Start Edit Client
  submit(): void {
    console.log(this.editClientForm.value);
    if (this.editClientForm?.valid) {
      const formData = this.extractFormData();
      this.editClient(formData);
    } else {
      this.publicService?.validateAllFormFields(this.editClientForm);
    }
  }
  private extractFormData(): any {
    return {
      name: this.editClientForm?.value?.fullName,
      email: this.editClientForm?.value?.email,
      identity: this.editClientForm?.value?.nationalIdentity?.toString(),
      birthDate: this.editClientForm?.value?.birthDate,
      countryCode: "+966",
      phoneNumber: this.editClientForm?.value?.phoneNumber?.toString()
    };
  }
  private editClient(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeEditClient = this.clientsService?.editClient(formData, this.clientId)?.pipe(
      tap(res => this.handleEditClientSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeEditClient);
  }
  private handleEditClientSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success) {
      // this.router.navigate(['/Dashboard/Clients']);
      this.isFullNameReadOnly = true;
      this.isNationalIdentityReadOnly = true;
      this.isPhoneNumberReadOnly = true;
      this.isEmailReadOnly = true;
      this.isBirthDateReadOnly = true;
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Edit Client

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
    this.isLoadingClientDetails = false;
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type: string): void {
    this.alertsService.openToast(type, type, message);
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
