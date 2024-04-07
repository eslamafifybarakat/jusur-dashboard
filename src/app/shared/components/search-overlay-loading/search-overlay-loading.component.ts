import { PublicService } from './../../../services/generic/public.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { keys } from '../../configs/localstorage-key';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'search-overlay-loading',
  templateUrl: './search-overlay-loading.component.html',
  styleUrls: ['./search-overlay-loading.component.scss']
})
export class SearchOverlayLoadingComponent {
  currentLanguage: string | null = '';
  show_overlay: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }

    this.publicService.showSearchLoader.subscribe((res: any) => {
      if (res == true) {
        this.show_overlay = true;
      } else {
        this.show_overlay = false;
      }
    });
  }
}
