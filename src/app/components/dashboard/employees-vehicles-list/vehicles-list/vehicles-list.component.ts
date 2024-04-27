import { ConfirmationService } from 'primeng/api';
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
import { AddEditVehicleComponent } from './add-edit-vehicle/add-edit-vehicle.component';
import { FilterVehiclesComponent } from './filter-vehicles/filter-vehicles.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { VehiclesListApiResponse, VehiclesListingItem } from './../../../../interfaces/dashboard/vehicles';
import { Component, ChangeDetectorRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { VehiclesService } from './../../services/vehicles.service';
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
    VehicleCardComponent,
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  selector: 'vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent {
  private subscriptions: Subscription[] = [];

  tabType: string;
  dataStyleType: string = 'list';

  @Input() recordId: number | string;
  @Input() onlyPreview: boolean = false;
  @Input() showAddBtn: boolean = true;
  @Output() showTabItemsHandler = new EventEmitter();

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  // Start Vehicles List Variables
  isLoadingVehiclesList: boolean = false;
  vehiclesList: VehiclesListingItem[] = [];
  vehiclesCount: number = 0;
  tableHeaders: any = [];
  // End Vehicles List Variables

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
    private vehiclesService: VehiclesService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.tabType = 'vehicles';

    this.initializeTableHeaders();
    this.setupSubscriptions();
    this.getAllVehicles(false);
  }
  private initializeTableHeaders(): void {
    this.tableHeaders = [
      { field: 'workPermitCard', header: 'dashboard.tableHeader.operatingCard', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.operatingCard'), type: 'text' },
      { field: 'expiryDate', header: 'dashboard.tableHeader.endDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'), type: 'date' },
      { field: 'insuranceExpiryDate', header: 'dashboard.tableHeader.insuranceExpiryDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.insuranceExpiryDate'), type: 'date' },
      { field: 'formImage', header: 'dashboard.tableHeader.formPhoto', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.formPhoto'), type: 'img' },
    ];
  }
  private setupSubscriptions(): void {
    this.searchSubject.pipe(debounceTime(500)).subscribe(event => this.searchHandler(event));
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'المركبات',
      description: 'الوصف',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  showTabItems(type: string): void {
    this.showTabItemsHandler.emit('employees');
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

  // Start Vehicles List Functions
  getAllVehicles(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingVehiclesList = true;
    let vehiclesSubscription = this.vehiclesService?.getVehiclesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.recordId)
      .pipe(
        tap((res: VehiclesListApiResponse) => this.processVehiclesListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeVehicleListLoading())
      ).subscribe();
    this.subscriptions.push(vehiclesSubscription);
  }
  private processVehiclesListResponse(response: any): void {
    if (response) {
      this.vehiclesCount = response?.result?.totalCount;
      this.publicService.VehicleLength.next(this.vehiclesCount);
      this.pagesCount = Math.ceil(this.vehiclesCount / this.perPage);
      this.vehiclesList = response?.result?.items;
      this.vehiclesList.forEach((item: VehiclesListingItem) => {
        item['isLoadingActive'] = false;
        item['active'] = false;
      });
      this.publicService.VehicleLength.next(this.vehiclesCount);
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeVehicleListLoading(): void {
    this.isLoadingVehiclesList = false;
    this.isLoadingSearch = false;
    this.publicService.isLoadingSearchVehicles.next(false);
    this.publicService.isLoadingVehicles.next(false);
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Start Vehicles List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.dataStyleType == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.searchKeyword = keyWord;
    this.isLoadingVehiclesList = true;
    this.publicService.isLoadingEmployees.next(true);
    this.isSearch = true;
    this.getAllVehicles(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
      this.publicService.isLoadingSearchVehicles.next(true);
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllVehicles(true);
  }
  // End Search

  // Vehicle Details
  itemDetails(item?: any): void {
  }
  // Add Or Edit Vehicle
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditVehicleComponent, {
      data: {
        item: {
          clientHistory_id: this.recordId,
          details: item
        },
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.vehicles.editVehicle') : this.publicService?.translateTextFromJson('dashboard.vehicles.addVehicle'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      this.publicService.addVehicleItem.next(false);
      if (res?.listChanged) {
        if (this.vehiclesCount == 0) {
          this.getAllVehicles();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllVehicles() : '';
        }
      }
    });
  }
  // Filter Vehicle
  filterItem(): void {
    const ref = this.dialogService?.open(FilterVehiclesComponent, {
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
        this.publicService?.changePageSub?.next({ page: this.page });
        this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
        this.dataStyleType == 'grid' ? this.getAllVehicles() : '';
      }
    });
  }

  // Start Activate Or Suspend Vehicle Functions
  suspendVehicleAccount(item: any): void {
    this.confirmationService.confirm({
      message: this.publicService.translateTextFromJson('dashboard.customers.areYouSureToSuspend') + ' ' + item?.workPermitCard + ' ' + this.publicService.translateTextFromJson('dashboard.customers.account'),
      header: this.publicService.translateTextFromJson('dashboard.vehicles.suspendVehicle'),
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.toggleActivationVehicleAccount(item, item?.id);
      }
    });
  }
  activateVehicleAccount(item: any): void {
    this.confirmationService.confirm({
      message: this.publicService.translateTextFromJson('dashboard.customers.areYouSureToActivate') + ' ' + item.workPermitCard + ' ' + this.publicService.translateTextFromJson('dashboard.customers.account'),
      header: this.publicService.translateTextFromJson('dashboard.vehicles.activateVehicle'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.toggleActivationVehicleAccount(item, item?.id);
      }
    });
  }
  // End Activate Or Suspend Vehicle Functions

  // Start Toggle Activate Vehicle Functions
  toggleActivationVehicleAccount(item: any, vehicleId: number | string): void {
    item.isLoadingActive = true;
    this.publicService.showGlobalLoader.next(true);
    let toggleActivationSubscription = this.vehiclesService?.toggleActivateVehicleAccount(vehicleId)?.pipe(
      tap((res: any) => this.processToggleActivateResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        item.isLoadingActive = false;
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(toggleActivationSubscription);
  }
  private processToggleActivateResponse(res: any): void {
    if (res?.success) {
      this.handleSuccess(res?.message);
      this.getAllVehicles();
    } else {
      this.handleError(res?.message);
    }
  }
  // End Toggle Activate Vehicle Functions

  //Start Delete Vehicle Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }

    const data = {
      name: item?.item?.title
    };

    // this.publicService.showGlobalLoader.next(true);

    // this.clientsService?.deleteClientById(item?.item?.id, data)?.subscribe(
    //   (res: any) => {
    //     this.processDeleteResponse(res);
    //   },
    //   (err) => {
    //     this.handleErrorDelete(err);
    //   }
    // ).add(() => {
    //   this.publicService.showGlobalLoader.next(false);
    //   this.cdr.detectChanges();
    // });
  }
  private processDeleteResponse(res: any): void {
    const messageType = res?.code === 200 ? 'success' : 'error';
    const message = res?.message || '';

    this.alertsService.openToast(messageType, messageType, message);
    if (messageType === 'success') {
      this.getAllVehicles();
    }
  }
  private handleErrorDelete(err: any): void {
    const errorMessage = err?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService.openToast('error', 'error', errorMessage);
  }
  //End Delete Vehicle Functions

  // Clear Table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.dataStyleType == 'list' ? this.publicService.resetTable.next(true) : '';
    this.dataStyleType == 'list' ? this.publicService?.changePageSub?.next({ page: this.page }) : '';
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
  }
  // Sort Table
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllVehicles();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllVehicles();
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
    this.publicService?.changePageSub?.next({ page: this.page });
    // this.getAllVehicles();
  }

  // Start Pagination
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllVehicles();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.vehiclesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.dataStyleType == 'grid' ? this.getAllVehicles() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
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
    this.finalizeVehicleListLoading();
  }


  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
