// Modules
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { AuthCarouselV2Component } from './../../shared/carousels/auth-carousel-v2/auth-carousel-v2.component';
import { AuthCarouselComponent } from './../../shared/carousels/auth-carousel/auth-carousel.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    RouterModule,
    CommonModule,

    // Components
    AuthCarouselComponent,
    AuthCarouselV2Component,
  ],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  showSlider: boolean = true;
  sliderType: string = 'banner';
  isRoundBanner: boolean = false;

  constructor(
    private router: Router
  ) {
    this.showSlider = router.url.includes('successful') ? false : true
  }
}
