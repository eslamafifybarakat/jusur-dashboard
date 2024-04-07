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
import { VehiclesService } from '../../../services/vehicles.service';
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
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrls: ['./add-edit-vehicle.component.scss']
})
export class AddEditVehicleComponent {
  private subscriptions: Subscription[] = [];

  formPhotoFile: any;
  formPhoto: any = null;
  isEdit: boolean = false;
  vehicleId: any;

  constructor(
    private vehiclesService: VehiclesService,
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
      operatingCard: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      endDate: [null, {
        validators: [
          Validators.required]
      }],
      insuranceExpiryDate: [null, {
        validators: [
          Validators.required]
      }],
      formPhotoFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  uploadFormPhoto(event: any): void {
    this.formPhotoFile = event.file;
    this.formControls.formPhotoFile.setValue(this.formPhotoFile);
  }
  patchValue(data: any): void {
    console.log(data);

    this.vehicleId = data.item.id;
    this.modalForm.patchValue({
      operatingCard: data?.item?.operatingCard,
      endDate: data?.item?.endDate,
      insuranceExpiryDate: data?.item?.insuranceExpiryDate
    });
    this.formPhoto = data?.item?.formPhoto;
    this.formControls.formPhotoFile.setValue(this.formPhoto);
  }
  // Start Add Or Edit Vehicle
  submit(): void {
    if (this.modalForm?.valid) {
      const formData = this.extractFormData();
      this.addEditVehicle(formData);
    } else {
      this.publicService?.validateAllFormFields(this.modalForm);
    }
  }
  private extractFormData(): any {
    const formData = new FormData();
    if (this.isEdit) {
      formData.append('id', this.vehicleId);
    }
    formData.append('operatingCard', this.modalForm?.value?.operatingCard);
    formData.append('endDate', this.modalForm?.value?.endDate);
    formData.append('insuranceExpiryDate', this.modalForm?.value?.insuranceExpiryDate);
    formData.append('formPhotoFile', this.formPhotoFile);
    return formData;
  }
  private addEditVehicle(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddVehicle: Subscription = this.vehiclesService?.addEditVehicle(formData).pipe(
      tap(res => this.handleAddEditVehicleSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddVehicle);
  }
  private handleAddEditVehicleSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success || true) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Or Edit Vehicle

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

