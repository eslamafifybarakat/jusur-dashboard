import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullRegistrationComponent } from './successfull-registration.component';

describe('SuccessfullRegistrationComponent', () => {
  let component: SuccessfullRegistrationComponent;
  let fixture: ComponentFixture<SuccessfullRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessfullRegistrationComponent]
    });
    fixture = TestBed.createComponent(SuccessfullRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
