import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';
import { PublicService } from './../../../services/generic/public.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountdownComponent } from '../countdown/countdown.component';
import { AuthService } from '../../../services/authentication/auth.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LanguageSelectorComponent, CountdownComponent, CodeInputModule],
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent {
  private subscriptions: Subscription[] = [];

  time: any = Date.now() + ((60 * 1000) * 1);
  isLoadingAction: boolean = false;
  isLoadingBtn: boolean = false;
  isLoading: boolean = false;
  isWaiting: boolean = false;
  codeLength: any;
  urlData: any;
  minute: any;
  email: any;

  constructor(
    private authUserService: AuthService,
    private activateRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.minute = this.time;
    this.urlData = this.activateRoute.snapshot.params;
    if (this.urlData) {
      this.email = this.urlData?.email;
    }
  }

  back(): void {
    this._location.back();
  }

  onCodeChanged(code: string): void {
    this.codeLength = code;
  }
  onCodeCompleted(code: string): void {
    this.codeLength = code;
  }
  printTimeEnd(event: any): void {
    if (event?.end) {
      this.isWaiting = true;
    }
  }

  resendCode(activeLoading?: boolean): void {
    if (activeLoading === true) {
      this.isLoadingAction = true;
    }
    const data = {
      emailAddress: this.email
    };
    this.authUserService?.forgetPassword(data)?.subscribe(
      (res: any) => {
        this.handleResendCodeResponse(res);
      },
      (err: any) => {
        this.handleError(err);
      }
    );

    this.cdr.detectChanges();
  }
  private handleResendCodeResponse(res: any): void {
    this.isLoadingBtn = false;
    this.publicService.showGlobalLoader.next(false);
    this.isLoadingAction = false;

    if (res?.success === true) {
      this.codeLength = null;
      this.isWaiting = true;
      this.minute = Date.now() + (60 * 1000);
      this.isWaiting = false;
    } else {
      res?.error?.message ? this.alertsService?.openToast('error', 'error', res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    }
  }

  submit(): void {
    this.isLoadingBtn = true;
    this.publicService.showGlobalLoader.next(true);
    const data: any = {
      emailAddress: this.email,
      code: this.codeLength
    };
    this.authUserService?.validateCode(data)?.subscribe(
      (res: any) => {
        this.handleResetCodeValidationResponse(res);
      },
      (err: any) => {
        this.router.navigate(['/Auth/Reset-password', { email: this.email, code: this.codeLength }]);
        // this.handleError(err);
        this.publicService.showGlobalLoader.next(false);
      }
    );
    this.cdr.detectChanges();
  }
  private handleResetCodeValidationResponse(res: any): void {
    this.isLoadingBtn = false;
    this.publicService.showGlobalLoader.next(false);
    if (res?.success === true && res?.result === true) {
      this.router.navigate(['/Auth/Reset-password', { email: this.email, code: this.codeLength }]);
    } else {
      if (res?.result === false) {
        this.alertsService?.openToast('error', 'error', 'Invalid OTP Code');
      }
      res?.error?.message ? this.alertsService?.openToast('error', 'error', res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    }
  }
  private handleError(error: any): void {
    error ? this.alertsService?.openToast('error', 'error', error || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    this.isLoadingBtn = false;
    this.isLoadingAction = false;
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
