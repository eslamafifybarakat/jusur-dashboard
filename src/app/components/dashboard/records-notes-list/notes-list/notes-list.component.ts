import { NotesListApiResponse, NotesListingItem } from './../../../../interfaces/dashboard/notes';
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
import { NoteCardComponent } from './note-card/note-card.component';

//Services
import { LocalizationLanguageService } from './../../../../services/generic/localization-language.service';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { MetadataService } from './../../../../services/generic/metadata.service';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { NotesService } from '../../services/notes.service';
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
    SkeletonComponent,
    NoteCardComponent,
  ],
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {
  private subscriptions: Subscription[] = [];

  @Input() clientId: number | string;

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Notes List Variables
  isLoadingNotesList: boolean = false;
  notesList: NotesListingItem[] = [];
  notesCount: number = 0;
  tableHeaders: any = [];
  // End Notes List Variables

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
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private notesService: NotesService,
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
      if (res) {
        this.changeDateStyle(res);
      }
    });

    this.publicService.addRecordItem.subscribe(res => {
      if (res) {
        this.addItem();
      }
    });

    this.publicService.resetRecordsData.subscribe(res => {
      if (res) {
        this.clearTable();
      }
    });

    this.publicService.searchRecordsData.subscribe(res => {
      if (res) {
        this.searchHandler(res);
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
  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.getAllNotes(false);
    this.searchSubject.pipe(debounceTime(500)) // Throttle time in milliseconds (1 seconds)
      .subscribe(event => { this.searchHandler(event); });
  }
  private updateMetaTagsForSEO(): void {

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

  // Start Notes List Functions
  getAllNotes(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingNotesList = true;
    this.notesService?.getNotesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.clientId)
      .pipe(
        tap((res: NotesListApiResponse) => this.processNotesListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeNoteListLoading())
      ).subscribe();
  }
  private processNotesListResponse(response: any): void {
    if (response) {
      this.notesCount = response?.result?.totalCount;
      this.pagesCount = Math.ceil(this.notesCount / this.perPage);
      this.notesList = response?.result?.items;
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeNoteListLoading(): void {
    this.isLoadingNotesList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    this.notesList = [
      { id: 1, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias culpa voluptatum repudiandae accusantium animi cumque minima, magnam, obcaecati quod natus mollitia totam facilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
      { id: 2, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias culpa voluptatum repudiandae accusantium animi cumque minima, magnam, obcaecati quod natus mollitia totam facilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
      { id: 3, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias culpa voluptatum repudiandae accusantium animi cumque minima, magnam, obcaecati quod natus mollitia totam facilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
      { id: 1, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias culpa voluptatum repudiandae accusantium animi cumque minima, magnam, obcaecati quod natus mollitia totam facilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
      { id: 2, description: ' cumque minima, magnam, obcaecati quod natus mollitia totam facilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
      { id: 3, description: 'Lorem ipsum dolor sitfacilis quasi, laborum illum officiis sed adipisci rerum!', date: new Date() },
    ];
    this.notesCount = 20;
  }
  // End Notes List Functions

  // Start Search
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 8;
    this.searchKeyword = keyWord;
    this.isLoadingNotesList = true;
    this.isSearch = true;
    this.getAllNotes(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllNotes(true);
  }
  // End Search

  // Add Note
  addItem(item?: any, type?: any): void { }

  // Filter Note Modal
  filterItemModal(): void {
    // const ref = this.dialogService?.open(FilterRecordComponent, {
    //   header: this.publicService?.translateTextFromJson('general.filter'),
    //   dismissableMask: false,
    //   width: '45%',
    //   data: this.filterCards,
    //   styleClass: 'custom-modal',
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res) {
    //     this.page = 1;
    //     this.filtersArray = res.conditions;
    //     this.filterCards = res.conditions;
    //     this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    //     this.getAllNotes(true);
    //   }
    // });
  }

  // Clear Data
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.getAllNotes();
  }

  // Start Pagination
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllNotes();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.notesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    this.dataStyleType == 'grid' ? this.getAllNotes() : '';
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
    this.finalizeNoteListLoading();
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
