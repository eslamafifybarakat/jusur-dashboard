import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVehiclesComponent } from './filter-vehicles.component';

describe('FilterVehiclesComponent', () => {
  let component: FilterVehiclesComponent;
  let fixture: ComponentFixture<FilterVehiclesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterVehiclesComponent]
    });
    fixture = TestBed.createComponent(FilterVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
