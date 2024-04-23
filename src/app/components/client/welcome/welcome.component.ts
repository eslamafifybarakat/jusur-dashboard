// Modules
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule } from '@angular/router';

// Components
import { DynamicTableLocalActionsComponent } from './../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicSvgComponent } from './../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from './../../../shared/components/dynamic-table/dynamic-table.component';
import { SkeletonComponent } from './../../../shared/skeleton/skeleton/skeleton.component';
import { ClientRecordsComponent } from './records/client-records.component';

//Services
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { MetadataService, MetaDetails } from './../../../services/generic/metadata.service';
import { AuthService } from './../../../services/authentication/auth.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { ClientService } from '../../dashboard/services/client.service';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, Subscription, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    PaginatorModule,
    CalendarModule,
    CommonModule,
    RouterModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    ClientRecordsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private subscriptions: Subscription[] = [];

  currentLanguage: string;
  userData: any;
  dataStyleType: string = 'list';
  clientId: number;

  noteForm = this.fb.group({
    note: ['', { validators: [Validators.required, Validators.minLength(4)], updateOn: 'blur' }],
  });
  get formControls(): any {
    return this.noteForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    private clientService: ClientService,
    public publicService: PublicService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.getUserData();
    this.updateMetaTagsForSEO();
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: this.publicService.translateTextFromJson('metaText.client'),
      description: this.publicService.translateTextFromJson('metaText.description'),
      image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  getUserData(): void {
    this.userData = this.authService.getCurrentUserInformationLocally();
    this.clientId = this.userData.id;
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Add Note Functions
  addNote(): void {
    if (this.noteForm?.valid) {
      this.publicService.showGlobalLoader.next(true);
      let data = {
        desc: this.noteForm?.value?.note,
      };
      //Send Request to add note
      let addNoteSubscription: Subscription = this.clientService?.addNote(data)?.pipe(
        tap(res => this.handleSuccessAddNote(res)),
        catchError(err => this.handleError(err))
      ).subscribe();
      this.subscriptions.push(addNoteSubscription);
    } else {
      this.checkNoteValidation();
    }
  }
  private handleSuccessAddNote(res: any): void {
    if (res?.success == true) {
      this.publicService.showGlobalLoader.next(false);
      this.handleSuccess(res.message);
      this.noteForm.reset();
    } else {
      this.handleError(res.message);
    }
  }
  checkNoteValidation(): void {
    if (this.formControls?.note?.errors?.required) {
      this.alertsService.openToast('error', 'error', this.publicService.translateTextFromJson('validations.requiredField'));
    }
    if (this.formControls?.note?.errors?.minlength) {
      this.alertsService.openToast('error', 'error', this.publicService.translateTextFromJson('validations.noteLength'));
    }
  }

  // Rest Note Value
  cancel(): void {
    this.noteForm.reset();
  }
  // End Add Note Functions

  /* --- Handle api requests error messages --- */
  private handleSuccess(Msg: any): void {
    this.setMessage(Msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
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
