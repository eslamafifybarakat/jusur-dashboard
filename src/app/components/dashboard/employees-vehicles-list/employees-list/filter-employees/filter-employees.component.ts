// Modules
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-filter-employees',
  templateUrl: './filter-employees.component.html',
  styleUrls: ['./filter-employees.component.scss']
})
export class FilterEmployeesComponent {

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
      fullName: ['', {
        validators: [
          Validators?.minLength(3)], updateOn: "blur"
      }],
      residencyNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      endDate: [null, {
        validators: []
      }],
      healthCertificate: ['', {
        validators: [], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  patchValue(data: any): void {
    let filters = data;
    filters.forEach((item: any) => {
      if (item.column == 'fullName') {
        this.formControls.fullName.setValue(item.data);
      }
      if (item.column == 'residencyNumber') {
        this.formControls.residencyNumber.setValue(item.data);
      }
      if (item.column == 'endDate') {
        this.formControls.endDate.setValue(item.data);
      }
      if (item.column == 'healthCertificate') {
        this.formControls.healthCertificate.setValue(item.data);
      }
    });
  }

  submit(): any {
    let data = {
      fullName: this.modalForm?.value?.fullName,
      residencyNumber: this.modalForm?.value?.residencyNumber,
      endDate: this.modalForm?.value?.endDate,
      healthCertificate: this.modalForm?.value?.healthCertificate
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

  close(): void {
    this.ref?.close({ listChanged: false });
  }
}

