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
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';

//Services
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { PublicService } from './../../../services/generic/public.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    EmployeesListComponent,
    VehiclesListComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    ClientCardComponent,
    SkeletonComponent,
  ],
  selector: 'employees-vehicles-list',
  templateUrl: './employees-vehicles-list.component.html',
  styleUrls: ['./employees-vehicles-list.component.scss']
})
export class EmployeesVehiclesListComponent {
  private subscriptions: Subscription[] = [];
  @Input() recordId: number | string;

  dataStyleType: string = 'list';
  tabType: string = 'employee';

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

    this.publicService.isLoadingEmployees.subscribe((res) => {
      this.isLoadingList = res;
    });
    this.publicService.employeesLength.subscribe((res: any) => {
      if (res) {
        this.list = res;
      } else {
        this.list = 0;
      }
    });
    this.publicService.isLoadingSearchEmployees.subscribe((res: any) => {
      if (res) {
        this.isLoadingSearch = res;
      } else {
        this.isLoadingSearch = false;
      }
    });

    this.publicService.isLoadingVehicles.subscribe((res) => {
      this.isLoadingList = res;
    })
    this.publicService.VehicleLength.subscribe((res: any) => {
      if (res) {
        this.list = res;
      } else {
        this.list = 0;
      }
    });
    this.publicService.isLoadingSearchVehicles.subscribe((res: any) => {
      if (res) {
        this.isLoadingSearch = res;
      } else {
        this.isLoadingSearch = false;
      }
    });
  }
  // Toggle data type employees or vehicles
  showTabItems(type: string): void {
    this.list = 0;
    this.tabType = type;
    this.searchKeyword = null;
    this.dataStyleType = 'list';
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
    this.tabType == 'employee' ? this.publicService.toggleFilterEmployeeDataType.next(type) : this.publicService.toggleFilterVehicleDataType.next(type);
  }

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.tabType == 'employee' ? this.publicService.searchEmployeesData.next(keyWord) : this.publicService.searchVehiclesData.next(keyWord);
  }
  clearSearch(search: any): void {
    search.value = null;
    this.tabType == 'employee' ? this.publicService.searchEmployeesData.next(null) : this.publicService.searchVehiclesData.next(null);
  }
  // End Search

  // Add Item
  addItem(): void {
    this.tabType == 'employee' ? this.publicService.addEmployeeItem.next(true) : this.publicService.addVehicleItem.next(true);
  }

  // Filter Item Modal
  filterItemModal(): void {
    this.tabType == 'employee' ? this.publicService.filterEmployeesData.next(true) : this.publicService.filterVehiclesData.next(true);
  }

  // Clear table
  clearTable(): void {
    this.tabType == 'employee' ? this.publicService.resetEmployeesData.next(true) : this.publicService.resetVehiclesData.next(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
