import { CommonModule, isPlatformBrowser } from '@angular/common';
import { keys } from '../../../shared/configs/localstorage-key';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'error404',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {
  currentLanguage: string | null = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
}
