import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationV2Component } from './registration-v2.component';

describe('RegistrationV2Component', () => {
  let component: RegistrationV2Component;
  let fixture: ComponentFixture<RegistrationV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationV2Component]
    });
    fixture = TestBed.createComponent(RegistrationV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
