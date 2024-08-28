import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Component, Inject, Input, Output, PLATFORM_ID, EventEmitter } from '@angular/core';
import { ClientListingItem } from './../../../../interfaces/dashboard/clients';
import { PublicService } from 'src/app/services/generic/public.service';
import { keys } from './../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

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

 // Delete variables
 @Input() showDeleteBtn: boolean = false;
 @Input() enableConfirmDeleteDialog: boolean = false;
 @Input() keyDelete: string | number | null = null;
 @Input() enableConfirmedByShowInput: boolean = false;
  @Output() deleteHandler: EventEmitter<any> = new EventEmitter();
  
  @Output() itemDetailsHandler: EventEmitter<any> = new EventEmitter();
  @Output() activateHandler: EventEmitter<any> = new EventEmitter();
  @Output() suspendHandler: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogService:DialogService,
    private publicService:PublicService
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
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
