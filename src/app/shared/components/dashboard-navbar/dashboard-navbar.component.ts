import { AuthService } from './../../../services/authentication/auth.service';
// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  userData: any;

  constructor(
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.getUserData();
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }
  openSidebar(): void {
    this.showSidebar = true;
  }
}
