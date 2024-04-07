// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { FileUploadComponent } from '../../../../shared/components/upload-files/file-upload/file-upload.component';
import { EmployeesVehiclesListComponent } from '../../employees-vehicles-list/employees-vehicles-list.component';
import { SkeletonComponent } from './../../../../shared/skeleton/skeleton/skeleton.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from '../../../../services/generic/public.service';
import { MaxDigitsDirective } from '../../directives/max-digits.directive';
import { RecordsService } from '../../services/records.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

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
    EmployeesVehiclesListComponent,
    UploadMultiFilesComponent,
    FileUploadComponent,
    SkeletonComponent,

    // Directive
    MaxDigitsDirective
  ],
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent {
  private subscriptions: Subscription[] = [];

  isRecordNameReadOnly: boolean = true;
  isRegistrationNumberReadOnly: boolean = true;
  isRecordDateReadOnly: boolean = true;
  isLicenseNumberReadOnly: boolean = true;
  isLicenseDateReadOnly: boolean = true;
  isCertificateNumberReadOnly: boolean = true;
  isCertificateDateReadOnly: boolean = true;
  isMedicalInsuranceNumberReadOnly: boolean = true;
  isMedicalInsuranceDateReadOnly: boolean = true;
  isBusinessLicenseReadOnly: boolean = true;
  isBusinessLicenseNumberReadOnly: boolean = true;

  clientId: any;
  isLoading: boolean = false;
  details: any;

  // Registration File variable
  isEditRegistrationFile: boolean = false;
  registrationFile: string = '';

  // License File variable
  isEditLicenseFile: boolean = false;
  licenseFile: string = '';

  // Certificate File variable
  isEditCertificateFile: boolean = false;
  certificateFile: string = '';

  // check record number variable
  isLoadingCheckRecordNum: Boolean = false;
  recordNumNotAvailable: Boolean = false;

  modalForm = this.fb?.group(
    {
      recordName: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      registrationNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      recordDate: [null, {
        validators: [
          Validators.required]
      }],
      licenseNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      licenseDate: [null, {
        validators: [
          Validators.required]
      }],
      certificateNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      certificateDate: [null, {
        validators: [
          Validators.required]
      }],
      medicalInsuranceNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      medicalInsuranceDate: [null, {
        validators: [
          Validators.required]
      }],
      businessLicense: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      businessLicenseNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private recordsService: RecordsService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.getRecordByClientId();
    this.updateMetaTagsForSEO();
  }

  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل السجل',
      description: 'الوصف',
      image: 'https://avatars.githubusercontent.com/u/52158422?s=48&v=4'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Get Record By Client Id
  getRecordByClientId(): void {
    this.isLoading = true;
    let subscribeGetRecord: Subscription = this.recordsService?.getRecordByClientId(this.clientId).pipe(
      tap(res => this.handleGetRecordSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeGetRecord);
  }
  private handleGetRecordSuccess(response: any): void {
    if (response?.success || true) {
      this.details = response.result;
      this.patchValue();
      this.isLoading = false;
    } else {
      this.handleError(response?.message);
    }
  }
  private handleError(err: any): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
    this.details = {
      recordName: 'recordName 1',
      registrationNumber: '2135836527289',
      recordDate: new Date(),
      registrationFile: 'assets/images/home/sidebar-bg.webp',

      licenseDate: new Date(),
      licenseNumber: '135836527289',
      licenseFile: 'assets/images/home/sidebar-bg.webp',

      certificateDate: new Date(),
      certificateNumber: '135836527289',
      certificateFile: 'assets/images/home/sidebar-bg.webp',

      medicalInsuranceDate: new Date(),
      medicalInsuranceNumber: '135836527289',

      businessLicense: "business License 1",
      businessLicenseNumber: "135836527289"
    };
    this.patchValue();
    this.isLoading = false;
  }
  private setMessage(message: string, type: string): void {
    this.alertsService.openToast(type, type, message);
    this.isLoading = false;
  }
  // End Get Record By Client Id

  // Start Upload Files
  uploadRecordFile(event: any): void {
    console.log(event);
  }
  uploadLicenseFile(event: any): void {
    console.log(event);
  }
  uploadCertificateFile(event: any): void {
    console.log(event);
  }
  // End Upload Files

  patchValue(): void {
    this.modalForm?.patchValue({
      recordName: this.details?.recordName,
      registrationNumber: this.details?.registrationNumber,
      recordDate: this.details?.recordDate,
      licenseNumber: this.details?.registrationNumber,
      licenseDate: this.details?.recordDate,
      certificateNumber: this.details?.certificateNumber,
      certificateDate: this.details?.certificateDate,
      medicalInsuranceNumber: this.details?.medicalInsuranceNumber,
      medicalInsuranceDate: this.details?.medicalInsuranceDate,
      businessLicenseNumber: this.details?.businessLicenseNumber,
      businessLicense: this.details?.businessLicense,
    })
    this.isEditRegistrationFile = true;
    this.registrationFile = this.details?.registrationFile;
    this.isEditLicenseFile = true;
    this.licenseFile = this.details?.licenseFile;
    this.isEditCertificateFile = true;
    this.certificateFile = this.details?.licenseFile;
  }

  editInput(name: string): void {
    if (name == 'recordName') {
      this.isRecordNameReadOnly = false;
    }
    if (name == 'registrationNumber') {
      this.isRegistrationNumberReadOnly = false;
    }
    if (name == 'recordDate') {
      this.isRecordDateReadOnly = false;
    }
    if (name == 'licenseNumber') {
      this.isLicenseNumberReadOnly = false;
    }
    if (name == 'licenseDate') {
      this.isLicenseDateReadOnly = false;
    }
    if (name == 'certificateNumber') {
      this.isCertificateNumberReadOnly = false;
    }
    if (name == 'certificateDate') {
      this.isCertificateDateReadOnly = false;
    }
    if (name == 'medicalInsuranceNumber') {
      this.isMedicalInsuranceNumberReadOnly = false;
    }
    if (name == 'medicalInsuranceDate') {
      this.isMedicalInsuranceDateReadOnly = false;
    }
    if (name == 'businessLicense') {
      this.isBusinessLicenseReadOnly = false;
    }
    if (name == 'businessLicenseNumber') {
      this.isBusinessLicenseNumberReadOnly = false;
    }
  }

  // Start Check If Record Number Unique
  checkRecordNumAvailable(): void {
    if (!this.formControls.registrationNumber.valid) {
      return; // Exit early if ID is not valid
    }

    const registrationNumber = this.modalForm.value.registrationNumber;
    const data = { registrationNumber };

    this.isLoadingCheckRecordNum = true;

    let checkRegistrationNumberSubscription = this.recordsService?.IsRecordNumberAvailable(data)?.subscribe(
      (res: any) => {
        this.handleRecordNumberResponse(res);
      },
      (err: any) => {
        this.handleRecordNumberError(err);
      }
    );
    this.subscriptions.push(checkRegistrationNumberSubscription);
  }
  private handleRecordNumberResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.recordNumNotAvailable = !res.result;
    } else {
      this.recordNumNotAvailable = false;
      if (res?.message) {
        this.alertsService?.openToast('error', 'error', res.message);
      }
    }
    this.isLoadingCheckRecordNum = false;
    this.cdr.detectChanges();
  }
  private handleRecordNumberError(err: any): void {
    this.recordNumNotAvailable = false;
    const errorMessage = err?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService?.openToast('error', 'error', errorMessage);
    this.isLoadingCheckRecordNum = false;

  }
  onKeyUpEvent(): void {
    this.isLoadingCheckRecordNum = false;
  }
  // End Check If Record Number Unique

  // Start Submit Edit Record
  submit(): void {
    if (this.modalForm?.valid) {
      const formData = this.extractFormData();
      this.editRecord(formData);
    } else {
      this.publicService?.validateAllFormFields(this.modalForm);
    }
  }
  private extractFormData(): any {
    return {
      recordName: this.modalForm.value?.recordName,
      registrationNumber: this.modalForm.value?.registrationNumber,
      recordDate: this.modalForm.value?.recordDate,
      licenseNumber: this.modalForm.value?.registrationNumber,
      licenseDate: this.modalForm.value?.recordDate,
      certificateNumber: this.modalForm.value?.certificateNumber,
      certificateDate: this.modalForm.value?.certificateDate,
      medicalInsuranceNumber: this.modalForm.value?.medicalInsuranceNumber,
      medicalInsuranceDate: this.modalForm.value?.medicalInsuranceDate,
      businessLicenseNumber: this.modalForm.value?.businessLicenseNumber,
      businessLicense: this.modalForm.value?.businessLicense,
      registrationFile: this.registrationFile,
      licenseFile: this.licenseFile,
      certificateFile: this.licenseFile,
    };
  }
  private editRecord(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeEditRecord = this.recordsService?.editRecord(formData)?.subscribe(
      (res: any) => {
        this.handleEditRecordSuccess(res);
      },
      (err: any) => {
        this.handleEditRecordError(err);
      }
    );
    this.subscriptions.push(subscribeEditRecord);
  }
  private handleEditRecordSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.isSuccess && response?.statusCode === 200) {
      this.router.navigate(['/Dashboard/Clients']);
      response?.message ? this.alertsService?.openToast('success', 'success', response?.message) : '';
    } else {
      response?.message ? this.alertsService?.openToast('error', 'error', response?.message || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    }
  }
  private handleEditRecordError(error: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    error?.message ? this.alertsService?.openToast('error', 'error', error?.message || this.publicService.translateTextFromJson('general.errorOccur')) : '';
  }
  // End Submit Edit Record


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
