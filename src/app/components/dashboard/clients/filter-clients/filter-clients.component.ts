import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from './../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { patterns } from './../../../../shared/configs/patterns';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, CalendarModule], selector: 'filter-clients',
  templateUrl: './filter-clients.component.html',
  styleUrls: ['./filter-clients.component.scss']
})
export class FilterClientsComponent {
  modalForm = this.fb?.group(
    {
      fullName: ['', {
        validators: [
          Validators?.minLength(3)], updateOn: "blur"
      }],
      id: ['', {
        validators: [], updateOn: "blur"
      }],
      phoneNumber: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
      birthDate: [null, {
        validators: []
      }],

    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }
  constructor(
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    let data = this.config.data;
    if (data) {
      this.patchValue(data);
    }
  }

  patchValue(data: any): void {
    let filters = data;
    filters.forEach((item: any) => {
      if (item.column == 'id') {
        this.formControls.id.setValue(item.data);
      }
      if (item.column == 'fullName') {
        this.formControls.fullName.setValue(item.data);
      }
      if (item.column == 'mobileNumber') {
        this.formControls.phoneNumber.setValue(item.data);
      }
      if (item.column == 'birthDate') {
        this.formControls.birthDate.setValue(item.data);
      }
    });
  }

  submit(): any {
    let data = {
      fullName: this.modalForm?.value?.fullName,
      mobileNumber: this.modalForm?.value?.phoneNumber,
      id: this.modalForm?.value?.id,
      birthDate: this.modalForm?.value?.birthDate
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
    this.ref.close();
  }
}
