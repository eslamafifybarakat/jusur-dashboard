// Modules
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';

//Services
import { Component, EventEmitter, Output, ViewChild, Input, Inject, PLATFORM_ID } from '@angular/core';
import { PublicService } from './../../../services/generic/public.service';
import { keys } from './../../configs/localstorage-key';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Components
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { DynamicSvgComponent } from '../icons/dynamic-svg/dynamic-svg.component';

@Component({
  standalone: true,
  imports: [
    // Modules
    DynamicDialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    MultiSelectModule,
    InputSwitchModule,
    TranslateModule,
    PaginatorModule,
    SkeletonModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    CommonModule,
    ImageModule,
    FormsModule,
    TableModule,

    DynamicSvgComponent,
  ],
  selector: 'dynamic-table-local-actions',
  templateUrl: './dynamic-table-local-actions.component.html',
  styleUrls: ['./dynamic-table-local-actions.component.scss']
})
export class DynamicTableLocalActionsComponent {
  private subscriptions: Subscription[] = [];

  // Header action variable
  @Input() showHeader: boolean = false;
  @Input() showSearch: boolean = false;
  @Input() isLoadingSearch: boolean = false;
  @Input() showClear: boolean = false;
  @Input() isSearch: boolean = false;

  @Input() enableDeleteButton: boolean = false;

  // Table variables
  @Input() isLoading: boolean = false;
  @Input() tableHeaders: any = [];
  @Input() tableData: any = [];
  @Input() totalItems: number = 0;

  @Input() showSelection: boolean = false;
  @Input() showArrangement: boolean = false;
  @Input() statuses: any = [];

  // Date variables
  @Input() enableDateFormate: boolean = false;
  @Input() dateFormateString: string = 'EE | dd/MM/YYYY | hh:mm a';

  // Actions variables
  @Input() showCopy: boolean = false;
  @Input() showActions: boolean = false;
  @Input() showActionsIcons: boolean = false;
  @Input() showActionsButtons: boolean = false;
  @Input() showConfirm: boolean = false;
  @Input() showDetails: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showCancelOrder: boolean = true;
  @Input() showEdit: boolean = false;
  @Input() showCopyAction: boolean = false;
  @Input() showResetPassword: boolean = false;

  // Paginator variables
  @ViewChild('paginator') paginator: Paginator | undefined;
  @Input() showPaginator: boolean = true;
  @Input() enablePaginator: boolean = true;
  @Input() pageActiveNumber: number = 0;
  @Input() showPaginationText: boolean = false;
  @Input() pageNumber: number = 1;
  @Input() pages: number = 0;
  @Input() results: number = 0;
  @Input() paginatorRows: number = 0;
  @Input() rowsPerPageOptions: number[] = [2, 4, 10];

  // Delete variables
  @Input() enableConfirmDeleteDialog: boolean = false;
  @Input() keyDelete: string = '';
  @Input() enableConfirmedByShowInput: boolean = false;

  // Not found image or text default value
  @Input() notFoundImage: string = 'assets/image/not-found/no-data.svg';
  @Input() notFoundText: string = this.publicService?.translateTextFromJson("general.no_records_found");
  @Input() addBtnText: string = '';
  @Input() showAddBtn: boolean = true;

  // key of item with filterArray
  @Input() arrayChildKey: string = '';

  // Nested table
  @Input() rowExpand: boolean = false;
  @Input() itemExpandKey: string = '';
  @Input() tableChildHeaders: any = [];
  @Input() showChildHeader: boolean = false;

  @Input() notesSelectedItems: boolean = false;
  @Input() showDefaultSelect: boolean = false;

  // Variables to enable to call function
  @Input() enableFilterDriverStatus: boolean = false;

  // send flag to the parent componenet to open dialogs and send data
  @Output() searchHandler: EventEmitter<any> = new EventEmitter();
  @Output() clearHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelectedItemsHandlerEmit: EventEmitter<any> = new EventEmitter();
  @Output() selectionHandler: EventEmitter<any> = new EventEmitter();
  @Output() arrangeHandler: EventEmitter<any> = new EventEmitter();
  @Output() customSortHandler: EventEmitter<any> = new EventEmitter();
  @Output() filterHandler: EventEmitter<any> = new EventEmitter();
  @Output() toggleStatusHandler: EventEmitter<any> = new EventEmitter();

  // Actions handler
  @Output() detailsHandler: EventEmitter<any> = new EventEmitter();
  @Output() confirmHandler: EventEmitter<any> = new EventEmitter();
  @Output() addHandler: EventEmitter<any> = new EventEmitter();
  @Output() editHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyActionHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemActionHandler: EventEmitter<any> = new EventEmitter();

  // pagination handler
  @Output() paginateHandler: EventEmitter<any> = new EventEmitter();
  @Output() paginateOptionsHandler: EventEmitter<any> = new EventEmitter();

  // Nested Table handler
  @Output() colEventHandler: EventEmitter<any> = new EventEmitter();
  @Output() editChildHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyChildHandler: EventEmitter<any> = new EventEmitter();
  @Output() resetPasswordHandler: EventEmitter<any> = new EventEmitter();
  @Output() cancelOrderHandler: EventEmitter<any> = new EventEmitter();

  @Output() itemChangeStatusHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemFilteredCount: EventEmitter<any> = new EventEmitter();

  @ViewChild('dropdown') dropdown: any;
  @ViewChild('dt1') dt: any;
  @ViewChild('search') search: any;

  // Table Variables
  tableDataCount: number = 0;
  selectedItems: any;
  selectedItemsCount: number = 0;
  isClear: boolean = false;
  isFilter: boolean = false;
  perPge: any = 10;
  paginateOption: any = null;

  // Array to add in dropdown or multi select to filter
  driverStatusList: any = [];

  skeletonItems: any;

  // Selected item variable
  countSelected: number = 0;
  selectedElements: any = [];
  selectAll: boolean = false;


  date: Date = new Date();
  searchItems: any = [];

  // Selected Columns to appear
  _selectedColumns: any[] = [];

  // Filters conditions
  filtersTable: any = [];

  //=====Start Time Filter=====
  collapse: boolean = false;
  operator: any = { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' };
  timeValue: any;

  collapseEnd: boolean = false;
  operatorEnd: any = { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' };
  timeValueEnd: any;

  timeList: any = [
    { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' },
    { name: this.publicService?.translateTextFromJson('primeng.timeIsNot'), operator: 'timeIsNot' },
    { name: this.publicService?.translateTextFromJson('primeng.timeBefore'), operator: 'timeBefore' },
    { name: this.publicService?.translateTextFromJson('primeng.timeAfter'), operator: 'timeAfter' },
  ];
  //=====End Time Filter=====

  url: any;
  collapseAssignMenu: boolean = false;

  currentLanguage: string;
  userLoginData: any = JSON.parse(window.localStorage.getItem(keys.userLoginData) || '{}');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    // private supervisorsService: SupervisorsService,
    // private driversService: DriversService,
    private dialogService: DialogService,
    public publicService: PublicService,
    // private alertsService: AlertsService,
    // private orderService: OrdersService,
    // private tanksService: TanksService,
    // private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }

    // Change page of pagination
    this.publicService?.changePageSub?.subscribe((res: any) => {
      if (res?.page) {
        this.changePageActiveNumber(res?.page);
      }
    });

    // Clear table
    this.publicService?.resetTable?.subscribe((res: any) => {
      if (res) {
        this.dt.clear();
      }
    });

    // url
    this.url = this.router?.url;

    // skeletonItems array
    this.skeletonItems = [0, 1, 2, 3, 4, 5];

    // Selected Columns
    this.tableHeaders?.forEach((item: any) => {
      if (item?.isSelected == false) { }
      else {
        this._selectedColumns?.push(item);
      }
    });

    // searchItems
    this.tableHeaders?.forEach((item: any) => {
      this.searchItems?.push(item?.field);
    });

    // Check if Variable true call function
    // if (this.enableFilterDriverStatus == true) {
    //   this.getDriverStatus();
    // }
  }

  //=====Start Selected columns=======
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.tableHeaders.filter((col: any) => val.includes(col));
  }
  //=====End Selected columns=======

  // ====Start Search=======
  searchHandlerEmit(event: any): void {
    this.searchHandler.emit(event)
  }
  clearSearchValue(search: any): void {
    search.value = '';
  }
  // ====End Search=======

  // ======Start selection action=======
  selectionHandlerEmit(): void {
    this.tableData.filter((val: any) => !this.selectedItems.includes(val));
    this.selectionHandler.emit(this.selectedItems);
  }
  deleteSelectedItems(): void {
    const ref = this.dialogService.open(ConfirmDeleteComponent, {
      data: {
        selectedItem: true,
        enableConfirm: false,
      },
      header: this.publicService?.translateTextFromJson('general.confirm_delete'),
      dismissableMask: false,
      width: '35%',
    });

    ref.onClose.subscribe((res: any) => {
      if (res?.confirmed) {
        this.tableData.filter((val: any) => !this.selectedItems.includes(val));
        this.deleteSelectedItemsHandlerEmit?.emit(this.selectedItems);
        this.selectedItems = null;
      }
    });
  }
  changeSelected(event: any, item: any): void {
    var index = this.selectedElements.findIndex((x: any) => x.id == item.id);
    if (event?.checked) {
      this.countSelected++;
      this.selectedElements.push(item)
    } else {
      this.countSelected--;
      this.selectedElements?.splice(index, 1)
    }
    this.countSelected == this.tableData?.length ? this.selectAll = true : this.selectAll = false;
    this.selectionHandler.emit(this.selectedElements);
    if (this.notesSelectedItems) {
      this.selectionHandler.emit({ items: this.selectedElements, item });
    } else {
      this.selectionHandler.emit(this.selectedElements);
    }
  }
  changeSelectedAll(event: any): void {
    this.selectAll = event?.checked;
    if (event?.checked) {
      this.tableData?.forEach((element: any) => {
        if (element.checked) {
          this.selectedElements?.forEach((selectedItem: any) => {
            if (element.id == selectedItem?.id) {
            }
          })
        } else {
          element.checked = true;
          this.selectedElements?.push(element);
        }
      });
    } else {
      this.tableData?.forEach((element: any) => {
        element.checked = false;
        this.selectedElements?.splice(element, 1);
      });
    }
    if (this.notesSelectedItems) {
      this.selectionHandler.emit({ items: this.selectedElements, selectedAll: true });
      // this.selectAll = false;
    } else {
      this.selectionHandler.emit(this.selectedElements);
    }
  }
  // ======End selection action=======

  // ======Start actions functions=======
  arrangeItems(item: any): void {
    this.arrangeHandler?.emit(item);
  }
  statusHandlerEmit(item: any): void {
    this.toggleStatusHandler?.emit(item)
  }
  detailsHandlerEmit(item: any): void {
    this.detailsHandler.emit(item);
  }
  confirmHandlerEmit(item: any): void {
    this.confirmHandler.emit(item);
  }
  copyHandlerEmit(item: any): void {
    this.copyHandler.emit({ item: item });
  }
  colEventHandlerEmit(item: any, type?: string): void {
    this.colEventHandler.emit({ item: item, type: type });
  }
  addHandlerEmit(): void {
    this.addHandler.emit();
  }
  editHandlerEmit(item: any): void {
    this.editHandler.emit(item);
  }
  copyActionHandlerEmit(item: any): void {
    this.copyActionHandler.emit(item);
  }
  resetPasswordHandlerEmit(item: any): void {
    this.resetPasswordHandler.emit(item);
  }
  deleteHandlerEmit(item: any): void {
    if (this.enableConfirmDeleteDialog) {
      const ref = this.dialogService.open(ConfirmDeleteComponent, {
        data: {
          name: item[this.keyDelete],
          enableConfirm: this.enableConfirmedByShowInput,
        },
        header: this.publicService?.translateTextFromJson('general.confirm_delete'),
        dismissableMask: false,
        width: '35%'
      });

      ref.onClose.subscribe((res: any) => {
        if (res?.confirmed) {
          this.deleteHandler?.emit({ item: item, confirmed: res?.confirmed });
        }
      });
    } else {
      this.deleteHandler?.emit({ item: item, confirmed: true });
    }
  }
  cancelOrderEmit(item: any): void {
    this.cancelOrderHandler?.emit(item);
  }
  editChildHandlerEmit(item: any): void {
    this.editChildHandler.emit(item);
  }
  copyChildHandlerEmit(item: any): void {
    this.copyChildHandler.emit(item);
  }
  itemActionEmitter(item: any): void {
    this.itemActionHandler?.emit(item);
  }
  itemChangeStatusActionEmitter(item: any): void {
    this.itemChangeStatusHandler?.emit(item);
  }
  isInputElement(target: EventTarget): target is HTMLInputElement {
    return (target as HTMLInputElement).value !== undefined;
  }
  // ======End actions functions=======

  // ======Start pagination========
  paginate(event?: any): void {
    this.countSelected = 0;
    this.selectedElements = [];
    this.pageNumber == 1 ? this.selectedItems = [] : '';
    this.pageNumber == 1 ? this.isClear = false : '';
    this.pageNumber = event?.page + 1;
    // (this.isClear) ? '' : this.paginateHandler?.emit(event);
    this.paginateHandler?.emit(event);
    // this.dropdown.value = this.paginateOption;
  }
  paginatorOption(e: any): void {
    this.showPaginator ? '' : this.paginateOptionsHandler?.emit(e);
    // this.isClear = false : '';
    // this.paginateOptionsHandler?.emit(e);
    // this.paginateOption = e.value;
    this.dropdown.value = e.value;
    this.perPge = e.value;
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  onPaginatorPageChange(event: any) {
    // console.log('lkkkk');

    // const currentRowsPerPage = event.rows;
    // const rowsPerPageOptionsDropdown: any = document.querySelector('.p-dropdown-items');
    // console.log(rowsPerPageOptionsDropdown);
    // console.log(rowsPerPageOptionsDropdown?.nativeElement);
    // console.log(rowsPerPageOptionsDropdown?.nativeElement.children);
    // console.log(rowsPerPageOptionsDropdown?.children.blur());
    // console.log(rowsPerPageOptionsDropdown.nativeElement);

    // rowsPerPageOptionsDropdown.value = currentRowsPerPage;
  }
  onPage(event: any) {
    // const rowsPerPage = event.rows;
    // this.dt.rows = rowsPerPage;
  }
  // ======End pagination========

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  // Clear table
  clear(table: any): void {
    // this.search.nativeElement.value = null;
    // this.dropdown.value = this.paginateOption;
    this.isClear = true;
    // table?.clear();
    // this.showPaginator ? '' : this.clearHandler?.emit({ isClear: true });
    this.tableHeaders?.forEach((element: any) => {
      element.showAscSort = false;
      element.showDesSort = false;
      element.showDefaultSort = true;
    });
    this.collapse = false;
    this.collapseEnd = false;
  }

  // Sort table
  customSort(event: any): void {
    // this.customSortHandler?.emit(event);
  }

  // Filter table
  customFilter(event: any, dt: any): void {
    this.isFilter = true;
    dt.filteredValue = this.tableData;
    this.filtersTable = event?.filters;
    // if (this.url?.includes('events-log')) {
    //   this.filtersTable['time'] = [
    //     {
    //       value: this.timeValue ? this.timeValue : null,
    //       matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
    //       operator: 'and', type: 'time'
    //     }];
    // }
    // if (this.url?.includes('articles-quality')) {
    //   this.filtersTable['evaluation_request_time'] = [
    //     {
    //       value: this.timeValue ? this.timeValue : null,
    //       matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
    //       operator: 'and', type: 'time'
    //     }];
    //   this.filtersTable['evaluation_time'] = [
    //     {
    //       value: this.timeValueEnd ? this.timeValueEnd : null,
    //       matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
    //       operator: 'and', type: 'time'
    //     }];
    // }
    // if (this.url?.includes('bank-update')) {
    //   this.filtersTable['update_time'] = [
    //     {
    //       value: this.timeValue ? this.timeValue : null,
    //       matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
    //       operator: 'and', type: 'time'
    //     }];
    //   this.filtersTable['request_time_evaluation'] = [
    //     {
    //       value: this.timeValueEnd ? this.timeValueEnd : null,
    //       matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
    //       operator: 'and', type: 'time'
    //     }];
    // }
    // this.filterHandler?.emit(this.filtersTable);
  }

  // Filter time
  applyTime(field: any, type?: any): void {
    if (type == 'end') {
      this.collapseEnd = false;
      this.filtersTable[field] = [
        {
          value: this.timeValueEnd ? this.timeValueEnd : null,
          matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    else {
      this.collapse = false;
      this.filtersTable[field] = [
        {
          value: this.timeValue ? this.timeValue : null,
          matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    // console.log(this.filtersTable);
    this.filterHandler?.emit(this.filtersTable);
  }
  clearTime(): void {
    this.timeValueEnd = null;
    this.operatorEnd = null;
    this.timeValue = null;
    this.operator = null;
  }

  //All function to get date of dropdowns
  // getDriverStatus(): any {
  //   this.driverStatusList = this.publicService.getDriverStatus();
  //   this.cdr.detectChanges();
  // }
  onImageError(item: any, col: any): void {
    item[col] = 'assets/images/not-found/no-img.webp';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
