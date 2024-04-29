// Modules
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';

// Components
import { UploadMultiFilesComponent } from '../../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';
import { EmployeesVehiclesListComponent } from '../../../employees-vehicles-list/employees-vehicles-list.component';
import { EmployeesListComponent } from '../../../employees-vehicles-list/employees-list/employees-list.component';
import { VehiclesListComponent } from '../../../employees-vehicles-list/vehicles-list/vehicles-list.component';
import { SkeletonComponent } from './../../../../../shared/skeleton/skeleton/skeleton.component';

//Services
import { LocalizationLanguageService } from './../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { MaxDigitsDirective } from '../../../directives/max-digits.directive';
import { RecordsService } from '../../../services/records.service';
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
    EmployeesVehiclesListComponent,
    UploadMultiFilesComponent,
    EmployeesListComponent,
    VehiclesListComponent,
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
  tabType: string;

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

  recordId: number | string;
  clientId: number | string;
  isLoadingRecordDetails: boolean = false;
  recordDetails: any;

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
        validators: [], updateOn: "blur"
      }],
      licenseDate: [null, {
        validators: []
      }],
      certificateNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      certificateDate: [null, {
        validators: []
      }],
      medicalInsuranceNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      medicalInsuranceDate: [null, {
        validators: []
      }],
      businessLicense: ['', {
        validators: [], updateOn: "blur"
      }],
      businessLicenseNumber: ['', {
        validators: [], updateOn: "blur"
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
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.tabType = 'employees';
    this.loadPageData();
  }

  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.recordId = params['id'];
      this.clientId = params['clientId'];
      if (this.recordId) {
        this.getRecordById(this.recordId);
        // this.fullPageUrl = environment.publicUrl + this.localizationLanguageService.getFullURL();
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل السجل',
      description: 'الوصف',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  showTabItems(item: any) {
    this.tabType = item;
  }

  // Start Get Record By Client Id
  getRecordById(recordId: number | string, preventLoading?: boolean): void {
    preventLoading ? '' : this.isLoadingRecordDetails = true;
    let subscribeGetRecord: Subscription = this.recordsService?.getSingleHistory(recordId, this.clientId).pipe(
      tap(res => this.handleGetRecordSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeGetRecord);
  }
  private handleGetRecordSuccess(response: any): void {
    if (response?.success == true) {
      this.recordDetails = response.result;
      this.patchValue();
      this.isLoadingRecordDetails = false;
    } else {
      this.handleError(response?.message);
    }
  }
  // End Get Record By Client Id

  // Start Upload Files
  uploadRecordFile(event: any): void {
    this.registrationFile = event.file;
  }
  uploadLicenseFile(event: any): void {
    this.licenseFile = event.file;
  }
  uploadCertificateFile(event: any): void {
    this.certificateFile = event.file;
  }
  // End Upload Files

  patchValue(): void {
    let convertedRecordDate: any = this.recordDetails?.expireDate ? new Date(this.recordDetails?.expireDate) : null;
    let convertedLicenseDate: any = this.recordDetails?.licenseDate ? new Date(this.recordDetails?.licenseDate) : null;
    let convertedCertificateDate: any = this.recordDetails?.certificateDate ? new Date(this.recordDetails?.certificateDate) : null;
    let convertedMedicalInsuranceDate: any = this.recordDetails?.medicalInsuranceDate ? new Date(this.recordDetails?.medicalInsuranceDate) : null;
    let prepeareDetails = {
      registrationFile: 'assets/images/home/sidebar-bg.webp',
      licenseFile: this.recordDetails?.licenseFile || 'assets/images/home/sidebar-bg.webp',
      certificateFile: this.recordDetails?.certificateFile
    };
    this.certificateFile = this.recordDetails.certificateFile,
      this.certificateFile ? this.isEditCertificateFile = true : '';
    this.modalForm?.patchValue({
      recordName: this.recordDetails?.name,
      registrationNumber: this.recordDetails?.number,
      recordDate: convertedRecordDate,
      licenseNumber: this.recordDetails?.licenseNumber,
      licenseDate: convertedLicenseDate,
      certificateNumber: this.recordDetails?.certificateNumber,
      certificateDate: convertedCertificateDate,
      medicalInsuranceNumber: this.recordDetails?.medicalInsuranceNumber,
      medicalInsuranceDate: convertedMedicalInsuranceDate,
      businessLicenseNumber: this.recordDetails?.businessLicenseNumber,
      businessLicense: this.recordDetails?.businessLicense,
    })
    this.recordDetails.registrationFile ? this.isEditRegistrationFile = true : '';
    this.registrationFile = this.recordDetails.registrationFile;
    this.recordDetails.licenseFile ? this.isEditLicenseFile = true : '';
    this.licenseFile = this.recordDetails.licenseFile;
    this.recordDetails.certificateFile ? this.isEditCertificateFile = true : '';
    this.certificateFile = this.recordDetails.certificateFile;
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
    if (!this.formControls?.registrationNumber?.valid) {
      return; // Exit early if Record Number is not valid
    }
    if (this.modalForm?.value?.registrationNumber == this.recordDetails?.registrationNumber) {
      return; // Exit early if Record Number is not valid
    }
    const number: number | string = this.modalForm?.value?.registrationNumber;
    const data: any = { number };
    this.isLoadingCheckRecordNum = true;
    let checkRecordNumSubscription: Subscription = this.publicService?.IsRecordNumberAvailable(data).pipe(
      tap(res => this.handleRecordNumResponse(res)),
      catchError(err => this.handleRecordNumError(err))
    ).subscribe();
    this.subscriptions.push(checkRecordNumSubscription);
  }
  private handleRecordNumResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.recordNumNotAvailable = !res.result;
    } else {
      this.recordNumNotAvailable = false;
      this.handleRecordNumError(res?.message);
    }
    this.isLoadingCheckRecordNum = false;
    this.cdr.detectChanges();
  }
  private handleRecordNumError(err: any): any {
    this.recordNumNotAvailable = true;
    this.isLoadingCheckRecordNum = false;
    this.handleError(err);
  }
  // End Check If Record Number Unique
  onKeyUpEvent(): void {
    this.isLoadingCheckRecordNum = false;
  }

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
    const formData:any = new FormData();
    formData.append('active', true);
    formData.append('name', this.modalForm?.value?.recordName);
    formData.append('number', this.modalForm?.value?.registrationNumber);
    formData.append('expireDate', this.modalForm?.value?.recordDate);
    formData.append('licenseNumber', this.modalForm?.value?.licenseNumber);
    formData.append('licenseDate', this.modalForm?.value?.licenseDate);
    formData.append('certificateNumber', this.modalForm?.value?.certificateNumber);
    formData.append('certificateDate', this.modalForm?.value?.certificateDate);
    formData.append('medicalInsuranceNumber', this.modalForm?.value?.medicalInsuranceNumber);
    formData.append('medicalInsuranceDate', this.modalForm?.value?.medicalInsuranceDate);
    formData.append('businessLicenseNumber', this.modalForm?.value?.businessLicenseNumber);
    formData.append('businessLicense', this.modalForm?.value?.businessLicense);
    formData.append('registrationFile', this.registrationFile);
    formData.append('licenseFile', this.licenseFile);
    formData.append('certificateFile', this.certificateFile);
    let data:any={
      active: true,
      name: this.modalForm.value?.recordName,
      number: this.modalForm.value?.registrationNumber,
      expireDate: this.modalForm.value?.recordDate,
      licenseNumber: this.modalForm.value?.licenseNumber,
      licenseDate: this.modalForm.value?.licenseDate,
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
    return data;
  }
  private editRecord(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeEditRecord = this.recordsService?.editRecord(formData, this.recordId)?.pipe(
      tap(res => this.handleEditRecordSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeEditRecord);
  }
  private handleEditRecordSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success) {
      // this.router.navigate(['/Dashboard/Clients']);
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Submit Edit Record

  cancel(): void {
    this.patchValue();
    this.location.back();
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
    this.isLoadingRecordDetails = false;
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
