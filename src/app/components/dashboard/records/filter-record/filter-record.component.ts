import { DynamicDialogConfig } from 'primeng/dynamicdialog';
// Modules
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

//Services
import { PublicService } from './../../../../services/generic/public.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule,
  ],
  selector: 'app-filter-record',
  templateUrl: './filter-record.component.html',
  styleUrls: ['./filter-record.component.scss']
})
export class FilterRecordComponent {
  constructor(
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    let data = this.config.data;
    if (data) {
      this.patchValue(data);
    }
  }

  modalForm = this.fb?.group(
    {
      recordName: ['', {
        validators: [
          Validators?.minLength(3)], updateOn: "blur"
      }],
      recordNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      endDate: [null, {
        validators: []
      }],
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  patchValue(data: any): void {
    let filters = data;
    filters.forEach((item: any) => {
      if (item.column == 'recordName') {
        this.formControls.recordName.setValue(item.data);
      }
      if (item.column == 'recordNumber') {
        this.formControls.recordNumber.setValue(item.data);
      }
      if (item.column == 'endDate') {
        this.formControls.endDate.setValue(item.data);
      }
    });
  }

  submit(): any {
    let data = {
      recordName: this.modalForm?.value?.recordName,
      recordNumber: this.modalForm?.value?.recordNumber,
      endDate: this.modalForm?.value?.endDate
    };
    let conditions = [];
    for (const [key, value] of Object.entries(data)) {
      // Check if the value exists and is not empty
      if (value) {
        // Determine the operator based on the type of data
        const operator = (typeof value === 'string') ? 'startsWith' : 'dateIs';
        // Push the condition object into the conditions array
        conditions.push({ "column": key, "type": typeof value, "data": value, "operator": operator });
      }
    }
    this.ref.close({ conditions: conditions });
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
}

