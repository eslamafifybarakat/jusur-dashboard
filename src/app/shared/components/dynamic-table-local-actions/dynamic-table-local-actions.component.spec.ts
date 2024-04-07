import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableLocalActionsComponent } from './dynamic-table-local-actions.component';

describe('DynamicTableLocalActionsComponent', () => {
  let component: DynamicTableLocalActionsComponent;
  let fixture: ComponentFixture<DynamicTableLocalActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableLocalActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableLocalActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
