import { TranslationService } from '../../../services/generic/translation.service';
import { PublicService } from './../../../services/generic/public.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

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
    public translationService: TranslationService,
    private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
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
