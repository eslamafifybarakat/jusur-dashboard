import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRecordComponent } from './filter-record.component';

describe('FilterRecordComponent', () => {
  let component: FilterRecordComponent;
  let fixture: ComponentFixture<FilterRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterRecordComponent]
    });
    fixture = TestBed.createComponent(FilterRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
