// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from './../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableComponent } from './../../../../shared/components/dynamic-table/dynamic-table.component';
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
import { Component, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    EmployeeCardComponent,
    SkeletonComponent,
  ],
  selector: 'employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

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
    this.tableHeaders = [
      { field: 'fullName', header: 'dashboard.tableHeader.fullName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.fullName'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'residencyNumber', header: 'dashboard.tableHeader.residencyNumber', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencyNumber'), type: 'numeric', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'endDate', header: 'dashboard.tableHeader.endDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endDate'), type: 'date', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'healthCertificate', header: 'dashboard.tableHeader.healthCertificate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.healthCertificate'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true },
      { field: 'residencePhoto', header: 'dashboard.tableHeader.residencePhoto', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.residencePhoto'), type: 'img' },
    ];
    this.getAllEmployees();
    this.searchSubject
      .pipe(
        debounceTime(500) // Throttle time in milliseconds (1 seconds)
      )
      .subscribe(event => {
        this.searchHandler(event);
      });
    this.publicService.toggleFilterEmployeeDataType.subscribe((res: any) => {
      if (res) {
        this.changeDateStyle(res);
      }
    })
    this.publicService.addEmployeeItem.subscribe((res: any) => {
      if (res) {
        this.addEditEmployeeItem();
      }
    })
    this.publicService.resetEmployeesData.subscribe((res: any) => {
      if (res) {
        this.clearTable();
      }
    })
    this.publicService.searchEmployeesData.subscribe((res: any) => {
      if (res) {
        this.searchHandler(res);
      }
    })
    this.publicService.filterEmployeesData.subscribe((res: any) => {
      if (res) {
        this.filterItem();
      }
    })
  }

  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الموظفين',
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

  // Start Employees List Functions
  getAllEmployees(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingEmployeesList = true;
    this.employeesService?.getEmployeesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
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
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeEmployeeListLoading(): void {
    this.isLoadingEmployeesList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
    this.setDummyData();
  }
  private setDummyData(): void {
    this.employeesList = [
      { fullName: "Ali Ahmed", residencyNumber: '01009887876', endDate: new Date(), healthCertificate: '33u2929899', residencePhoto: 'assets/images/home/sidebar-bg.webp' },
      { fullName: "Ali Ahmed", residencyNumber: '01009887876', endDate: new Date(), healthCertificate: '33u2929899', residencePhoto: 'assets/images/home/sidebar-bg.webp' },
      { fullName: "Ali Ahmed", residencyNumber: '01009887876', endDate: new Date(), healthCertificate: '33u2929899', residencePhoto: 'assets/images/home/sidebar-bg.webp' },
      { fullName: "Ali Ahmed", residencyNumber: '01009887876', endDate: new Date(), healthCertificate: '33u2929899', residencePhoto: 'assets/images/home/sidebar-bg.webp' },
      { fullName: "Ali Ahmed", residencyNumber: '01009887876', endDate: new Date(), healthCertificate: '33u2929899', residencePhoto: 'assets/images/home/sidebar-bg.webp' },
    ];
    this.publicService.employeesLength.next(this.employeesCount);
    this.employeesCount = 3225;
  }
  // End Employees List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 20;
    this.searchKeyword = keyWord;
    this.isLoadingEmployeesList = true;
    this.publicService.isLoadingEmployees.next(true);
    this.getAllEmployees(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
      this.publicService.isLoadingSearchEmployees.next(true);
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.getAllEmployees(true);
  }
  // End Search

  //Employee Details
  itemDetails(item?: any): void {
  }

  // Add Or Edit Employee
  addEditEmployeeItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditEmployeeComponent, {
      data: {
        item,
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
        this.getAllEmployees();
      }
    });
  }

  // Filter Employee
  filterItem(): void {
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
        this.getAllEmployees(true);
      }
    });
  }

  //Start Delete Employee==========
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
      this.getAllEmployees();
    }
  }
  private handleErrorDelete(err: any): void {
    const errorMessage = err?.message || this.publicService.translateTextFromJson('general.errorOccur');
    this.alertsService.openToast('error', 'error', errorMessage);
  }
  //End Delete Employee

  // Clear table
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
