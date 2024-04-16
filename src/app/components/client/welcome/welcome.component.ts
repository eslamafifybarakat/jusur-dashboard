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

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    PaginatorModule,

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
  userData: any;
  dataStyleType: string = 'list';
  clientId: number = 21;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private authService: AuthService,
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
      image: 'https://ik.imagekit.io/2cvha6t2l9/Logo.jpeg?updatedAt=1712577283111'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }
}
