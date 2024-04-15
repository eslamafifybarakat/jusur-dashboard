import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSvgComponent } from './dynamic-svg.component';

describe('DynamicSvgComponent', () => {
  let component: DynamicSvgComponent;
  let fixture: ComponentFixture<DynamicSvgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicSvgComponent]
    });
    fixture = TestBed.createComponent(DynamicSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
