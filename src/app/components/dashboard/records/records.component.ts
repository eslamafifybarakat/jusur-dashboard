// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from './../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../shared/skeleton/skeleton/skeleton.component';
import { FilterRecordComponent } from './filter-record/filter-record.component';
import { RecordCardComponent } from './record-card/record-card.component';
import { AddRecordComponent } from './add-record/add-record.component';

//Services
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { RecordsListApiResponse, RecordsListingItem } from './../../../interfaces/dashboard/records';
import { MetaDetails, MetadataService } from './../../../services/generic/metadata.service';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { RecordsService } from '../services/records.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    SidebarModule,
    CommonModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    RecordCardComponent,
    SkeletonComponent,
  ],
  selector: 'records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent {
  private subscriptions: Subscription[] = [];

  @Input() clientId: number | string;

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
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.recordName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.recordName'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'number', header: 'dashboard.tableHeader.recordNumber', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.recordNumber'), type: 'numeric', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'expireDate', header: 'dashboard.tableHeader.endDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'), type: 'date', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
    ];
    this.loadPageData();
  }

  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.getAllRecords(false, this.clientId);
    this.searchSubject.pipe(debounceTime(500)) // Throttle time in milliseconds (1 seconds)
      .subscribe(event => { this.searchHandler(event); });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'السجلات',
      description: 'الوصف',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Logo.jpeg?updatedAt=1712577283111'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start Records List Functions
  getAllRecords(isFiltering?: boolean, clientId?: number | string): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingRecordsList = true;
    this.recordsService?.getRecordsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, clientId)
      .pipe(
        tap((res: RecordsListApiResponse) => this.processRecordsListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeRecordListLoading())
      ).subscribe();
  }
  private processRecordsListResponse(response: any): void {
    if (response) {
      this.recordsCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.recordsCount / this.perPage);
      this.recordsList = response?.result?.items;
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeRecordListLoading(): void {
    this.isLoadingRecordsList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
  }
  // End Records List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 20;
    this.searchKeyword = keyWord;
    this.isLoadingRecordsList = true;
    this.getAllRecords(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
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
    this.router.navigate(['Dashboard/Clients/Record-Details', item?.id]);
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
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
      }
    });
  }
  // Edit Record
  editItem(item: any): void {
    this.router.navigate(['Dashboard/Clients/Record-Details', item?.id]);
  }

  // Filter Record
  filterItem(): void {
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
        // this.publicService?.changePageSub?.next({ page: this.page });
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
    this.recordsService?.deleteRecordById(item?.item?.id, data)?.subscribe(
      (res: any) => {
        this.processDeleteResponse(res);
      },
      (err) => {
        this.handleErrorDelete(err);
      }
    ).add(() => {
      this.publicService.showGlobalLoader.next(false);
      this.cdr.detectChanges();
    });
  }
  private processDeleteResponse(res: any): void {
    const messageType = res?.code === 200 ? 'success' : 'error';
    const message = res?.message || '';

    this.alertsService.openToast(messageType, messageType, message);
    if (messageType === 'success') {
      this.getAllRecords();
    }
  }
  private handleErrorDelete(err: any): void {
    const errorMessage = err?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService.openToast('error', 'error', errorMessage);
  }
  //End Delete Record

  // Clear Table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
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
  }
  // End Pagination

  /* --- Handle api requests error messages --- */
  private handleError(err: any): any {
    this.setErrorMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
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

