import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSingleFileInputComponent } from './upload-single-file-input.component';

describe('UploadSingleFileInputComponent', () => {
  let component: UploadSingleFileInputComponent;
  let fixture: ComponentFixture<UploadSingleFileInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadSingleFileInputComponent]
    });
    fixture = TestBed.createComponent(UploadSingleFileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
