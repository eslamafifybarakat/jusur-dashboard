import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMultiFilesComponent } from './upload-multi-files.component';

describe('UploadMultiFilesComponent', () => {
  let component: UploadMultiFilesComponent;
  let fixture: ComponentFixture<UploadMultiFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadMultiFilesComponent]
    });
    fixture = TestBed.createComponent(UploadMultiFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
