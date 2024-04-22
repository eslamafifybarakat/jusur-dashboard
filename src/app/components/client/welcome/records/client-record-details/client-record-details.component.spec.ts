import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRecordDetailsComponent } from './RecordDetails.component';

describe('ClientRecordDetailsComponent', () => {
  let component: ClientRecordDetailsComponent;
  let fixture: ComponentFixture<ClientRecordDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRecordDetailsComponent]
    });
    fixture = TestBed.createComponent(ClientRecordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
