import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCarouselComponent } from './auth-carousel.component';

describe('AuthCarouselComponent', () => {
  let component: AuthCarouselComponent;
  let fixture: ComponentFixture<AuthCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthCarouselComponent]
    });
    fixture = TestBed.createComponent(AuthCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
