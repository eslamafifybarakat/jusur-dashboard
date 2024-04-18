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
import { FilterEmployeesComponent } from './filter-employees/filter-employees.component';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { EmployeeCardComponent } from './employee-card/employee-card.component';

//Services
import { EmployeesListApiResponse, EmployeesListingItem } from './../../../../interfaces/dashboard/employees';
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from './../../../../services/generic/metadata.service';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { EmployeesService } from '../../services/employees.service';
import { Component, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
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
    EmployeeCardComponent,
    DynamicSvgComponent,
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  selector: 'employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';
  @Input() recordId: number | string;

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Employees List Variables
  isLoadingEmployeesList: boolean = false;
  employeesList: EmployeesListingItem[] = [];
  employeesCount: number = 0;
  tableHeaders: any = [];
  // End Employees List Variables

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
    private employeesService: EmployeesService,
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
    this.setupSubscriptions();
    this.getAllEmployees();
  }
  private initializeTableHeaders(): void {
    this.tableHeaders = [
      {
        field: 'name',
        header: 'dashboard.tableHeader.fullName',
        title: this.publicService?.translateTextFromJson('dashboard.tableHeader.fullName'),
        type: 'text',
      },
      {
        field: 'identity',
        header: 'dashboard.tableHeader.residencyNumber',
        title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencyNumber'),
        type: 'numeric',
      },
      {
        field: 'expiryDate',
        header: 'dashboard.tableHeader.endDate',
        title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'),
        type: 'date',
      },
      {
        field: 'healthCertificate',
        header: 'dashboard.tableHeader.healthCertificate',
        title: this.publicService?.translateTextFromJson('dashboard.tableHeader.healthCertificate'),
        type: 'text',
      },
      {
        field: 'iqamaImage',
        header: 'dashboard.tableHeader.residencePhoto',
        title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencePhoto'),
        type: 'img',
      },
      // {
      //   field: 'name',
      //   header: 'dashboard.tableHeader.fullName',
      //   title: this.publicService?.translateTextFromJson('dashboard.tableHeader.fullName'),
      //   type: 'text',
      //   sort: true,
      //   showDefaultSort: true,
      //   filter: true,
      // },
      // {
      //   field: 'identity',
      //   header: 'dashboard.tableHeader.residencyNumber',
      //   title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencyNumber'),
      //   type: 'numeric',
      //   sort: true,
      //   showDefaultSort: true,
      //   filter: true,
      // },
      // {
      //   field: 'expiryDate',
      //   header: 'dashboard.tableHeader.endDate',
      //   title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'),
      //   type: 'date',
      //   sort: true,
      //   showDefaultSort: true,
      //   filter: true,
      // },
      // {
      //   field: 'healthCertificate',
      //   header: 'dashboard.tableHeader.healthCertificate',
      //   title: this.publicService?.translateTextFromJson('dashboard.tableHeader.healthCertificate'),
      //   type: 'text',
      //   sort: true,
      //   showDefaultSort: true,
      //   filter: true,
      // },
      // {
      //   field: 'iqamaImage',
      //   header: 'dashboard.tableHeader.residencePhoto',
      //   title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencePhoto'),
      //   type: 'img',
      // },
    ];
  }
  private setupSubscriptions(): void {
    this.searchSubject.pipe(debounceTime(500)).subscribe(event => this.searchHandler(event));
    this.publicService.toggleFilterEmployeeDataType.subscribe((res: any) => {
      if (res) {
        this.changeDateStyle(res);
      }
    });

    this.publicService.addEmployeeItem.subscribe(res => {
      if (res) {
        this.addEditEmployeeItem();
      }
    });

    this.publicService.resetEmployeesData.subscribe(res => {
      if (res) {
        this.clearTable();
      }
    });

    this.publicService.searchEmployeesData.subscribe(res => {
      if (res) {
        this.searchHandler(res);
      }
    });

    this.publicService.filterEmployeesData.subscribe(res => {
      if (res) {
        this.filterItemModal();
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الموظفين',
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

  // Start Employees List Functions
  getAllEmployees(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingEmployeesList = true;
    this.employeesService?.getEmployeesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.recordId)
      .pipe(
        tap((res: EmployeesListApiResponse) => this.processEmployeesListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeEmployeeListLoading())
      ).subscribe();
  }
  private processEmployeesListResponse(response: any): void {
    if (response) {
      this.employeesCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.employeesCount / this.perPage);
      this.employeesList = response?.result?.items;
      this.publicService.employeesLength.next(this.employeesCount);
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeEmployeeListLoading(): void {
    this.isLoadingEmployeesList = false;
    this.publicService.isLoadingSearchEmployees.next(false);
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Employees List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.dataStyleType == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.searchKeyword = keyWord;
    this.isLoadingEmployeesList = true;
    this.publicService.isLoadingEmployees.next(true);
    this.isSearch = true;
    this.getAllEmployees(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
      this.publicService.isLoadingSearchEmployees.next(true);
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllEmployees(true);
  }
  // End Search

  //Employee Details
  itemDetails(item?: any): void {
  }
  // Filter Employee
  filterItemModal(): void {
    const ref = this.dialogService?.open(FilterEmployeesComponent, {
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
        this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
        this.getAllEmployees(true);
      }
    });
  }

  // Add Or Edit Employee
  addEditEmployeeItem(item?: any, type?: any): void {
    console.log(this.dataStyleType);

    const ref = this.dialogService?.open(AddEditEmployeeComponent, {
      data: {
        item: {
          clientHistory_id: this.recordId,
          details: item
        },
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.employees.editEmployee') : this.publicService?.translateTextFromJson('dashboard.employees.addEmployee'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
        this.dataStyleType == 'grid' ? this.getAllEmployees() : '';
      }
    });
  }

  //Start Delete Employee Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    this.publicService.showGlobalLoader.next(true);
    this.employeesService?.deleteEmployeeById(item?.item?.id)?.pipe(
      tap((res: EmployeesListApiResponse) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
  }
  private processDeleteResponse(res: any): void {
    const messageType = res?.code === 200 ? 'success' : 'error';
    const message = res?.message || '';

    this.alertsService.openToast(messageType, messageType, message);
    if (messageType === 'success') {
      this.getAllEmployees();
    }
  }
  //End Delete Employee Functions

  // Clear table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.dataStyleType == 'list' ? this.publicService.resetTable.next(true) : '';
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.getAllEmployees();
  }
  // Sort table
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllEmployees();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllEmployees();
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
    this.getAllEmployees();
  }

  // Start Pagination
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllEmployees();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.employeesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.dataStyleType == 'grid' ? this.getAllEmployees() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // End Pagination

  /* --- Handle api requests error messages --- */
  private handleError(err: any): any {
    this.setErrorMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
    this.publicService.showGlobalLoader.next(false);
    this.finalizeEmployeeListLoading();
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
