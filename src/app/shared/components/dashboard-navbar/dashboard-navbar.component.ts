import { AuthService } from './../../../services/authentication/auth.service';
import { Router, RouterModule } from '@angular/router';
// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    RouterModule,
    SidebarModule,

    // Components
    LanguageSelectorComponent,
    UserInfoComponent,
    AsideMenuComponent,
  ],
  selector: 'dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent {
  showSidebar: boolean = false;
  currentUserInfo: any;
  showLogo: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.showLogo = !this.router.url.includes('dashboard');
  }
  getCurrentUserInfo(): void {
    this.currentUserInfo = this.authService.getCurrentUserInformationLocally();
  }
  openSidebar(): void {
    this.showSidebar = true;
  }
}
