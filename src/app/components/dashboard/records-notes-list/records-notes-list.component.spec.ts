import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsNotesListComponent } from './records-notes-list.component';

describe('RecordsNotesListComponent', () => {
  let component: RecordsNotesListComponent;
  let fixture: ComponentFixture<RecordsNotesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsNotesListComponent]
    });
    fixture = TestBed.createComponent(RecordsNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
