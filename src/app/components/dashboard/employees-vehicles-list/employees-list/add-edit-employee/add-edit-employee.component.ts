// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicService } from '../../../../../services/generic/public.service';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    FileUploadComponent
  ],
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent {
  private subscriptions: Subscription[] = [];

  residencePhotoFile: any;
  residencePhoto: string;
  isEdit: boolean = false;
  employeeId: any;

  constructor(
    private employeesService: EmployeesService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    let data = this.config.data;
    if (data.type == 'edit') {
      this.isEdit = true;
      this.patchValue(data);
    }
  }

  modalForm = this.fb?.group(
    {
      fullName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      residencyNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
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
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  uploadResidencePhoto(event: any): void {
    this.residencePhotoFile = event.file;
    this.formControls.residencePhoto.setValue(this.residencePhotoFile);
  }

  patchValue(data: any): void {
    this.employeeId = data.item.id;
    this.modalForm.patchValue({
      fullName: data?.item?.fullName,
      residencyNumber: data?.item?.residencyNumber,
      endDate: data?.item?.endDate,
      healthCertificate: data?.item?.healthCertificate
    });
    this.residencePhoto = data?.item?.residencePhoto;
    this.formControls.residencePhoto.setValue(this.residencePhoto);
  }

  // Start Add Or Edit Employee
  submit(): void {
    if (this.modalForm?.valid) {
      const formData = this.extractFormData();
      this.addEditEmployee(formData);
    } else {
      this.publicService?.validateAllFormFields(this.modalForm);
    }
  }
  private extractFormData(): any {
    const formData = new FormData();
    if (this.isEdit) {
      formData.append('id', this.employeeId);
    }
    formData.append('fullName', this.modalForm?.value?.fullName);
    formData.append('residencyNumber', this.modalForm?.value?.residencyNumber);
    formData.append('endDate', this.modalForm?.value?.endDate);
    formData.append('healthCertificate', this.modalForm?.value?.healthCertificate);
    formData.append('residencePhoto', this.residencePhotoFile);
    return formData;
  }
  private addEditEmployee(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditEmployee: Subscription = this.employeesService?.addEditEmployee(formData).pipe(
      tap(res => this.handleAddEditEmployeeSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditEmployee);
  }
  private handleAddEditEmployeeSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success || true) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Or Edit Employee

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

