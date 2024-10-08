// Modules
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from './../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from './../../../../shared/skeleton/skeleton/skeleton.component';
import { FilterClientsComponent } from '../filter-clients/filter-clients.component';
import { ClientCardComponent } from './../client-card/client-card.component';
import { AddClientComponent } from '../add-client/add-client.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { ClientListingItem, ClientsListApiResponse } from './../../../../interfaces/dashboard/clients';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    // Modules
    PaginatorModule,
    TranslateModule,
    CommonModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    ClientCardComponent,
    DynamicSvgComponent,
    SkeletonComponent
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
    private confirmationService: ConfirmationService,
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
      debounceTime(800) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.fullName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.fullName'), type: 'text', enableStatus: true, statusName: 'active' },
      { field: 'identity', header: 'dashboard.tableHeader.id', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), type: 'text' },
      { field: 'email', header: 'dashboard.tableHeader.email', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.email'), type: 'text' },
      { field: 'phoneNumber', header: 'dashboard.tableHeader.mobilePhone', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), type: 'text' },
      { field: 'birthDate', header: 'dashboard.tableHeader.birthDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.birthDate'), type: 'date' },
      // { field: 'name', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true },
      // { field: 'identity', header: 'dashboard.tableHeader.id', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true },
      // { field: 'birthDate', header: 'dashboard.tableHeader.date', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), type: 'date', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true },
      // { field: 'phoneNumber', header: 'dashboard.tableHeader.mobilePhone', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true}
    ];
    this.updateMetaTagsForSEO();
    this.getAllClients();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'العملاء  |  جسور',
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

  // Start Clients List Functions
  getAllClients(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingClientsList = true;
    let clientsListSubscription: Subscription = this.clientsService?.getClientsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
      .pipe(
        tap((res: ClientsListApiResponse) => this.processClientsListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeClientListLoading())
      ).subscribe();
    this.subscriptions.push(clientsListSubscription);
  }
  private processClientsListResponse(response: any): void {
    if (response.success == true) {
      this.clientsCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.clientsCount / this.perPage);
      this.clientsList = response?.result?.items;
      this.clientsList.forEach((item: ClientListingItem) => {
        item['isLoadingActive'] = false;
      });
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
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Clients List Functions

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
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
        if (this.clientsCount == 0) {
          this.getAllClients();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllClients() : '';
        }
      }
    });
  }
  // Edit Client
  editItem(item: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  //Start Delete Client Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    const data = {
      id: item?.item?.id
    };
    this.publicService.showGlobalLoader.next(true);
    let deleteClientSubscription: Subscription = this.clientsService?.deleteClientById(item?.item?.id, data)?.pipe(
      tap((res: ClientsListApiResponse) => this.processDeleteClientResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteClientSubscription);
  }
  private processDeleteClientResponse(res: any): void {
    if (res?.success) {
      this.handleSuccess(res?.message);
      this.page = 1;
      this.perPage = 5;
      this.getAllClients();
    } else {
      this.handleError(res?.message);
    }
  }
  //End Delete Client Functions

  // Start Activate Or Suspend Client Functions
  suspendClientAccount(item: any): void {
    this.confirmationService.confirm({
      message: this.publicService.translateTextFromJson('dashboard.customers.areYouSureToSuspend') + ' ' + item?.name + ' ' + this.publicService.translateTextFromJson('dashboard.customers.account'),
      header: this.publicService.translateTextFromJson('dashboard.customers.suspendClient'),
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.toggleActivationClientAccount(item, item?.id);
      }
    });
  }
  activateClientAccount(item: any): void {
    this.confirmationService.confirm({
      message: this.publicService.translateTextFromJson('dashboard.customers.areYouSureToActivate') + ' ' + item.name + ' ' + this.publicService.translateTextFromJson('dashboard.customers.account'),
      header: this.publicService.translateTextFromJson('dashboard.customers.activateClient'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.toggleActivationClientAccount(item, item?.id);
      }
    });
  }
  // End Activate Or Suspend Client Functions

  // Start Toggle Activate Client Functions
  toggleActivationClientAccount(item: any, clientId: number | string): void {
    item.isLoadingActive = true;
    this.publicService.showGlobalLoader.next(true);
    let toggleActivationClientAccountSubscription: Subscription = this.clientsService?.toggleActivateClientAccount(clientId)?.pipe(
      tap((res: any) => this.processToggleActivateResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        item.isLoadingActive = false;
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(toggleActivationClientAccountSubscription);
  }
  private processToggleActivateResponse(res: any): void {
    if (res?.success) {
      this.handleSuccess(res?.message);
      this.getAllClients();
    } else {
      this.handleError(res?.message);
    }
  }
  // End Toggle Activate Client Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.dataStyleType == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.searchKeyword = keyWord;
    this.isLoadingClientsList = true;
    this.isSearch = true;
    this.getAllClients(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllClients(true);
  }
  // End Search Functions

  // Filter Clients Modal Function
  filterItemModal(): void {
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
        this.getAllClients(true);
      }
    });
  }
  // filter Table Functions
  filterItemsTable(event: any): void {
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
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.dataStyleType == 'list' ? this.publicService.resetTable.next(true) : '';
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllClients();
  }
  // Sort table Functions
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

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllClients();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.clientsCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.dataStyleType == 'grid' ? this.getAllClients() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }
  // End Pagination Functions

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
