import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRecordCardComponent } from './client-record-card.component';

describe('ClientRecordCardComponent', () => {
  let component: ClientRecordCardComponent;
  let fixture: ComponentFixture<ClientRecordCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRecordCardComponent]
    });
    fixture = TestBed.createComponent(ClientRecordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
