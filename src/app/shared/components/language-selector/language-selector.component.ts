import { TranslationService } from '../../../services/generic/translation.service';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { keys } from '../../configs/localstorage-key';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  currentLanguage: string | null = '';
  language: string = '';
  page: string = '';
  collapse: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translationService: TranslationService,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  shouldApplyDarkToggle(): boolean {
    const includedPages = [
      'place-details',
      'store-details',
      'stores',
      'events',
      'restaurant-details',
      'stories',
      'searchResult'
    ];
    return !includedPages.includes(this.page);
  }
}
