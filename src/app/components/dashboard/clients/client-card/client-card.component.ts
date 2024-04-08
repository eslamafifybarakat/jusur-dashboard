import { Component, Inject, Input, Output, PLATFORM_ID, EventEmitter } from '@angular/core';
import { ClientListingItem } from './../../../../interfaces/dashboard/clients';
import { keys } from './../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent {
  @Input() item: ClientListingItem;
  currentLanguage: string;
  @Output() itemDetailsHandler: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  itemDetails(item: any): void {
    this.itemDetailsHandler.emit(item);
  }
}
