import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRecordsComponent } from './client-records.component';

describe('ClientRecordsComponent', () => {
  let component: ClientRecordsComponent;
  let fixture: ComponentFixture<ClientRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRecordsComponent]
    });
    fixture = TestBed.createComponent(ClientRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
