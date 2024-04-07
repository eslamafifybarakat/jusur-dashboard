import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterClientsComponent } from './filter-clients.component';

describe('FilterClientsComponent', () => {
  let component: FilterClientsComponent;
  let fixture: ComponentFixture<FilterClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterClientsComponent]
    });
    fixture = TestBed.createComponent(FilterClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
