import { keys } from './../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  selector: 'error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component {
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
