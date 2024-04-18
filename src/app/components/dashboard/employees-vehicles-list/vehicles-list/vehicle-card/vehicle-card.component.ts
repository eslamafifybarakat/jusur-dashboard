import { Component, EventEmitter, Inject, Output, PLATFORM_ID, Input } from '@angular/core';
import {
  VehiclesListingItem
} from './../../../../../interfaces/dashboard/vehicles';
import { keys } from './../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss']
})
export class VehicleCardComponent {
  @Input() item: VehiclesListingItem;
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
