import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesVehiclesListComponent } from './employees-vehicles-list.component';

describe('EmployeesVehiclesListComponent', () => {
  let component: EmployeesVehiclesListComponent;
  let fixture: ComponentFixture<EmployeesVehiclesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeesVehiclesListComponent]
    });
    fixture = TestBed.createComponent(EmployeesVehiclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
