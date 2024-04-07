import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOverlayLoadingComponent } from './search-overlay-loading.component';

describe('SearchOverlayLoadingComponent', () => {
  let component: SearchOverlayLoadingComponent;
  let fixture: ComponentFixture<SearchOverlayLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchOverlayLoadingComponent]
    });
    fixture = TestBed.createComponent(SearchOverlayLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
