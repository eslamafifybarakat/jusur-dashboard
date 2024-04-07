// Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { DashboardNavbarComponent } from './../../shared/components/dashboard-navbar/dashboard-navbar.component';
import { AsideMenuComponent } from './../../shared/components/aside-menu/aside-menu.component';
import { FooterComponent } from './../../shared/components/footer/footer.component';
import { AlertsService } from './../../services/generic/alerts.service';

@Component({
  standalone: true,
  imports: [
    // Modules
    RouterModule,
    CommonModule,

    // Components
    DashboardNavbarComponent,
    AsideMenuComponent,
    FooterComponent,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;
  toggleSideMenu: boolean = false;

  constructor(
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.alertsService?.openToast('success', 'success', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
    this.alertsService?.openToast('info', 'info', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
    this.alertsService?.openToast('warn', 'warn', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
    this.alertsService?.openToast('error', 'error', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
  }

  //  Method to handle the side menu collapse on screens
  onToggleSideNav(data: any): void {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }

  // Method to determine the CSS class based on screen width
  getDashClass(): string {
    let styleClass = '';
    if (this.isSideNavCollapsed && this.screenWidth > 768 && !this.toggleSideMenu) {
      styleClass = 'dash-trimmed';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 0 && !this.toggleSideMenu) {
      styleClass = 'dash-md-screen';
    }
    return styleClass;
  }
}
