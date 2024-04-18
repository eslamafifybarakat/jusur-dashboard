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

  // Check Operating Card Variables
  isLoadingCheckOperatingCard: Boolean = false;
  operatingCardNotAvailable: Boolean = false;

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

  onKeyUpEvent(): void {
    this.isLoadingCheckOperatingCard = false;
    this.cdr.detectChanges();
  }
  clearCheckAvailable(): void {
    this.operatingCardNotAvailable = false;
  }
  // Start Check If Operating Card Unique
  checkOperatingCardAvailable(): void {
    if (!this.formControls?.operatingCard?.valid) {
      return; // Exit early if Operating Card is not valid
    }
    const identity: number | string = this.modalForm?.value?.operatingCard;
    const data: any = { identity };
    this.isLoadingCheckOperatingCard = true;
    let checkOperatingCardSubscription: Subscription = this.publicService?.IsOperatingCardAvailable(data).pipe(
      tap(res => this.handleOperatingCardResponse(res)),
      catchError(err => this.handleOperatingCardError(err))
    ).subscribe();
    this.subscriptions.push(checkOperatingCardSubscription);
  }
  private handleOperatingCardResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.operatingCardNotAvailable = !res.result;
    } else {
      this.operatingCardNotAvailable = false;
      this.handleOperatingCardError(res?.message);
    }
    this.isLoadingCheckOperatingCard = false;
    this.cdr.detectChanges();
  }
  private handleOperatingCardError(err: any): any {
    this.operatingCardNotAvailable = false;
    this.isLoadingCheckOperatingCard = false;
    this.handleError(err);
  }
  // End Check If Operating Card Unique

  uploadFormPhoto(event: any): void {
    this.formPhotoFile = event.file;
    this.formControls.formPhotoFile.setValue(this.formPhotoFile);
  }
  patchValue(data: any): void {
    this.vehicleId = data.item.details.id;
    console.log(data);
    let convertedEndDate: any = new Date(data?.item?.details?.expiryDate);
    let convertedInsuranceExpiryDate: any = new Date(data?.item?.details?.insuranceExpiryDate);
    this.modalForm.patchValue({
      operatingCard: data?.item?.details?.workPermitCard,
      endDate: convertedEndDate,
      insuranceExpiryDate: convertedInsuranceExpiryDate
    });
    this.formPhoto = data?.item?.details?.formImage;
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
    formData.append('workPermitCard', this.modalForm?.value?.operatingCard);
    formData.append('expiryDate', this.modalForm?.value?.endDate);
    formData.append('insuranceExpiryDate', this.modalForm?.value?.insuranceExpiryDate);
    formData.append('clientHistory_id', this.config?.data?.item?.clientHistory_id);
    if (this.isEdit) {
      let photo: any = this.modalForm?.value?.formPhotoFile;
      photo?.name != null ? formData.append('formImage', 'https://example.com/iqama.jpg') : '';
    } else {
      formData.append('formImage', 'https://example.com/iqama.jpg');
    }
    let dataObj: any = {
      "workPermitCard": this.modalForm?.value?.operatingCard,
      "expiryDate": this.modalForm?.value?.endDate,
      "insuranceExpiryDate": this.modalForm?.value?.insuranceExpiryDate,
      "clientHistory_id": this.config?.data?.item?.clientHistory_id
    };
    if (this.isEdit) {
      let photo: any = this.modalForm?.value?.formPhotoFile;
      photo?.name != null ? dataObj['formImage'] = 'https://example.com/iqama.jpg' : '';
    } else {
      dataObj['formImage'] = 'https://example.com/iqama.jpg'
    }
    return dataObj;
  }
  private addEditVehicle(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddVehicle: Subscription = this.vehiclesService?.addEditVehicle(formData, this.config?.data?.item?.details?.id).pipe(
      tap(res => this.handleAddEditVehicleSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddVehicle);
  }
  private handleAddEditVehicleSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.success) {
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

