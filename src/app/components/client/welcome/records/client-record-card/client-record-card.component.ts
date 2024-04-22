import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { RecordsListingItem } from '../../../../../interfaces/dashboard/records';
import { keys } from '../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  selector: 'client-record-card',
  templateUrl: './client-record-card.component.html',
  styleUrls: ['./client-record-card.component.scss']
})
export class ClientRecordCardComponent {
  @Input() item: RecordsListingItem;
  @Input() isClientHistoryCard: boolean = true;
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
