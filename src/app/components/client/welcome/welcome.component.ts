import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { MetadataService, MetaDetails } from './../../../services/generic/metadata.service';
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { SkeletonComponent } from './../../../shared/skeleton/skeleton/skeleton.component';
import { DynamicSvgComponent } from './../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from './../../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicTableLocalActionsComponent } from './../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './../../../services/authentication/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { RecordsComponent } from '../../dashboard/records/records.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, Subscription, tap } from 'rxjs';
import { ClientService } from '../../dashboard/services/client.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    PaginatorModule,
    CalendarModule,
    CommonModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent,
    RecordsComponent
  ],
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private subscriptions: Subscription[] = [];

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
  submit(): void {
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
      this.publicService.validateAllFormFields(this.noteForm);
    }
  }
  private handleSuccessAddNote(res: any): void {
    if (res?.success == true) {
      this.publicService.showGlobalLoader.next(false);
    } else {
      this.handleError(res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur'));
    }
  }
  // End Add Note Functions

  /* --- Handle api requests error messages --- */
  private handleError(err: any): any {
    this.setErrorMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
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
