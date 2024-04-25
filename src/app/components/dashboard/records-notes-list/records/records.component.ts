// Modules
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { DynamicTableLocalActionsComponent } from './../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../../shared/skeleton/skeleton/skeleton.component';
import { FilterRecordComponent } from './filter-record/filter-record.component';
import { RecordCardComponent } from './record-card/record-card.component';
import { AddRecordComponent } from './add-record/add-record.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { RecordsListApiResponse, RecordsListingItem } from './../../../../interfaces/dashboard/records';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { RecordsService } from '../../services/records.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    PaginatorModule,
    CommonModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    RecordCardComponent,
    SkeletonComponent
  ],
  selector: 'records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent {
  private subscriptions: Subscription[] = [];

  @Input() clientId: number | string;
  @Input() showRecordCount: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() showFilter: boolean = true;
  @Input() showToggleData: boolean = true;
  @Input() showAddBtn: boolean = true;
  @Input() showReset: boolean = true;
  @Input() changeTitleStyle: boolean = false;
  @Input() isClientHistory: boolean = false;

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Records List Variables
  isLoadingRecordsList: boolean = false;
  recordsList: RecordsListingItem[] = [];
  recordsCount: number = 0;
  tableHeaders: any = [];
  // End Records List Variables

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 5;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];
  @ViewChild('paginator') paginator: Paginator | undefined;
  // End Pagination Variables

  // Start Filtration Variables
  private searchSubject = new Subject<any>();
  filterCards: any = [];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};
  // End Filtration Variables

  // Start Permissions Variables
  showActionTableColumn: boolean = false;
  showEditAction: boolean = false;
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;
  // End Permissions Variables

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private recordsService: RecordsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.initializeTableHeaders();
    this.loadPageData();

    // Start Behavior Subject Actions
    this.publicService.toggleFilterRecordDataType.subscribe((res: any) => {
      // Call Record List at first initialization
      if (res) {
        this.changeDateStyle(res);
      }
    });
    this.publicService.addRecordItem.subscribe(res => {
      if (res == true) {
        this.addItem();
      }
    });
    this.publicService.resetRecordsData.subscribe(res => {
      if (res == true) {
        this.clearTable();
      }
    });
    this.publicService.searchRecordsData.subscribe(res => {
      if (res) {
        if (res == 'empty') {
          this.searchHandler(null);
        } else {
          this.searchHandler(res);
        }
      }
    });
    this.publicService.filterRecordsData.subscribe(res => {
      if (res) {
        this.filterItemModal();
      }
    });
    // End Behavior Subject Actions
  }
  private initializeTableHeaders(): void {
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.recordName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.recordName'), type: 'text' },
      { field: 'number', header: 'dashboard.tableHeader.recordNumber', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.recordNumber'), type: 'numeric' },
      { field: 'expireDate', header: 'dashboard.tableHeader.endDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'), type: 'date' },
    ];
  }
  private loadPageData(): void {
    this.updateMetaTagsForSEO();
    // this.getAllRecords(false);
    this.searchSubject.pipe(debounceTime(800)) // Throttle time in milliseconds (1 seconds)
      .subscribe(event => { this.searchHandler(event); });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: this.isClientHistory ? 'بياناتي' : 'السجلات',
      description: 'الوصف',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
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
    type == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start Records List Functions
  getAllRecords(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingRecordsList = true;
    let recordsSubscription: Subscription = this.recordsService?.getRecordsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.clientId)
      .pipe(
        tap((res: RecordsListApiResponse) => this.processRecordsListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeRecordListLoading())
      ).subscribe();
    this.subscriptions.push(recordsSubscription);
  }
  private processRecordsListResponse(response: any): void {
    if (response) {
      this.recordsCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.recordsCount / this.perPage);
      this.recordsList = response?.result?.items;
      this.publicService.recordsLength.next(this.recordsList);
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeRecordListLoading(): void {
    this.isLoadingRecordsList = false;
    this.publicService.isLoadingSearchRecords.next(false);
    this.publicService.isLoadingRecords.next(false);
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Records List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.dataStyleType == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.searchKeyword = keyWord;
    this.isLoadingRecordsList = true;
    this.isSearch = true;
    this.publicService.isLoadingRecords.next(true);
    this.getAllRecords(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
      this.publicService.isLoadingSearchRecords.next(true);
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllRecords(true);
  }
  // End Search

  // Record Details
  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Clients/RecordDetails', item?.id, { clientId: this.clientId }]);
  }
  // Add Record
  addItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddRecordComponent, {
      data: {
        item: {
          id: this.clientId
        },
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.records.editRecord') : this.publicService?.translateTextFromJson('dashboard.records.addRecord'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      this.publicService.addRecordItem.next(false);
      if (res?.listChanged) {
        if (this.recordsCount == 0) {
          this.getAllRecords();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
        }
        this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
        this.dataStyleType == 'grid' ? this.getAllRecords() : '';
      }
    });
  }
  // Edit Record
  editItem(item: any): void {
    this.router.navigate(['Dashboard/Clients/RecordDetails', item?.id]);
  }

  // Filter Record Modal
  filterItemModal(): void {
    const ref = this.dialogService?.open(FilterRecordComponent, {
      header: this.publicService?.translateTextFromJson('general.filter'),
      dismissableMask: false,
      width: '45%',
      data: this.filterCards,
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.page = 1;
        this.filtersArray = res.conditions;
        this.filterCards = res.conditions;
        this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
        this.getAllRecords(true);
      }
    });
  }
  //Start Delete Record
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }

    const data = {
      name: item?.item?.title
    };
    this.publicService.showGlobalLoader.next(true);
    let deleteRecordSubscription: Subscription = this.recordsService?.deleteRecordById(item?.item?.id, data)
      ?.pipe(
        tap(res => this.processDeleteRecordResponse(res)),
        catchError(err => this.handleError(err))
      ).subscribe();
    this.subscriptions.push(deleteRecordSubscription);
  }
  private processDeleteRecordResponse(res: any): void {
    if (res?.success) {
      this.handleSuccess(res?.message);
      this.getAllRecords();
    } else {
      this.handleError(res?.message);
    }
  }
  //End Delete Record

  // Clear Table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.dataStyleType == 'list' ? this.publicService.resetTable.next(true) : '';
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllRecords();
  }
  // Sort Table
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllRecords();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllRecords();
    }
  }
  // filter Table
  filterItems(event: any): void {
    this.filtersArray = [];
    Object.keys(event)?.forEach((key: any) => {
      this.tableHeaders?.forEach((colHeader: any) => {
        if (colHeader?.field == key) {
          event[key]?.forEach((record: any) => {
            record['type'] = colHeader?.type;
          });
        }
      });
    });
    Object.keys(event).forEach((key: any) => {
      event[key]?.forEach((record: any) => {
        if (record['type'] && record['value'] !== null) {
          let filterData;
          if (record['type'] == 'text' || record['type'] == 'date' || record['type'] == 'numeric' || record['type'] == 'status') {
            let data: any;
            if (record['type'] == 'date') {
              data = new Date(record?.value?.setDate(record?.value?.getDate() + 1));
              record.value = new Date(record?.value?.setDate(record?.value?.getDate() - 1));
            } else {
              data = record?.value;
            }

            filterData = {
              column: key,
              type: record?.type,
              data: data,
              operator: record?.matchMode
            }
          }

          else if (record['type'] == 'filterArray') {
            let arr: any = [];
            record?.value?.forEach((el: any) => {
              arr?.push(el?.id || el?.value);
            });
            if (arr?.length > 0) {
              filterData = {
                column: key,
                type: 'relation',
                data: arr
              }
            }
          }
          else if (record['type'] == 'boolean') {
            filterData = {
              column: key,
              type: record?.type,
              data: record?.value
            }
          }
          if (filterData) {
            this.filtersArray?.push(filterData);
          }
        }
      });
    });
    this.page = 1;
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllRecords();
  }

  // Start Pagination
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllRecords();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.recordsCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.dataStyleType == 'grid' ? this.getAllRecords() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }
  // End Pagination

  /* --- Handle api requests messages --- */
  private handleSuccess(Msg: any): void {
    this.setMessage(Msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type: string): void {
    this.alertsService.openToast(type, type, message);
    this.publicService.showGlobalLoader.next(false);
    this.finalizeRecordListLoading();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}

