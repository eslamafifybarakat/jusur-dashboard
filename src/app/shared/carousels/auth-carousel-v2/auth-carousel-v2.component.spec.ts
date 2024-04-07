import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCarouselV2Component } from './auth-carousel-v2.component';

describe('AuthCarouselV2Component', () => {
  let component: AuthCarouselV2Component;
  let fixture: ComponentFixture<AuthCarouselV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthCarouselV2Component]
    });
    fixture = TestBed.createComponent(AuthCarouselV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
