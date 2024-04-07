import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';
import { ConfirmPasswordValidator } from './../../../shared/configs/confirm-password-validator';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { patterns } from './../../../shared/configs/patterns';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PasswordModule, DividerModule, LanguageSelectorComponent, TranslateModule],
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  private subscriptions: Subscription[] = [];

  showEye: boolean = false;
  data: any;
  isPasswordChange: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.data = this.activatedRoute?.snapshot?.params;
    this.resetPasswordForm?.get('password').valueChanges.subscribe(() => {
      this.resetPasswordForm?.get('confirmPassword').setErrors(null);
      this.isPasswordChange = true;
    });
    this.resetPasswordForm?.get('confirmPassword').valueChanges.subscribe(() => {
      this.isPasswordChange = false;
    });
  }

  resetPasswordForm: any = this.fb.group({
    password: ['', {
      validators: [Validators.required, Validators.pattern(patterns?.password)],
      updateOn: 'blur'
    }],
    confirmPassword: ['', {
      validators: [Validators.required, Validators.pattern(patterns?.password)],
      updateOn: 'blur'
    }]
  },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    }
  );
  get formControls(): any {
    return this.resetPasswordForm?.controls;
  }
  onFocusConfirmPassword(): void {
    this.isPasswordChange = false;
  }
  back(): void {
    this._location?.back();
  }

  submit(): void {
    this.isPasswordChange = false;
    if (!this.resetPasswordForm?.valid) {
      this.publicService?.validateAllFormFields(this.resetPasswordForm);
      return;
    }
    this.publicService.showGlobalLoader.next(true);
    const data = {
      code: this.data?.code,
      emailAddress: this.data?.email,
      newPassword: this.resetPasswordForm?.value?.password
    };
    let resetPasswordSubscription: any = this.authService?.resetPassword(data)?.subscribe(
      (res: any) => {
        this.publicService.showGlobalLoader.next(false);
        if (res?.success === true) {
          this.handleSuccess();
        } else {
          this.handleError(res?.error?.message);
        }
      },
      (err: any) => {
        this.handleSuccess();
        // this.handleError(err);
      }
    );
    this.subscriptions.push(resetPasswordSubscription);
    this.cdr?.detectChanges();
  }
  private handleSuccess(): void {
    this.router.navigate(['/Auth/Login']);
    this.resetPasswordForm?.reset();
    this.publicService.showGlobalLoader.next(false);
  }
  private handleError(error: any): void {
    this.publicService.showGlobalLoader.next(false);
    if (error) {
      this.alertsService?.openToast('error', 'error', error || this.publicService.translateTextFromJson('general.errorOccur'));
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
