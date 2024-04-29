// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { EmployeesVehiclesListComponent } from './../../../../dashboard/employees-vehicles-list/employees-vehicles-list.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../../../shared/skeleton/skeleton/skeleton.component';


//Services
import { LocalizationLanguageService } from './../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../../services/generic/metadata.service';
import { RecordsService } from './../../../../dashboard/services/records.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicService } from 'src/app/services/generic/public.service';
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
    SkeletonComponent,
    DynamicSvgComponent,
    // Directive
  ],
  selector: 'app-client-record-details',
  templateUrl: './client-record-details.component.html',
  styleUrls: ['./client-record-details.component.scss']
})
export class ClientRecordDetailsComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';
  dataSecondStyleType: string = 'list';
  dataThirdStyleType: string = 'list';
  dataFourthStyleType: string = 'list';
  dataFifthStyleType: string = 'list';

  recordId: number | string;
  clientId: number | string;
  isLoadingRecordDetails: boolean = false;
  recordDetails: any;

  // Registration File variable
  isEditRegistrationFile: boolean = false;
  registrationFile: string = '';

  // License File variable
  licenseFile: string = '';

  // Certificate File variable
  certificateFile: string = '';

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private recordsService: RecordsService,
    private activatedRoute: ActivatedRoute,
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

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  changeSecondDateStyle(type: string): void {
    this.dataSecondStyleType = type;
  }

  changeThirdDateStyle(type: string): void {
    this.dataThirdStyleType = type;
  }

  changeFourthDateStyle(type: string): void {
    this.dataFourthStyleType = type;
  }

  changeFifthDateStyle(type: string): void {
    this.dataFifthStyleType = type;
  }

  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.recordId = params['id'];
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

  // Start Get Record By Client Id
  getRecordById(recordId: number | string, preventLoading?: boolean): void {
    preventLoading ? '' : this.isLoadingRecordDetails = true;
    let subscribeGetRecord: Subscription = this.recordsService?.getSingleHistory(recordId).pipe(
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

  patchValue(): void {
    let prepeareDetails = {
      registrationFile: 'assets/images/home/sidebar-bg.webp',
      licenseFile: this.recordDetails?.licenseFile || 'assets/images/home/sidebar-bg.webp',
    };
    this.certificateFile = this.recordDetails.certificateFile,
      this.recordDetails.expireDateValue = this.recordDetails?.expireDate ? new Date(this.recordDetails?.expireDate) : null;
    this.recordDetails.licenseDateValue = this.recordDetails?.licenseDate ? new Date(this.recordDetails?.licenseDate) : null;
    this.recordDetails.certificateDateValue = this.recordDetails?.certificateDate ? new Date(this.recordDetails?.certificateDate) : null;
    this.recordDetails.medicalInsuranceDateValue = this.recordDetails?.medicalInsuranceDate ? new Date(this.recordDetails?.medicalInsuranceDate) : null;
    this.isEditRegistrationFile = true;
    this.registrationFile = prepeareDetails.registrationFile;
    // this.isEditLicenseFile = true;
    // this.licenseFile = prepeareDetails.licenseFile;
    // this.isEditCertificateFile = true;
    // this.certificateFile = prepeareDetails.certificateFile;
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    // this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
    this.isLoadingRecordDetails = false;
    // this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type: string): void {
    // this.alertsService.openToast(type, type, message);
    // this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
