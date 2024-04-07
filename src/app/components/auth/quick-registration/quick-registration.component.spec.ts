import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickRegistrationComponent } from './quick-registration.component';

describe('QuickRegistrationComponent', () => {
  let component: QuickRegistrationComponent;
  let fixture: ComponentFixture<QuickRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickRegistrationComponent]
    });
    fixture = TestBed.createComponent(QuickRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
