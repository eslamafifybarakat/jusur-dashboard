import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {
  name: any;
  inputName: string = '';
  enableConfirm: boolean = false;
  confirmed: boolean = true;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.name = this.config?.data?.name;
    this.enableConfirm = this?.config?.data?.enableConfirm;
  }

  confirm(): void {
    this.confirmed = true;
    this.ref?.close({ confirmed: this.confirmed });
  }

  cancel(): void {
    this.confirmed = false;
    this.ref?.close({ confirmed: this.confirmed });
  }
}
