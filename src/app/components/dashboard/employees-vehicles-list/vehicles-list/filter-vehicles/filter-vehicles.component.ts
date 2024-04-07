// Modules
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

//Services
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    CommonModule,
    FormsModule,
  ],
  selector: 'app-filter-vehicles',
  templateUrl: './filter-vehicles.component.html',
  styleUrls: ['./filter-vehicles.component.scss']
})
export class FilterVehiclesComponent {

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
      operatingCard: ['', {
        validators: [], updateOn: "blur"
      }],
      endDate: [null, {
        validators: []
      }],
      insuranceExpiryDate: [null, {
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
      if (item.column == 'operatingCard') {
        this.formControls.operatingCard.setValue(item.data);
      }
      if (item.column == 'endDate') {
        this.formControls.endDate.setValue(item.data);
      }
      if (item.column == 'insuranceExpiryDate') {
        this.formControls.insuranceExpiryDate.setValue(item.data);
      }
    });
  }

  submit(): any {
    let data = {
      operatingCard: this.modalForm?.value?.operatingCard,
      endDate: this.modalForm?.value?.endDate,
      insuranceExpiryDate: this.modalForm?.value?.insuranceExpiryDate
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

