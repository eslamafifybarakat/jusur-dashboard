import { ConfirmPasswordValidator } from './../../../../shared/configs/confirm-password-validator';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { AuthService } from '../../../../services/authentication/auth.service';
import { patterns } from './../../../../shared/configs/patterns';
import { PasswordPatterns } from './../../../../interfaces/auth';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterModule, PasswordModule],
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  private subscriptions: Subscription[] = [];
  @Output() nextStep: EventEmitter<any> = new EventEmitter();
  passwordPatterns: PasswordPatterns[] = [
    { title: 'validations.containChar', value: '(?=.*[a-z])' },
    { title: 'validations.eightChars', value: '.{8,}' },
    { title: 'validations.oneNumeric', value: '(.*[0-9].*)' },
    { title: 'validations.specialChar', value: '(?=.*[!@#$%^&*])' },
    { title: 'validations.notContainInfo', value: '(?=.*[a-z])' }
  ];
  isEmailFound: boolean = false;
  isCheckEmail: boolean = false;

  personalInfoForm = this.fb.group({
    fullName: ['', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }],
    email: ['', { validators: [Validators.required, Validators.pattern(patterns?.email)], updateOn: 'blur' }],
    password: ['', { validators: [Validators.required, Validators.pattern(patterns?.password)], updateOn: 'blur' }],
    confirmPassword: ['', { validators: [Validators.required, Validators.pattern(patterns?.password)], updateOn: 'blur' }],
  }, {
    validator: ConfirmPasswordValidator.MatchPassword
  });
  get formControls(): any {
    return this.personalInfoForm?.controls;
  }
  get passwordFormField(): any {
    return this.personalInfoForm.get('password');
  }
  constructor(
    public publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  isEmailAvailable(email: string): void {
    this.isCheckEmail = true;
    if (this.authService) {
      let emailSubscription: Subscription = this.authService.isEmailAvailable(email).subscribe(
        (res: any) => {
          this.handleSuccess(res);
        },
        (err: any) => {
          // this.handleError(err);
          this.isCheckEmail = false
        }
      );
      // Clean up the subscription on component destroy
      if (emailSubscription) {
        this.subscriptions.push(emailSubscription);
      }
    }

  }
  handleSuccess = (res: any) => {
    if (res.code === 200) {
      this.isEmailFound = res.data === true;
    } else {
      this.isEmailFound = false;
      this.handleError(res.error?.message);
    }
    this.isCheckEmail = false;
    this.cdr.detectChanges();
  };
  handleError = (err: any) => {
    if (err) {
      this.alertsService.openToast('error', 'error', err.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
    this.isCheckEmail = false;
  };

  onKeyUpEvent(type: any): void {
    type == 'email' ? this.isEmailFound = false : '';
  }

  continue(): void {
    if (this.personalInfoForm?.valid) {
      // if (!this.isEmailFound) {
      this.nextStep.emit({ name: 'personalInfo', personalInfo: this.personalInfoForm.value, nextStep: 2 });
      // }
    } else {
      this.publicService?.validateAllFormFields(this.personalInfoForm);
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
