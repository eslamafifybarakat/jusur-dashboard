// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from './../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../../shared/components/dynamic-table/dynamic-table.component';
import { SkeletonComponent } from './../../../../shared/skeleton/skeleton/skeleton.component';
import { AddClientComponent } from '../add-client/add-client.component';
import { FilterClientsComponent } from '../filter-clients/filter-clients.component';
import { ClientCardComponent } from './../client-card/client-card.component';

//Services
import { ClientListingItem, ClientsListApiResponse } from './../../../../interfaces/dashboard/clients';
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, map, tap } from 'rxjs/operators';
import { ClientsService } from '../../services/clients.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
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
    ClientCardComponent,
    SkeletonComponent,
  ],
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Clients List Variables
  isLoadingClientsList: boolean = false;
  clientsList: ClientListingItem[] = [];
  clientsCount: number = 0;
  tableHeaders: any = [];
  // End Clients List Variables

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
    private clientsService: ClientsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(500) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'identity', header: 'dashboard.tableHeader.id', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'birthDate', header: 'dashboard.tableHeader.date', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), type: 'date', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'phoneNumber', header: 'dashboard.tableHeader.mobilePhone', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      // { field: 'status', header: 'dashboard.tableHeader.status', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: false, type: 'filterArray', dataType: 'array', list: 'orderStatus', placeholder: this.publicService?.translateTextFromJson('placeholder.status'), label: this.publicService?.translateTextFromJson('labels.status'), status: true },
      // { field: 'propertyType', header: 'dashboard.tableHeader.propertyType', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'filterArray', dataType: 'array', list: 'propertyType', placeholder: this.publicService?.translateTextFromJson('placeholder.propertyType'), label: this.publicService?.translateTextFromJson('labels.propertyType') },
    ];
    this.updateMetaTagsForSEO();
    this.getAllClients();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'العملاء',
      description: 'الوصف',
      image: 'https://avatars.githubusercontent.com/u/52158422?s=48&v=4'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start Clients List Functions
  getAllClients(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingClientsList = true;
    this.clientsService?.getClientsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
      .pipe(
        tap((res: ClientsListApiResponse) => this.processClientsListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeClientListLoading())
      ).subscribe();
  }
  private processClientsListResponse(response: any): void {
    if (response) {
      this.clientsCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.clientsCount / this.perPage);
      this.clientsList = response?.result?.items;
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeClientListLoading(): void {
    this.isLoadingClientsList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Clients List Functions

  itemDetails(item?: any): void {
  }
  // Add Client
  addItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddClientComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.customers.editCustomer') : this.publicService?.translateTextFromJson('dashboard.customers.addCustomer'),
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
  // Edit Client
  editItem(item: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  //Delete Client
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    const data = {
      name: item?.item?.title
    };
    this.publicService.showGlobalLoader.next(true);
    this.clientsService?.deleteClientById(item?.item?.id, data)?.subscribe(
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
      this.getAllClients();
    }
  }
  private handleErrorDelete(err: any): void {
    const errorMessage = err?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService.openToast('error', 'error', errorMessage);
  }

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 20;
    this.searchKeyword = keyWord;
    this.isLoadingClientsList = true;
    this.getAllClients(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.getAllClients(true);
  }
  // End Search

  // Filter Clients
  filterItem(): void {
    const ref = this.dialogService?.open(FilterClientsComponent, {
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
        this.getAllClients(true);
      }
    });
  }
  // Clear table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllClients();
  }
  // Sort table
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllClients();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllClients();
    }
  }
  // filter table
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
    this.getAllClients();
  }

  // Start Pagination
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllClients();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.clientsCount / this.perPage);
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
    this.finalizeClientListLoading();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
