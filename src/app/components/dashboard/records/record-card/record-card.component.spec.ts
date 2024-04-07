import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordCardComponent } from './record-card.component';

describe('RecordCardComponent', () => {
  let component: RecordCardComponent;
  let fixture: ComponentFixture<RecordCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordCardComponent]
    });
    fixture = TestBed.createComponent(RecordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
