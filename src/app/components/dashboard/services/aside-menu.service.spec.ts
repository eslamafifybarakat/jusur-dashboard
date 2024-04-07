import { TestBed } from '@angular/core/testing';

import { AsideMenuService } from './aside-menu.service';

describe('AsideMenuService', () => {
  let service: AsideMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsideMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
