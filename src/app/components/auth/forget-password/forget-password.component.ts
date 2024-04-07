import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { patterns } from './../../../shared/configs/patterns';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, TranslateModule, LanguageSelectorComponent],
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public publicService: PublicService,
    public alertsService: AlertsService,
    public fb: FormBuilder,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  forgetPasswordForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern(patterns?.email)]]
    }, { updateOn: "blur" }
  );
  get formControls(): any {
    return this.forgetPasswordForm?.controls;
  }

  submit(): void {
    if (!this.forgetPasswordForm?.valid) {
      this.publicService.validateAllFormFields(this.forgetPasswordForm);
      return;
    }

    this.publicService.showGlobalLoader.next(true);
    const data = {
      emailAddress: this.forgetPasswordForm?.value?.email
    };

    let forgetPasswordSubscription = this.authService?.forgetPassword(data)?.subscribe(
      (res: any) => {
        this.publicService.showGlobalLoader.next(false);
        if (res?.success === true) {
          this.handleSuccess(res);
        } else {
          this.handleError(res?.error?.message);
        }
      },
      (err: any) => {
        this.handleSuccess('');
        // this.handleError(err);
      }
    );
    this.subscriptions.push(forgetPasswordSubscription);
  }

  private handleSuccess(res: any): void {
    this.router.navigate(['/Auth/Verification-code', { email: this.forgetPasswordForm?.value?.email }]);
    this.forgetPasswordForm?.reset();
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
