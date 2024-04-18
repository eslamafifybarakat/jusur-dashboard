import { Component, EventEmitter, Inject, Output, PLATFORM_ID, Input } from '@angular/core';
import { EmployeesListingItem } from './../../../../../interfaces/dashboard/employees';
import { keys } from './../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent {
  @Input() item: EmployeesListingItem;
  currentLanguage: string;
  @Output() editItemHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemDetailsHandler: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  editItem(item: any): void {
    this.editItemHandler.emit(item);
  }
  itemDetails(item: any): void {
    this.itemDetailsHandler.emit(item);
  }
}
