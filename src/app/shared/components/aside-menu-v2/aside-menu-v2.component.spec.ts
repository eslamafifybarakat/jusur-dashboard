import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideMenuV2Component } from './aside-menu-v2.component';

describe('AsideMenuV2Component', () => {
  let component: AsideMenuV2Component;
  let fixture: ComponentFixture<AsideMenuV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsideMenuV2Component]
    });
    fixture = TestBed.createComponent(AsideMenuV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
