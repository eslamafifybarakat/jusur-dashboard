import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEmployeesComponent } from './filter-employees.component';

describe('FilterEmployeesComponent', () => {
  let component: FilterEmployeesComponent;
  let fixture: ComponentFixture<FilterEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterEmployeesComponent]
    });
    fixture = TestBed.createComponent(FilterEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
