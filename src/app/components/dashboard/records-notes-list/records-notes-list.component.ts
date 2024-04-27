// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { DynamicTableLocalActionsComponent } from './../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../shared/skeleton/skeleton/skeleton.component';
import { ClientCardComponent } from '../clients/client-card/client-card.component';

//Services
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { PublicService } from './../../../services/generic/public.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Component, Input } from '@angular/core';
import { RecordsComponent } from './records/records.component';
import { NotesListComponent } from './notes-list/notes-list.component';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    ClientCardComponent,
    NotesListComponent,
    SkeletonComponent,
    RecordsComponent,
  ],
  selector: 'app-records-notes-list',
  templateUrl: './records-notes-list.component.html',
  styleUrls: ['./records-notes-list.component.scss']
})
export class RecordsNotesListComponent {
  private subscriptions: Subscription[] = [];
  @Input() clientId: number | string;

  dataStyleType: string = 'list';
  tabType: string = 'records';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  isLoadingList: boolean = false;
  list: any = null;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};

  private searchSubject = new Subject<any>();

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private publicService: PublicService,
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(500)) // Throttle time in milliseconds (1 seconds)
      .subscribe(event => { this.searchHandler(event); });

    this.publicService.isLoadingRecords.subscribe((res) => {
      this.isLoadingList = res;
    });
    this.publicService.recordsLength.subscribe((res: any) => {
      if (res.isChanged) {
        this.list = res.length;
      } else {
        this.list = 0;
      }
    });
    this.publicService.isLoadingSearchRecords.subscribe((res: any) => {
      if (res) {
        this.isLoadingSearch = res;
      } else {
        this.isLoadingSearch = false;
      }
    });
    // this.changeDateStyle('list');
  }
  // Toggle data type records or notes
  showTabItems(type: string): void {
    this.list = 0;
    this.tabType = type;
    this.searchKeyword = null;
    this.dataStyleType = 'list';
    this.tabType == 'records' ? this.publicService.toggleFilterRecordDataType.next({ type: this.dataStyleType, isChanged: true }) : '';
  }

  //Check if Filteration
  ifFilteration(): boolean {
    if (this.hasValue(this.searchKeyword) || this.isArrayNotEmpty(this.filtersArray) || this.isObjectNotEmpty(this.sortObj)) {
      return true;
    } else {
      return false
    }
  }
  // Function to check if a variable is not null or undefined
  hasValue<T>(variable: T | null | undefined): boolean {
    return variable !== null && variable !== undefined;
  }
  // Function to check if an array is not empty
  isArrayNotEmpty<T>(array: T[]): boolean {
    return this.hasValue(array) && array.length > 0;
  }
  // Function to check if an object has at least one key
  isObjectNotEmpty<T>(obj: T): boolean {
    return this.hasValue(obj) && Object.keys(obj).length > 0;
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.dataStyleType = type;
    this.tabType == 'records' ? this.publicService.toggleFilterRecordDataType.next({ type: type, isChanged: true }) : '';
  }

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.tabType == 'records' ? this.publicService.searchRecordsData.next({ key: keyWord, isChanged: true }) : '';

  }
  clearSearch(search: any): void {
    search.value = null;
    this.tabType == 'records' ? this.publicService.searchRecordsData.next({ key: 'empty', isChanged: true }) : '';
  }
  // End Search

  // Add Item
  addItem(): void {
    this.tabType == 'records' ? this.publicService.addRecordItem.next(true) : '';
  }

  // Filter Item Modal
  filterItemModal(): void {
    this.tabType == 'records' ? this.publicService.filterRecordsData.next(true) : '';
  }

  // Clear table
  clearTable(): void {
    this.tabType == 'records' ? this.publicService.resetRecordsData.next(true) : '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

}
