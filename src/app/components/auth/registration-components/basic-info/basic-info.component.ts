import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { AuthService } from '../../../../services/authentication/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, PasswordModule, DropdownModule],
  selector: 'basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent {
  private subscriptions: Subscription[] = [];
  @Output() handleBasicInfo: EventEmitter<any> = new EventEmitter();

  basicInfoForm: any = this.fb?.group({
    phoneNumber: ['', { validators: [Validators.required], updateOn: 'blur' }],
    city: [null, { validators: [Validators.required] }],
    postNumber: ['', { validators: [Validators.required], updateOn: 'blur' }],
  }
  );
  get formControls(): any {
    return this.basicInfoForm?.controls;
  }

  cities: any = [];
  isLoadingCities: boolean = false;

  constructor(
    private alertsService: AlertsService,
    public publicService: PublicService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getCities();
  }

  // CITY
  getCities(): void {
    if (event) {
      this.isLoadingCities = true;
      let citiesSubscription = this.publicService.getCities().subscribe(
        (res: any) => {
          this.handleCitiesSuccess(res);
        },
        (err: any) => {
          // this.handleCitiesError(err);
        }
      );
      this.subscriptions.push(citiesSubscription);
    }
    this.cities = [
      { id: 1, name: 'city1' },
      { id: 2, name: 'city2' },
      { id: 3, name: 'city3' },
      { id: 4, name: 'city4' },
      { id: 5, name: 'city5' },
      { id: 6, name: 'city6' },
    ]
    this.isLoadingCities = false;
  }
  handleCitiesSuccess = (res: any) => {
    if (res.code == 200) {
      this.cities = res;
      this.isLoadingCities = false;
    } else {
      this.handleCitiesError(res.error);
    }
    this.isLoadingCities = false;
    this.cdr.detectChanges();
  };
  handleCitiesError = (err: any) => {
    if (err) {
      this.alertsService.openToast('error', 'error', err.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
    this.isLoadingCities = false;
  };

  continue(): void {
    if (this.basicInfoForm?.valid) {
      this.handleBasicInfo.emit({ name: 'basicInfo', basicInfo: this.basicInfoForm.value, registerNow: true });
    } else {
      this.publicService?.validateAllFormFields(this.basicInfoForm);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
