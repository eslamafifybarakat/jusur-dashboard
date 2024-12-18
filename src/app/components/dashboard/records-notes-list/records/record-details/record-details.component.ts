// Modules
import { CommonModule, Location } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { DateService } from 'src/app/services/generic/date.service';
import { RecordsService } from '../../../services/records.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, tap } from 'rxjs';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { DropdownModule } from 'primeng/dropdown';
import { sanitizeValue } from 'src/app/common/functions/sanitizeValue';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    CommonModule,
    FormsModule,
    DropdownModule,

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
  currentLanguage: string | null = null;
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

  isLicenseDataNumberReadOnly: boolean = true;
  isLicenseEndDateReadOnly: boolean = true;
  isLicenseTypeReadOnly: boolean = true;


  isNationalAddressNumberReadOnly: boolean = true;
  isNationalAddressEndDateReadOnly: boolean = true;

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

  // Medical File variable
  isEditMedicalFile: boolean = false;
  medicalFile: string = '';

  // Labor File variable
  isEditLaborFile: boolean = false;
  laborFile: string = '';

  // license Data File variable
  isEditLicenseDataFile: boolean = false;
  licenseDataFile: string = '';
  licenseTypes:any;

  // National Address Data File variable
  isEditNationalAddressFile: boolean = false;
  nationalAddressFile: string = '';
  
  // check record number variable
  isLoadingCheckRecordNum: Boolean = false;
  recordNumNotAvailable: Boolean = false;

  //Record Other Items
  recordOtherItems: any = [];
  selectedItems: any[] = [];
  viewMedicalDetails: boolean = false;
  viewFileDetails: boolean = false;
  viewLicenseDetails: boolean = false;
  viewNationalDetails: boolean = false;

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

      licenseDataNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      licenseEndDate: [null, {
        validators: []
      }],
      licenseType:['', {
        validators: [], updateOn: "blur"
      }],

      nationalAddressNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      nationalAddressEndDate: [null, {
        validators: []
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
    private dateService: DateService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.tabType = 'employees';
    this.loadPageData();
  }

  private loadPageData(): void {
    this.currentLanguage = window.localStorage.getItem(keys.language);
    if (this.currentLanguage == 'ar') {
      this.recordOtherItems = [
        {
          id: 1,
          name: 'تفاصيل التأمين الطبي'
        },
        {
          id: 2,
          name: 'تفاصيل ملف مكتب العمل'
        },
        {
          id: 3,
          name: 'تفاصيل التراخيص'
        },
        {
          id: 4,
          name: 'تفاصيل العنوان الوطني'
        }
      ];
    } else {
      this.recordOtherItems = [
        {
          id: 1,
          name: 'Medical insurance details'
        },
        {
          id: 2,
          name: 'Labor office file details'
        },
        {
          id: 3,
          name: 'License details'
        },
        {
          id: 4,
          name: 'National Address Details'
        }
      ];
    }
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
  selectedValuesChanged(selectedValues: any): void {
    this.viewMedicalDetails = false;
    this.viewFileDetails = false;
    this.viewLicenseDetails = false;
    this.viewNationalDetails = false;
    this.selectedItems = selectedValues?.value;
    this.selectedItems?.forEach(element => {
      if (element?.id == 1) {
        this.viewMedicalDetails = true;
      }
      if (element?.id == 2) {
        this.viewFileDetails = true;
      }
      if (element?.id == 3) {
        this.viewLicenseDetails = true;
      }
      if (element?.id == 4) {
        this.viewNationalDetails = true;
      }
    });
    // Handle your logic here when the selection changes
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
    this.registrationFile = event?.file;
  }
  uploadLicenseFile(event: any): void {
    this.licenseFile = event?.file;
  }
  uploadCertificateFile(event: any): void {
    this.certificateFile = event?.file;
  }
  uploadMedicalFile(event: any): void{
    this.medicalFile = event?.file;
  }
  uploadLaborFile(event: any): void{
    this.laborFile=event?.file;
  }
  uploadLicenseDataFile(event: any): void{
    this.licenseDataFile=event?.file;
    console.log(this.licenseDataFile)
  }
  uploadNationalAddressFile(event: any): void{
    this.nationalAddressFile=event?.file;
    console.log(this.nationalAddressFile)
  }
  // End Upload Files

  patchValue(): void {
    let convertedRecordDate: any = this.recordDetails?.expireDate && this.recordDetails?.expireDate !== 'null' ? new Date(this.recordDetails?.expireDate) : null;
    let convertedLicenseDate: any = this.recordDetails?.licenseDate && this.recordDetails?.licenseDate !== 'null' ? new Date(this.recordDetails?.licenseDate) : null;
    let convertedCertificateDate: any = this.recordDetails?.certificateDate && this.recordDetails?.certificateDate !== 'null' ? new Date(this.recordDetails?.certificateDate) : null;
    let convertedMedicalInsuranceDate: any = this.recordDetails?.medicalInsuranceDate && this.recordDetails?.medicalInsuranceDate !== 'null' ? new Date(this.recordDetails?.medicalInsuranceDate) : null;
    let convertedLicenseEndDate: any = this.recordDetails?.licenseEndDate && this.recordDetails?.licenseEndDate !== 'null' ? new Date(this.recordDetails?.licenseEndDate) : null;
    let convertedNationalAddressEndDate: any = this.recordDetails?.nationalAddressEndDate && this.recordDetails?.nationalAddressEndDate !== 'null' ? new Date(this.recordDetails?.nationalAddressEndDate) : null;
    let prepeareDetails = {
      registrationFile: 'assets/images/home/sidebar-bg.webp',
      licenseFile: this.recordDetails?.licenseFile || 'assets/images/home/sidebar-bg.webp',
      certificateFile: this.recordDetails?.certificateFile,
      medicalFile: this.recordDetails?.medicalFile,
      laborFile: this.recordDetails?.laborFile,
      licenseDataFile: this.recordDetails?.licenseDataFile,
      nationalAddressFile: this.recordDetails?.nationalAddressFile
    };
    this.certificateFile = this.recordDetails?.certificateFile,
      this.certificateFile ? this.isEditCertificateFile = true : '';
    this.modalForm?.patchValue({
      recordName: sanitizeValue(this.recordDetails?.name),
      registrationNumber: sanitizeValue(this.recordDetails?.number),
      recordDate: convertedRecordDate,
      licenseNumber: sanitizeValue(this.recordDetails?.licenseNumber),
      licenseDate: convertedLicenseDate,
      certificateNumber: sanitizeValue(this.recordDetails?.certificateNumber),
      certificateDate: convertedCertificateDate,
      medicalInsuranceNumber: sanitizeValue(this.recordDetails?.medicalInsuranceNumber),
      medicalInsuranceDate: convertedMedicalInsuranceDate,
      businessLicenseNumber: sanitizeValue(this.recordDetails?.businessLicenseNumber),
      businessLicense: sanitizeValue(this.recordDetails?.businessLicense),

      licenseDataNumber: sanitizeValue(this.recordDetails?.licenseDataNumber),
      licenseEndDate: convertedLicenseEndDate,
      licenseType: sanitizeValue(this.recordDetails?.licenseType),

      nationalAddressNumber: sanitizeValue(this.recordDetails?.nationalAddressNumber),
      nationalAddressEndDate: convertedNationalAddressEndDate,
    })
    this.medicalFile=this.recordDetails?.medicalFile,
    this.medicalFile ? this.isEditMedicalFile =true : '';
    this.laborFile=this.recordDetails?.laborFile,
    this.laborFile ? this.isEditLaborFile =true : '';
    this.licenseDataFile=this.recordDetails?.licenseDataFile,
    this.licenseDataFile ? this.isEditLicenseDataFile =true : '';
    this.nationalAddressFile=this.recordDetails?.nationalAddressFile,
    this.nationalAddressFile ? this.isEditNationalAddressFile =true : '';
    this.recordDetails?.registrationFile ? this.isEditRegistrationFile = true : '';
    this.registrationFile = this.recordDetails?.registrationFile;
    this.recordDetails?.licenseFile ? this.isEditLicenseFile = true : '';
    this.licenseFile = this.recordDetails?.licenseFile;
    this.recordDetails?.certificateFile ? this.isEditCertificateFile = true : '';
    this.certificateFile = this.recordDetails?.certificateFile;
    this.recordDetails?.medicalFile ? this.isEditMedicalFile = true : '';
    this.medicalFile = this.recordDetails?.medicalFile;
    this.recordDetails?.laborFile ? this.isEditLaborFile = true : '';
    this.laborFile = this.recordDetails?.laborFile;
    this.recordDetails?.licenseDataFile ? this.isEditLicenseDataFile = true : '';
    this.licenseDataFile = this.recordDetails?.licenseDataFile;
    this.recordDetails?.nationalAddressFile ? this.isEditNationalAddressFile = true : '';
    this.nationalAddressFile = this.recordDetails?.nationalAddressFile;
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
    if (name == 'licenseDataNumber') {
      this.isLicenseDataNumberReadOnly = false;
    }
    if (name == 'licenseDataNumber') {
      this.isLicenseDataNumberReadOnly = false;
    }
    if (name == 'licenseEndDate') {
      this.isLicenseEndDateReadOnly = false;
    }
    if (name == 'licenseType') {
      this.isLicenseTypeReadOnly = false;
    }
    if (name == 'nationalAddressNumber') {
      this.isNationalAddressNumberReadOnly = false;
    }
    if (name == 'nationalAddressEndDate') {
      this.isNationalAddressEndDateReadOnly = false;
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
    let adjusteExpireDate: any = this.modalForm?.value?.recordDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.recordDate) : null;
    let adjustedLicenseDate: any = this.modalForm?.value?.licenseDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.licenseDate) : null;
    let adjustedCrtificateDate: any = this.modalForm?.value?.certificateDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.certificateDate) : null;
    let adjustedMedicalInsuranceDate: any = this.modalForm?.value?.medicalInsuranceDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.medicalInsuranceDate) : null;
    let adjustedLicenseEndDate: any = this.modalForm?.value?.licenseEndDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.licenseEndDate) : null;
    let adjustedNationalAddressEndDate: any = this.modalForm?.value?.nationalAddressEndDate ? this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.nationalAddressEndDate) : null;
    const formData: any = new FormData();
    formData.append('active', true);
    formData.append('name', this.modalForm?.value?.recordName);
    formData.append('number', this.modalForm?.value?.registrationNumber);
    formData.append('expireDate', adjusteExpireDate ? adjusteExpireDate.toISOString() : null);
    formData.append('licenseNumber', this.modalForm?.value?.licenseNumber);
    formData.append('licenseDate', adjustedLicenseDate ? adjustedLicenseDate.toISOString() : null);
    formData.append('certificateNumber', this.modalForm?.value?.certificateNumber);
    formData.append('certificateDate', adjustedCrtificateDate ? adjustedCrtificateDate.toISOString() : null);
    formData.append('medicalInsuranceNumber', this.modalForm?.value?.medicalInsuranceNumber);
    formData.append('medicalInsuranceDate', this.modalForm?.value?.medicalInsuranceDate);
    formData.append('businessLicenseNumber', adjustedMedicalInsuranceDate ? adjustedMedicalInsuranceDate.toISOString() : null);
    formData.append('businessLicense', this.modalForm?.value?.businessLicense);
    formData.append('registrationFile', (this.registrationFile && this.registrationFile !== null && this.registrationFile !== 'null' && this.registrationFile !== undefined && this.registrationFile !== 'undefined') ? this.registrationFile : null);
    formData.append('licenseFile', (this.licenseFile && this.licenseFile !== null && this.licenseFile !== 'null' && this.licenseFile !== undefined && this.licenseFile !== 'undefined') ? this.licenseFile : null);
    formData.append('certificateFile', (this.certificateFile && this.certificateFile !== null && this.certificateFile !== 'null' && this.certificateFile !== undefined && this.certificateFile !== 'undefined') ? this.certificateFile : null);
    // formData.append('medicalFile', (this.medicalFile && this.medicalFile !== null && this.medicalFile !== 'null' && this.medicalFile !== undefined && this.medicalFile !== 'undefined') ? this.medicalFile : null);
    // formData.append('laborFile', (this.laborFile && this.laborFile !== null && this.laborFile !== 'null' && this.laborFile !== undefined && this.laborFile !== 'undefined') ? this.laborFile : null);
    // formData.append('licenseDataFile', (this.licenseDataFile && this.licenseDataFile !== null && this.licenseDataFile !== 'null' && this.licenseDataFile !== undefined && this.licenseDataFile !== 'undefined') ? this.licenseDataFile : null);
    // formData.append('nationalAddressFile', (this.nationalAddressFile && this.nationalAddressFile !== null && this.nationalAddressFile !== 'null' && this.nationalAddressFile !== undefined && this.nationalAddressFile !== 'undefined') ? this.nationalAddressFile : null);

    formData.append('licenseDataNumber', this.modalForm?.value?.licenseDataNumber);
    formData.append('licenseEndDate', adjustedLicenseEndDate ? adjustedLicenseEndDate.toISOString() : null);
    // formData.append('licenseType',this.modalForm?.value?.licenseType)

    formData.append('nationalAddressNumber', this.modalForm?.value?.nationalAddressNumber);
    formData.append('nationalAddressEndDate', adjustedNationalAddressEndDate ? adjustedNationalAddressEndDate.toISOString() : null);

    return formData;
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

    
  // Checks if the form control has a value different from the placeholder.
  hasValue(controlName: string): boolean {
    const control = this.formControls?.[controlName];
    const placeholder = this.translate.instant('placeholders.dateFormat'); 
    return control?.value && control.value !== placeholder;
  }
  
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
