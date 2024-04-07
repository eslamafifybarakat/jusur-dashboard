import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCardComponent } from './vehicle-card.component';

describe('VehicleCardComponent', () => {
  let component: VehicleCardComponent;
  let fixture: ComponentFixture<VehicleCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleCardComponent]
    });
    fixture = TestBed.createComponent(VehicleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
