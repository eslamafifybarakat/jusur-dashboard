import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { PersonalInfoComponent } from '../registration-components/personal-info/personal-info.component';
import { BasicInfoComponent } from '../registration-components/basic-info/basic-info.component';
import { PublicService } from '../../../services/generic/public.service';
import { AlertsService } from '../../../services/generic/alerts.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [LanguageSelectorComponent, RouterModule, TranslateModule, CommonModule, PersonalInfoComponent, BasicInfoComponent],
  selector: 'registration-v2',
  templateUrl: './registration-v2.component.html',
  styleUrls: ['./registration-v2.component.scss']
})
export class RegistrationV2Component {
  private subscriptions: Subscription[] = [];

  currentStep: number = 1;
  personalInfo: any;
  basicInfo: any;

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) { }

  back(): void {
    this.currentStep == 1 ? this.location.back() : this.currentStep -= 1;
  }

  nextStep(event: any): void {
    if (this.currentStep < 2) {
      this.currentStep = event?.nextStep;
      event.name == 'personalInfo' ? this.personalInfo = event?.personalInfo : '';
    } else {
      event.name == 'basicInfo' ? this.basicInfo = event?.basicInfo : '';
      event.registerNow ? this.submit() : '';
    }
  }

  submit(): void {
    const formData = this.collectFormData();
    console.log(formData);

    if (!formData) return;
    this.publicService?.showGlobalLoader?.next(true);
    let registerSubscription = this.authService?.register(formData)?.subscribe(
      (res: any) => {
        if (res) {
          this.handleRegistrationSuccess();
        } else {
          this.handleRegistrationError(res);
        }
      },
      (err: any) => {
        this.handleRegistrationSuccess();
        // this.handleRegistrationError(err);
      }
    );
    this.subscriptions.push(registerSubscription);
  }

  collectFormData(): any {
    return {
      fullName: this.personalInfo.fullName,
      email: this.personalInfo.email,
      password: this.personalInfo.password,
      phoneNumber: this.basicInfo.phoneNumber,
      cityId: this.basicInfo.city?.id,
      postNumber: this.basicInfo.postNumber,
    };
  }

  handleRegistrationSuccess(): void {
    this.publicService?.showGlobalLoader?.next(false);
    this.router?.navigate(['/Auth/Successful-registration', { name: this.personalInfo.fullName }]);
  }

  handleRegistrationError(error: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    const errorMessage = error?.error?.message || error?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService.openToast('error', 'error', errorMessage);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
