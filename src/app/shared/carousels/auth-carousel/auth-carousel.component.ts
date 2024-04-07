import { authCarouselAr, authCarouselEn } from './auth-carousel';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { sliderItems } from './../../../interfaces/auth';
import { keys } from '../../configs/localstorage-key';
import { isPlatformBrowser } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  standalone: true,
  imports: [CarouselModule],
  selector: 'auth-carousel',
  templateUrl: './auth-carousel.component.html',
  styleUrls: ['./auth-carousel.component.scss']
})
export class AuthCarouselComponent {
  currentLanguage: string | null = '';
  authSlider: sliderItems[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
    this.authSlider = this.currentLanguage == 'ar' ? authCarouselAr : authCarouselEn;
  }
}
