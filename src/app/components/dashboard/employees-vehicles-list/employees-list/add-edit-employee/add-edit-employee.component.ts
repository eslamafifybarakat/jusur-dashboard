// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadFileInputComponent } from 'src/app/shared/components/upload-files/upload-file-input/upload-file-input.component';
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicService } from '../../../../../services/generic/public.service';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaxDigitsDirective } from '../../../directives/max-digits.directive';
import { DateService } from './../../../../../services/generic/date.service';
import { EmployeesService } from '../../../services/employees.service';
import { ChangeDetectorRef, Component } from '@angular/core';
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
    UploadFileInputComponent,
    FileUploadComponent,

    // Directives
    MaxDigitsDirective
  ],
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  residencePhotoFile: any;
  residencePhoto: string;
  isEdit: boolean = false;
  employeeId: any;

  contractImageFile: any;
  contractImage: any = null;

  // Check National Identity Variables
  isLoadingCheckResidencyNumber: Boolean = false;
  residencyNumberNotAvailable: Boolean = false;

  constructor(
    private employeesService: EmployeesService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private dateService: DateService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();

    let data = this.config.data;
    if (data.type == 'edit') {
      this.isEdit = true;
      this.patchValue(data);
    }
  }
  patchValue(data: any): void {
    let convertedResidencyNumber: any = parseInt(data?.item?.details?.identity);
    let convertedEndDate: any = new Date(data?.item?.details?.expiryDate);
    this.employeeId = data?.item?.details?.id;
    this.modalForm.patchValue({
      // isActive: data?.item?.details?.active,
      fullName: data?.item?.details?.name,
      residencyNumber: convertedResidencyNumber,
      endDate: convertedEndDate,
      healthCertificate: data?.item?.details?.healthCertificate
    });
    this.residencePhoto = data?.item?.details?.iqamaImage;
    this.formControls.residencePhoto.setValue(this.residencePhoto);
    this.contractImage = data?.item?.details?.contractImage;
    this.formControls.contractImage.setValue(this.contractImage);
  }

  modalForm = this.fb?.group(
    {
      isActive: [false, {
        validators: [
          Validators.required
        ]
      }],
      fullName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      residencyNumber: ['', {
        validators: [
          Validators.required, Validators.minLength(10)], updateOn: "blur"
      }],
      endDate: [null, {
        validators: [
          Validators.required]
      }],
      healthCertificate: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      residencePhoto: [null, {
        validators: [
          Validators.required]
      }],
      contractImage: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  onKeyUpEvent(): void {
    this.isLoadingCheckResidencyNumber = false;
  }
  clearCheckAvailable(): void {
    this.residencyNumberNotAvailable = false;
  }
  // Start Check If Residency Number Unique
  checkResidencyNumberAvailable(): void {
    if (!this.formControls?.residencyNumber?.valid) {
      return; // Exit early if Residency Number is not valid
    }
    const identity: number | string = this.modalForm?.value?.residencyNumber;
    const data: any = { identity };
    this.isLoadingCheckResidencyNumber = true;
    let checkResidencyNumberSubscription: Subscription = this.publicService?.IsNationalIdentityAvailable(data).pipe(
      tap(res => this.handleResidencyNumberResponse(res)),
      catchError(err => this.handleResidencyNumberError(err))
    ).subscribe();
    this.subscriptions.push(checkResidencyNumberSubscription);
  }
  private handleResidencyNumberResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.residencyNumberNotAvailable = !res.result;
    } else {
      this.residencyNumberNotAvailable = false;
      this.handleResidencyNumberError(res?.message);
    }
    this.isLoadingCheckResidencyNumber = false;
    this.cdr.detectChanges();
  }
  private handleResidencyNumberError(err: any): any {
    this.residencyNumberNotAvailable = false;
    this.isLoadingCheckResidencyNumber = false;
    this.handleError(err);
  }
  // End Check If Residency Number Unique

  uploadResidencePhoto(event: any): void {
    this.residencePhotoFile = event.file;
    this.formControls.residencePhoto.setValue(this.residencePhotoFile);
  }

  uploadContractImage(e: any): void {
    this.contractImageFile = e?.image;
    this.formControls.contractImage.setValue(this.contractImageFile);
  }
  // Start Add Or Edit Employee Functions
  submit(): void {
    if (this.modalForm?.valid) {
      const formData = this.extractFormData();
      this.addEditEmployee(formData);
    } else {
      this.publicService?.validateAllFormFields(this.modalForm);
    }
  }
  private extractFormData(): any {
    let adjustedDate: any = this.dateService.dateWithCorrectTimeZone(this.modalForm?.value?.endDate);
    const formData = new FormData();
    formData.append('name', this.modalForm?.value?.fullName);
    // formData.append('active', this.modalForm?.value?.isActive);
    formData.append('identity', this.modalForm?.value?.residencyNumber);
    formData.append('expiryDate', adjustedDate.toISOString());
    formData.append('healthCertificate', this.modalForm?.value?.healthCertificate);
    formData.append('clientHistory_id', this.config.data?.item?.clientHistory_id);
    if (this.isEdit) {
      let photo: any = this.modalForm?.value?.residencePhoto;
      photo?.name != null ? formData.append('iqamaImage', this.residencePhotoFile) : '';
      let contractImage: any = this.modalForm?.value?.contractImage;
      // contractImage?.name != null ? formData.append('contractImage', this.contractImageFile) : '';
    } else {
      formData.append('iqamaImage', this.residencePhotoFile);
      // formData.append('contractImage', this.contractImageFile);
    }
    return formData;
  }
  private addEditEmployee(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditEmployee: Subscription = this.employeesService?.addEditEmployee(formData, this.config?.data?.item?.details?.id).pipe(
      tap(res => this.handleAddEditEmployeeSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditEmployee);
  }
  private handleAddEditEmployeeSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Or Edit Employee Functions

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
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

