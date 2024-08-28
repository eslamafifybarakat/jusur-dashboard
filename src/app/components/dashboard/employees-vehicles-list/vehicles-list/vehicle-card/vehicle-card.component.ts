import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID, Input } from '@angular/core';
import { VehiclesListingItem } from './../../../../../interfaces/dashboard/vehicles';
import { PublicService } from 'src/app/services/generic/public.service';
import { keys } from './../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

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
  @Output() activateHandler: EventEmitter<any> = new EventEmitter();
  @Output() suspendHandler: EventEmitter<any> = new EventEmitter();

  // Delete variables
  @Input() showDeleteBtn: boolean = false;
  @Input() enableConfirmDeleteDialog: boolean = false;
  @Input() keyDelete: string | number | null = null;
  @Input() enableConfirmedByShowInput: boolean = false;
  @Output() deleteHandler: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogService: DialogService,
    private publicService: PublicService
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

  activateHandlerEmit(item: any): void {
    this.activateHandler.emit(item);
  }
  suspendHandlerEmit(item: any): void {
    this.suspendHandler.emit(item);
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
}
